/* AUTHOR: David Verweij
* VERSION: 3 (July 2020)
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*
* @OnlyCurrentDoc Limits the script to only accessing the current sheet.
*/


/**
* Make the 'Home Tab' active when opening the spreadsheet
*/
function onOpen() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  doc.setActiveSheet(doc.getSheetByName(variables.sheetNames.home));
}


/**
* Changes were made to the Sheet. E.g.. new data came in or the spreadsheet was edited
* Using the onChange() approach does not provide details of the change unfortunately.
*
* @param {Event} e - The event object containing details
*/
function somethingChanged(e){
  let doc = SpreadsheetApp.getActiveSpreadsheet();

  switch(e.changeType){
      // (A) One new row of data came in.
    case "INSERT_ROW": {
      let sheet = doc.getSheetByName(variables.sheetNames.dataIn);
      let newRows = sheet.getLastRow();

      // (1) Get the data and store them elsewhere (to prevent API 2000 row limit)
      if (newRows > 0){
        let lastColumn = sheet.getLastColumn();
        let values = sheet.getRange(1, 1, newRows, lastColumn).getValues();
        let targetSheet = doc.getSheetByName(variables.sheetNames.dataStored);
        let ruleActivated = false;
        let timeNow = Math.floor((new Date()).getTime()/1000);

        values.forEach(function(row, index) {
          // (2) Activate 'rules' where applicable
          if (activateRule(row[0], doc, timeNow)) {
            ruleActivated = true;

            // Logging
            if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Rule Activated: " + row[0]], true);
          }
          // (3) Store data for future reference
          prependRow(targetSheet, row, true);
        });

        // (4) When a rule was activated, let the phone know
        if (ruleActivated) pingDatabase(timeNow);

        // (5) Clear all confirmed data
        sheet.deleteRows(1, newRows);
      }
      break;
    }
      // (B) The user edited the spreadsheet.
    case "EDIT": {
      let sheet = doc.getSheetByName(variables.sheetNames.home);

      // (0) update the phone sleep times, in case these were edited
      let need_to_ping = false;
      let sleeptimesString = JSON.stringify(getSleepTimes(doc));
      if (sleeptimesString != script.getProperty("sleeptimes")){
        script.setProperty("sleeptimes", sleeptimesString);
        need_to_ping = true;
      }



      // (1) Get all data from the Home sheet
      let values = sheet.getDataRange().getValues();

      // (2) Run through all rows starting at the first rule row, and check if it being tested
      values.every(function(row, index){
        if (index >= variables.fixed.firstRule-1){

          // (3) if the rule tickbox is TRUE, add the instruction
          if (row[variables.columns.test.index]){
            let timeNow = Math.floor((new Date()).getTime()/1000);
            let duration = calcDuration(row[variables.columns.duration.index], row[variables.columns.durationUnit.index]);
            let instruction = {
              backgrounds : doc.getSheetByName(row[variables.columns.background.index]).getRange(variables.ranges.background).getBackgrounds(),
              duration    : duration,
              timestamp   : timeNow,
            };
            addPhoneInstruction([instruction], timeNow);
            need_to_ping = false;
            pingDatabase(timeNow);

            // (4) Uncheck the checked checkbox
            sheet.getRange(index+1,variables.columns.test.index+1,1,1).uncheck();

            // Logging
            if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Test trigger Rule " + (((index + 1) - variables.fixed.firstRule)/2+1) + ((row[variables.columns.durationUnit.index] == "indefinite") ? ' indefinitely' : (' for ' + row[variables.columns.duration.index] + ' ' + row[variables.columns.durationUnit.index])) + '.' ], true);

            // (5) Inform the user of the action through a popup
            SpreadsheetApp.getUi().alert('Rule ' + ((((index + 1) - variables.fixed.firstRule)/2)+1) + ' is now being tested ' + ((row[variables.columns.durationUnit.index] == "indefinite") ? 'indefinitely' : ('for ' + row[variables.columns.duration.index] + ' ' + row[variables.columns.durationUnit.index])) + '.');


            return false; // stops the values.every loop
          }
        }
        return true;
      });

      // if there hasen't been a ping, but still needed, do so here.
      if (need_to_ping) pingDatabase( Math.floor((new Date()).getTime()/1000));

      break;
    }
      // (C) The user potentially removed a sheet
    case "REMOVE_GRID": {
      // (1) Check if the background scheet list is correct
      let sheets = doc.getSheets();
      let backgrounds = findSheets(sheets, variables.sheetNames.backgrounds);
      backgrounds = backgrounds.concat(Array(variables.fixed.totalBackgrounds - backgrounds.length).fill(""));
      doc.getRange(variables.sheetNames.home + '!' + variables.ranges.listOfBackgrounds).setValues([backgrounds]);
      break;
    }
    default:
      // for all types, see https://developers.google.com/apps-script/guides/triggers/events#change
      // TODO: if a sheet is deleted, check if:
      //  (1) all sheets needed are here
      //  (2) 1. Incoming Data is the first sheet
      //  (3) Update all background sheets to get an accurate representation
      break;



  }
}


