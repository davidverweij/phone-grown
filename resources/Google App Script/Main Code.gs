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
  doc.setActiveSheet(doc.getSheetByName(sheetNames.home));
}


/**
 * Changes were made to the Sheet. I.e. new data came in.
 * @param {Event} e - The event object containing details
 */
function somethingChanged(e){

  switch(e.changeType){

    // (A) One new row of data came in.
    case "INSERT_ROW": {
      let doc = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = doc.getSheetByName(sheetNames.dataIn);
      let newRows = sheet.getLastRow();

      // (1) Get the data and store them elsewhere (to prevent API 2000 row limit)
      if (newRows > 0){
        let lastColumn = sheet.getLastColumn();
        let values = sheet.getRange(1, 1, newRows, lastColumn).getValues();
        let targetSheet = doc.getSheetByName(sheetNames.dataStored);
        let ruleActivated = false;

        values.forEach(function(row, index) {
          // (2) Activate 'rules' where applicable
          if (activateRule(row[0], doc)) ruleActivated = true;
          // (3) Store data for future reference
          prependRow(targetSheet, row, true);
        });

        // (4) When a rule was activated, let the phone know
        if (ruleActivated) pingDatabase();

        // (5) Clear all confirmed data
        sheet.deleteRows(1, newRows);
      }
      break;
    }
    // (B) The user edited the spreadsheet.
    case "EDIT": {
      let doc = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = doc.getSheetByName(sheetNames.home);
      let lastRow = sheet.getLastRow();
      let range = sheet.getRange(columns.test + rows.firstRule + ":" + columns.test + lastRow);   //A1notation, e.g. 'Q1:Q7'
      let values = range.getValues();

      // (1) Determine if test-checkbox is checkend
      values.forEach(function(row, index) {

        // (2) If yes, inform the phone to update
        if (row[0] == true) {
          // TODO: update phone!
          let ui = SpreadsheetApp.getUi();
          ui.alert('Rule ' + (index + 1) + ' is now being tested for 20 seconds.');

          // Logging
          if (activeLogging) prependRow(doc.getSheetByName(sheetNames.logs), "Testing Rule " + (index + 1), true);
        }
      });

      range.uncheck();
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
 * The webapp was contacted (HTTPS)
 * @param {Event} e - The event object containing details
 */

function doGet(e) {
  // (1) Prevent simultaneuous access to this script, 10 seconds before concedig defeat
  var lock = LockService.getPublicLock().waitLock(10000);

  try {
    if (typeof(e) != 'undefined') {
      let doc = SpreadsheetApp.openById(script.getProperty("key")); // getting sheet by ID instead of 'activeSpreadsheet()'
      let origin = e.parameter.origin;
      let data = e.parameter.data;
      let result = {"result" : "error - wrong use of the webapp"};  // prepare reply

      // the GET request's body must contain 'origin' (= phone) and a data parameter
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){

        // (2) Update connection status on the home sheet
        updatePhoneStatus(doc, "Phone seen on: " + (new Date()).toLocaleDateString('en-GB', { timeZone: 'UTC' }));
        result.result = "succes!";

        // If requested, send back the database id
        if (data == "database"){
          result.databasePing = script.getProperty("userID");
        }

        // (3) return any 'new' command if present. The phone will keep track of all past commands (over overlap them()
        let todo = script.getProperty("todo");

        if (todo.length != 0){
          scritp.setProperty("todo", []);
        }

        // (4) Get and respond with an array of background colors to display
        result.background = doc.getRange(targetSheetName + "!" + backgroundRange).getBackgrounds();           // AM HERE I AM HERE

        // Logging history
        if (activeLogging) prependRow(doc.getSheetByName(logSheetName), "Testing " + name, true);
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
  let name = doc.getActiveSheet().getName();
  script.setProperty("testBackground", name);    // store the name
  pingDatabase();                                // ping the database, so the phone can retreive the new data

  //Logging History
  if (activeLogging) prependRow(doc.getSheetByName(logSheetName), "Testing " + name, true);
}

/**
 * Add another rule to the home page
 */
function addRule() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(homeSheetName);
  let lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();
  sheet.getRange(firstRuleRow, 1, 1, lastColumn).copyTo(sheet.getRange(lastRow+2, 1, 1, lastColumn));

  // Logging history
  if (activeLogging) prependRow(doc.getSheetByName(logSheetName), "New Rule created", true);
}

/**
 * Add another background to the sheets
 */
function addBackground() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = doc.getSheets();

  // (1) Find all the background sheets, trim and search for the largets 'number'
  let backgrounds = findSheets(sheets, backgroundSheetName);
  let newest = Math.max(...(backgrounds).map(x => parseInt(x.replace(backgroundSheetName, "")))) + 1;
  let template = doc.getSheetByName(backgrounds[0]);
  let newName = name + " " + newest;

  // (2) Create a new background based on the first, and update the list of backgrounds
  template.copyTo(doc).setName(newName);
  backgrounds.push(newName);
  doc.getRange(listOfBackgrounds + (backgrounds.length + 1)).setValues(backgrounds.map(x => [x]));

  // Logging History
  if (activeLogging) prependRow(doc.getSheetByName(logSheetName), "New Background created: " + newName, true);
}

/**
 * Sets up the script to connect to the database anonymously,
 * and start listening to changes to the sheet (for incoming data).
 */
function setup() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();

  // (1) Store the ID to this spreadsheet in this script
  script.setProperty("key", doc.getId());
  script.setProperty("testBackground", "no");
  script.setProperties(columnsConvertedtoInt());

  // (2) Create a new anonymous user in the Firestore Database
  // newAnonymousUser();

  // (3) Install a trigger that listen to spreadsheet changes by the user (e.g. adding/removing sheets or deleting columns)
  /*ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(doc)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create();
  */

  // (4) Update system status
  updatePhoneStatus(doc, "Awaiting phone connection...");

  // Logging History
  if (activeLogging) prependRow(doc.getSheetByName(logSheetName), "Setup. New Anonymous User Created", true);
}
