/*
 * AUTHOR: David Verweij
 * VERSION: 1 (July 2020)
 * NOTE: This program is still in development.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * @OnlyCurrentDoc Limits the script to only accessing the current sheet.
*/


/**
 * Changes were made to the Sheet. I.e. new data came in.
 * @param {Event} e - The event object containing details
 */
function somethingChanged(e){
  if (e.changeType == "INSERT_ROW") {          // New data came in!
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(script.getProperty("incomingDataSheet"));
    var newRows = sheet.getLastRow();

    if (newRows > 0){                                           // Check if we actually have new data, else ignore
      var lastColumn = sheet.getLastColumn();
      var range = sheet.getRange(1, 1, newRows, lastColumn);
      var array = range.getValues();

      for (var i = 0; i < newRows; i++) {
        var data_sheetname = app.data_template + ' ' + array[i][0];
        var data_sheet = doc.getSheetByName(data_sheetname);    // get the specific data sheet

        if (data_sheet == null){                                // create the sheet if it doesn't exist
          data_sheet = doc.insertSheet(data_sheetname, doc.getNumSheets()).setTabColor("4a85e7");
          updateDataSheets();
          sortSheets();
        }
        prependRow(data_sheet,array[i]);                        // move one row of data to its sheet
      }
      sheet.deleteRows(1, newRows);                             // delete the original data
    }
  } else if (e.changeType == "EDIT") {          // Let's check for a test or (de)activate 'signal'
    let doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(script.getProperty("homeSheet"));
    let lastRow = sheet.getLastRow();
    let testColumn = script.getProperty("testColumn");
    let range = sheet.getRange(testColumn + "1:" + testColumn + lastRow);
    let values = range.getValues();

    let change = false;
    values.forEach(function(row, index) {
      if (row[0] == true) {
        // test it!
        let ui = SpreadsheetApp.getUi();
        ui.alert('Rule ' + (index - 1) + ' is now being tested for 20 seconds.');
      }
    });
    range.uncheck();

  } else {
    console.log(e.changeType);
  }

}


// The webapp was contacted (HTTPS). Check if this is a phone and reply with details
// @param {Event} e - The event object containing details
function doGet(e) {

  var lock = LockService.getPublicLock();  // prevent simultaneuous access to this script
  lock.waitLock(10000);                    // wait 10 seconds before conceding defeat.

  try {
    var doc = SpreadsheetApp.openById(script.getProperty("key"));  // get this sheet's ID
    var sheet = doc.getSheetByName(app.home);           // get the incoming data sheet
    var result = {"result" : "error - wrong use of the webapp"};
    if (typeof(e) != 'undefined') {
      var origin = e.parameter.origin;
      var data = e.parameter.data;
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){
        result.result = "succes!";
        sheet.getRange(31, 2).setValue((new Date()).toLocaleDateString('en-GB', { timeZone: 'UTC' }));
        if (data == "database"){
          result.databasePing = script.getProperty("userID");                                      // send back the database id
        }

        let test = script.getProperty("testBackground");
        let fullPhoneBackgrounds = [];
        var fullPhone = "";

        if (test != null || test == false) {
          fullPhone = test;
          script.setProperty("testBackground", false);     // delete the test, so it only occurs once
        } else {
          fullPhone = doc.getRange(app.device + "!" + app.fullphone).getValue();          // get phone sheet size
          fullPhoneBackgrounds = doc.getRange(app.device + "!" + fullPhone).getBackgrounds();   // return all background
        }
        result.background = fullPhoneBackgrounds;
      }
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    console.log(e);
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock(); //release lock
  }
}

/**
 * Send the background to the phone to preview the result.
 */
function testBackground() {
  let name = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  script.setProperty("testBackground", name);                                               // store the name
  pingDatabase();                                                                 // ping the database, so the phone can retreive the new data
}

/**
 * Add another rule to the home page
 */
function addRule() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(script.getProperty("homeSheet"));
  let lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();
  let ruleTemplate = parseInt(script.getProperty("firstRuleRow"));
  sheet.getRange(ruleTemplate, 1, 1, lastColumn).copyTo(sheet.getRange(lastRow+2, 1, 1, lastColumn));
}

/**
 * Add another background to the sheets
 */
function addBackground() {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = doc.getSheets();
  let name = script.getProperty("backgroundSheetName");
  let backgrounds = findSheets(sheets, script.getProperty("backgroundSheetName"));
  let newest = Math.max(...(backgrounds).map(x => parseInt(x.replace(name, "")))) + 1;
  let template = doc.getSheetByName(backgrounds[0]);
  let newName = name + " " + newest;
  template.copyTo(doc).setName(name + " " + newest).setTabColor("ff00ff");
  backgrounds.push(newName);
  doc.getRange("[SETTINGS]!C2:C"+ (backgrounds.length + 1)).setValues(backgrounds.map(x => [x]));
}

/**
 * Sets up the script to connect to the database anonymously,
 * and start listening to changes to the sheet (for incoming data).
 */
function setup() {
  // yet TODO: check if requests succeed and fix / inform google sheet user
  var thisSheet = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Store the ID to this spreadsheet in this script, as well as all variables in '[SETTINGS]'
  script.setProperty("key", thisSheet.getId());
  getVariableFromSettings();

  // 2. Create a new anonymous user in the Firestore Database
  // newAnonymousUser();

  // 5. Install a trigger that listen to spreadsheet changes by the user (e.g. adding/removing sheets or deleting columns)
  /*ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(thisSheet)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create();
  */
}