/**
* Check if the conditions trigger a set rule. Sleep mode times is handled by the phone locally
*
* @param {String} name - The name of the incoming data trigger
* @param {Google Doc} doc - The Google Sheet document to search in
* @param {Integer} timestamp - Unix timestamp of the time now
*/
function activateRule(name, doc, timestamp){
  let triggered = false;
  let instructions = [];

  // (1) Get all data from the Home sheet
  let values = doc.getSheetByName(variables.sheetNames.home).getDataRange().getValues();

  // (2) Run through all rows starting at the first rule row, and check if it complies
  values.forEach(function(row, index){
    if (index >= variables.fixed.firstRule-1){

      // (3) if the name corresponds, AND it is 'activated', trigger a phone update
      if (row[variables.columns.rule.index] == name && row[variables.columns.active.index]){
        let instruction = {
          backgrounds : doc.getSheetByName(row[variables.columns.background.index]).getRange(variables.ranges.background).getBackgrounds(),
          duration    : calcDuration(row[variables.columns.duration.index], row[variables.columns.durationUnit.index]),
          timestamp   : timestamp,
        };
        instructions.push(instruction);
        triggered = true;
      }
    }
  });

  if (triggered) addPhoneInstruction(instructions, timestamp);

  return triggered;
}

function clearPhone(){
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  script.setProperty("todo", JSON.stringify([]));
  script.setProperty("clearPhone", true);

  pingDatabase(Math.floor((new Date()).getTime()/1000));       // ping the database, so the phone can retreive the new instruction

  //Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Cleared phone screen"], true);

  // Inform the user
  SpreadsheetApp.getUi().alert("The phone screen should now be cleared, and free of any outstanding instructions");

}

/**
* Get the set sleep mode for the phone
* Returns integer array: [fromhour,fromminute,tohour,tominute]
*
* @param {Google Doc} doc - The reference Google Sheet
*/
function getSleepTimes(doc){
  let sleepmode = doc.getRange(variables.sheetNames.home + "!" + variables.ranges.sleepModus).getValues();
  let from = sleepmode[0][1].split(":").map(x => parseInt(x.trim()));   // from = [hours, minutes];
  let to = sleepmode[0][3].split(":").map(x => parseInt(x.trim()));
  return from.concat(to);
}

/**
* Add another instruction for the phone, and remove old uncollected triggers
* Currently stores this in script properties. Alternative: stored in the sheet cells.
*
* @param {Array} instructions - An array of instructions to add. See doGet() for the structure
* @param {Integer} timestamp - The current time to compare todos with
*/
function addPhoneInstruction(instructions, timestamp){
  // (1) Get all current triggers
  let todo = JSON.parse(script.getProperty("todo"));

  // (2) Remove past and uncollected triggers
  if (todo == null) todo = [];
  todo.forEach(function(instruction, index, thisObject){
    if (instruction.duration > 0 && (instruction.timestamp + instruction.duration) < timestamp) thisObject.splice(index,1);
  });

  // (3) A script property value can only be max 9kb. One instruction is ~600b, so assuming max 10 instructions. FIFO. See https://developers.google.com/apps-script/guides/services/quotas#current_limitations
  todo = todo.concat(instructions);
  todo = todo.slice(-10);              // keeping only the last 10 elements

  // (4) Add the new triggers, and store all in the script properties
  script.setProperty("todo", JSON.stringify(todo));
}

/**
* The webapp was contacted (HTTPS)
*
* @param {Event} e - The event object containing details
*
* Returns an object of instructions, similar to:
*
* {
*   result: 'success',
*   todo: [               // array of object representing backgrounds to show
*      {
*        backgrounds: [   // a grid of backgrounds colours to show
*            [#000000, #000000, #000000, #000000],
*            [#000000, #000000, #000000, #000000],
*            // etc
*        ],
*        duration: 18000        // duration of showing in seconds
*        triggered: 1595432159  // (unix) timestamp of when it was triggered
*      },
*      {
*        backgrounds: [
*            [#000000, #000000, #000000, #000000],
*            [#000000, #000000, #000000, #000000],
*            // etc
*        ],
*        duration: 18000
*        triggered: 1595432159  // (unix) timestamp of when it was triggered
*      },
*      // etc
*   ],
*   databasePing: 'userIdxxx'  // optional, if requested
* }
*/

