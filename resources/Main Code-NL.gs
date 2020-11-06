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
          if (activateRule(row[0], doc, timeNow, index)) {
            ruleActivated = true;

            // Logging
            if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Regel geactiveerd: " + row[0]], true);
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
      if (sleeptimesString != getSleepTimes(doc, true)){
        storeSleepTimes(doc, sleeptimesString);
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
            addPhoneInstruction(doc, [instruction], timeNow);
            need_to_ping = false;
            pingDatabase(timeNow);

            // (4) Uncheck the checked checkbox
            sheet.getRange(index+1,variables.columns.test.index+1,1,1).uncheck();

            // Logging
            if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Test regel " + (((index + 1) - variables.fixed.firstRule)/2+1) + ((row[variables.columns.durationUnit.index] == "indefinite") ? ' indefinitely' : (' voor ' + row[variables.columns.duration.index] + ' ' + row[variables.columns.durationUnit.index])) + '.' ], true);

            // (5) Inform the user of the action through a popup
            SpreadsheetApp.getUi().alert('Regel ' + ((((index + 1) - variables.fixed.firstRule)/2)+1) + ' word nu getest ' + ((row[variables.columns.durationUnit.index] == "indefinite") ? 'indefinitely' : ('voor ' + row[variables.columns.duration.index] + ' ' + row[variables.columns.durationUnit.index])) + '.');


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
* Store (or retrieve) the instructions for the phone in the sheet
* This was previously done in the scriptproperties, but gave inconsistent results
*
* @param {Google Doc} doc - The Google Sheet document to store it in
* @param {String} instructions - a stringified JSON object
*/
function storeTodos(doc, instructions){
  doc.getRange(variables.sheetNames.home + '!' + variables.ranges.todos).setValue(instructions);
}
function retrieveTodos(doc){
  return doc.getRange(variables.sheetNames.home + '!' + variables.ranges.todos).getValue();
}

/**
* Store (or retrieve) the clearphone timestamp
* This was previously done in the scriptproperties, but gave inconsistent results
*
* @param {Google Doc} doc - The Google Sheet document to store it in
* @param {String} timestamp - the latest clearphone timestamp
*/
function storeClearPhone(doc, timestamp){
  doc.getRange(variables.sheetNames.home + '!' + variables.ranges.clearphone).setValue(timestamp);
}
function retrieveClearPhone(doc){
  return doc.getRange(variables.sheetNames.home + '!' + variables.ranges.clearphone).getValue();
}

/**
* Check if the conditions trigger a set rule. Sleep mode times is handled by the phone locally
*
* @param {String} name - The name of the incoming data trigger
* @param {Google Doc} doc - The Google Sheet document to search in
* @param {Integer} timestamp - Unix timestamp of the time now
* @param {Integer} data_row_index - Index from the row that contained this data
*/
function activateRule(name, doc, timestamp, data_row_index){
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

  if (triggered) addPhoneInstruction(doc, instructions, timestamp);

  return triggered;
}

/**
* Clear any instructions and instruct the phone to clear its screen
*/
function clearPhone(){
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let now = Math.floor((new Date()).getTime()/1000);
  storeTodos(doc, '[]');
  storeClearPhone(doc, now);

  pingDatabase(now);       // ping the database, so the phone can retrieve the new instruction

  //Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Mobiel scherm gezuiverd"], true);

  // Inform the user
  SpreadsheetApp.getUi().alert("Het scherm van je mobiel zou nu zwart moeten zijn, en enige geactiveerde instructies (regels) ongedaan gemaakt.");
}

/**
* Get the set sleep mode for the phone
* Returns integer array: [fromhour,fromminute,tohour,tominute]
*
* @param {Google Doc} doc - The reference Google Sheet
* @param {Boolean} store - if true, get a stored copy of this result (to check if it changed)
*/
function getSleepTimes(doc, store = false){
  if (store) {
    return doc.getRange(variables.sheetNames.home + '!' + variables.ranges.sleeptimes).getValue();
  } else {
    let sleepmode = doc.getRange(variables.sheetNames.home + "!" + variables.ranges.sleepModus).getValues();
    let from = sleepmode[0][1].split(":").map(x => parseInt(x.trim()));   // from = [hours, minutes];
    let to = sleepmode[0][3].split(":").map(x => parseInt(x.trim()));
    return from.concat(to);
  }
}
function storeSleepTimes(doc, times){
  doc.getRange(variables.sheetNames.home + '!' + variables.ranges.sleeptimes).setValue(times);
}

/**
* Add another instruction for the phone, and remove old uncollected triggers
* Currently stores this in script properties. Alternative: stored in the sheet cells.
*
* @param {Google Doc} doc - The reference Google Sheet
* @param {Array} instructions - An array of instructions to add. See doGet() for the structure
* @param {Integer} timestamp - The current time to compare todos with
*/
function addPhoneInstruction(doc, instructions, timestamp){
  // (1) Get all current triggers
  let todo = JSON.parse(retrieveTodos(doc));

  // (2) Remove old and collected triggers
  if (todo == '') todo = [];
  todo = todo.filter(inst => ((inst.timestamp + inst.duration) > timestamp));

  // (3) A script property value can only be max 9kb. One instruction is ~600b, so assuming max 10 instructions. FIFO. See https://developers.google.com/apps-script/guides/services/quotas#current_limitations
  todo = todo.concat(instructions);
  todo = todo.slice(-10);              // keeping only the last 10 elements

  // (4) Add the new triggers, and store all in the script properties
  storeTodos(doc, JSON.stringify(todo));
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
*        timestamp: 1595432159  // (unix) timestamp of when it was triggered
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
      let lastInstruction = e.parameter.lastInstruction;

      // the GET request's body must contain 'origin' (= phone) and a data parameter
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){

        // (2) Update connection status on the home sheet
        doc.getRange(variables.sheetNames.home + '!' + variables.ranges.lastSeen).setValue(new Date(e.parameter.now));

        result.result = "success";
        try {
          result.sleeptimes = getSleepTimes(doc, true); // get a stored copy of the sleeptimes
          result.clear = retrieveClearPhone(doc);
        } catch(err){
          throw "500: retrieving data from sheet";
        }


        // If requested, send back the database id
        if (data == "database"){
          result.databasePing = script.getProperty("userID");
        }

        // (3a) Add backgrounds that need 'representing'. This could be empty. The phone will keep track of all past commands (over overlap them)
        try {
          let todos = JSON.parse(retrieveTodos(doc));
          if (todos == null) todos = [];
          todos = JSON.stringify(todos.filter(inst => inst.timestamp > lastInstruction)); // filter old instructions

          result.todo = todos;
          storeTodos(doc, todos);
        } catch (err){
          throw "500: phone instruction retrieval or storage";
        }
      } else {
        throw "500: Bad server request";
      }
    } else {
      throw "500: Bad server request";
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
  addPhoneInstruction(doc,[instruction], now);
  pingDatabase(now);       // ping the database, so the phone can retrieve the new instruction

  //Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Test " + sheet.getName()], true);

  // Inform the user
  SpreadsheetApp.getUi().alert(sheet.getName() + ' wordt nu getest voor 30 seconds.');
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
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Nieuwe regel aangemaakt"], true);
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
    if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Nieuwe achtergrond aangemaakt: " + newName], true);
  } else {
    SpreadsheetApp.getUi().alert('Alert! Helaas kan je maar 10 achtegronden maken. Hergebruik een bestaande of verwijder een van de achtergronden.');
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

  // reset variables stored inside the sheet
  storeTodos(doc, '[]');
  storeSleepTimes(doc, "[0,0,0,0]");
  storeClearPhone(doc, 0);


  let triggerID = ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(doc)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create()
  .getUniqueId();

  script.setProperty("triggerID", triggerID);
  
  // (4) Update system status
  updatePhoneStatus(doc, "Wachtend op verbinding met mobiel...");

  // Logging History
  if (activeLogging) prependRow(doc.getSheetByName(variables.sheetNames.logs), ["Start. Nieuwe anonieme gebruiker aangemaakt: " + script.getProperty("userID")], true);

  // (5) Inform the user of the action through a popup
   SpreadsheetApp.getUi().alert('Start stap 1 gedaan!');

}