function doGet(e) {
  // (1) Prevent simultaneuous access to this script, 10 seconds before concedig defeat
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    let result = {"result" : "error - wrong use of the webapp"};  // prepare reply

    if (typeof(e) != 'undefined') {
      let doc = SpreadsheetApp.openById(script.getProperty("key")); // getting sheet by ID instead of 'activeSpreadsheet()'
      let origin = e.parameter.origin;
      let data = e.parameter.data;

      // the GET request's body must contain 'origin' (= phone) and a data parameter
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){

        // (2) Update connection status on the home sheet
        doc.getRange(variables.sheetNames.home + '!' + variables.ranges.lastSeen).setValue(new Date(e.parameter.now));
        result.result = "success";
        result.sleeptimes = script.getProperty("sleeptimes");
        result.clear = script.getProperty("clearPhone");

        // If requested, send back the database id
        if (data == "database"){
          result.databasePing = script.getProperty("userID");
        }

        // (3a) Add backgrounds that need 'representing'. This could be empty. The phone will keep track of all past commands (over overlap them)
        // Note: in this implementation, the todo's will keep piling up until retreived. This needs to be addressed in the future.
        result.todo = script.getProperty("todo");

        // (3b) Clear the list of instructions
        script.setProperties({
          "todo" :'[]',
          "clearPhone" : false
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  catch(e){
    console.log(e);
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock(); //release lock
  }
}

/**
* Send the background to the phone to preview the result.
*/
function testBackground() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getActiveSheet();
  let now = Math.floor((new Date()).getTime()/1000);
  let instruction = {
    backgrounds : sheet.getRange(variables.ranges.background).getBackgrounds(),
    duration    : 30,
    timestamp   : now,
  };
  addPhoneInstruction([instruction], now);
  pingDatabase(now);       // ping the database, so the phone can retreive the new instruction

  //Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Testing " + sheet.getName()], true);

  // Inform the user
  SpreadsheetApp.getUi().alert(sheet.getName() + ' is now being tested for 30 seconds.');
}

/**
* Add another rule to the home page
*/
function addRule() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(variables.sheetNames.home);
  let lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();
  sheet.getRange(variables.fixed.firstRule, 1, 1, lastColumn).copyTo(sheet.getRange(lastRow+2, 1, 1, lastColumn));

  // Logging history
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["New Rule created"], true);
}

/**
* Add another background to the sheets
*/
function addBackground() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = doc.getSheets();

  // (1) Find all the background sheets, trim and search for the largets 'number'
  let backgrounds = findSheets(sheets, variables.sheetNames.backgrounds);
  let newest = Math.max(...(backgrounds).map(x => parseInt(x.replace(variables.sheetNames.backgrounds, "")))) + 1;
  if (newest <= variables.fixed.totalBackgrounds){
    let template = doc.getSheetByName(backgrounds[0]);
    let newName = variables.sheetNames.backgrounds + " " + newest;

    // (2) Create a new background based on the first, and update the list of backgrounds
    let newBackground = template.copyTo(doc).setName(newName);
    newBackground.getRange("C3:G12").setBackground("black")
    backgrounds.push(newName);
    backgrounds = backgrounds.concat(Array(variables.fixed.totalBackgrounds - backgrounds.length).fill(""));
    doc.getRange(variables.sheetNames.home + '!' + variables.ranges.listOfBackgrounds).setValues([backgrounds]);

    // Logging History
    if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["New Background created: " + newName], true);
  } else {
    SpreadsheetApp.getUi().alert('Alert! Unfortunately, the total backgrounds is currently limited to 10. Please reuse an existing one, or delete a background sheet and create a new one. Thanks!');
  }
}

/**
* Sets up the script to connect to the database anonymously,
* and start listening to changes to the sheet (for incoming data).
*/
function setup() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();

  // (1) Store the ID to this spreadsheet in this script
  script.setProperty("key", doc.getId());

  // (2) Create a new anonymous user in the Firestore Database
  newAnonymousUser();

  // (3) Install a trigger that listen to spreadsheet changes by the user (e.g. adding/removing sheets or deleting columns)
  deleteTrigger(script.getProperty("triggerID"));

  let triggerID = ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(doc)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create()
  .getUniqueId();

  script.setProperty("triggerID", triggerID);
  script.setProperty("sleeptimes", JSON.stringify(getSleepTimes(doc)));
  script.getProperty("false");

  // (4) Update system status
  updatePhoneStatus(doc, "Awaiting phone connection...");

  // Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Setup. New Anonymous User Created: " + script.getProperty("userID")], true);
}
