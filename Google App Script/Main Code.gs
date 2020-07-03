/*
 * AUTHOR: David Verweij
 * VERSION: 1 (June 2020)
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
 * Add menu items when the Google Sheet is opened.
 */
function onOpen() {
  var menuItems = [{name: '⚙️ Setup', functionName: 'setup'},{name: '📱 Setup Phone', functionName: 'dialog_addPhone'}, {name: '📈 New Data Source', functionName: 'dialog_newSource'}];
  SpreadsheetApp.getActive().addMenu('♻️📱 PhoneGrown', menuItems);
  sortSheets();
}

/**
 * Changes were made to the Sheet. I.e. new data came in.
 * @param {Event} e - The event object containing details
 */
function somethingChanged(e){
  if (e.changeType == "REMOVE_GRID"){                 // A sheet was deleted!
    updateDataSheets();                               // Update representation of data sheets
  } else if (e.changeType == "INSERT_ROW") {          // New data came in!
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(homesheet.datasheet);
    var newRows = sheet.getLastRow();

    if (newRows > 0){                                           // Check if we actually have new data, else ignore
      var lastColumn = sheet.getLastColumn();
      var range = sheet.getRange(1, 1, newRows, lastColumn);
      var array = range.getValues();

      for (var i = 0; i < newRows; i++) {
        var data_sheetname = homesheet.data + ' ' + array[i][0];
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
  } else if (e.changeType == "OTHER" || e.changeType == "FORMAT"){
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(homesheet.name);
    var colorpreview = sheet.getRange(homesheet.colorlist[0],homesheet.colorlist[1],homesheet.colorlist[2]);
    var colorvalues = colorpreview.getValues();
    colorpreview.setBackgrounds(colorvalues);
    colorpreview.setFontColors(colorvalues);

    var phonerange = sheet.getRange(homesheet.phone[0],homesheet.phone[1], homesheet.phone[2]);
    var phonevalues = phonerange.getValues();

    var fullPhone = doc.getRange(homesheet.device + "!" + homesheet.fullphone).getValue();
    var fullPhoneRange = doc.getRange(homesheet.device + "!" + fullPhone);
    fullPhoneRange.setBackground("black");

    for (i in phonevalues) {
      if (phonevalues[i][0] != ""){
        var area = phonevalues[i][0].match(/\[(.*?)\]/gm)[0];
        area = area.replace(/\[|\]/gm,'');
        if (area != "") {
          var tempRange = doc.getRange(homesheet.device + "!" + area);
          tempRange.setBackground(colorvalues[i][0]);
        }
      }
    }
    pingDatabase();                                           // ping the database, so the phone can retreive the new data
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
    var sheet = doc.getSheetByName(homesheet.name);           // get the incoming data sheet
    var result = {"result" : "error - wrong use of the webapp"};
    if (typeof(e) != 'undefined') {
      var origin = e.parameter.origin;
      var data = e.parameter.data;
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){
        result.result = "succes!";
        sheet.getRange(31, 2).setValue((new Date()).toLocaleDateString('en-GB', { timeZone: 'UTC' }));
        if (data == "database"){
          result.databasePing = script.getProperty(database.userid);                                      // send back the database id
        }
        var fullPhone = doc.getRange(homesheet.device + "!" + homesheet.fullphone).getValue();          // get phone sheet size
        var fullPhoneBackgrounds = doc.getRange(homesheet.device + "!" + fullPhone).getBackgrounds();   // return all background
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




// Open a dialog box that allows the creation of a fresh phone based on template
function dialog_addPhone(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  var templates = findSheets(sheets, homesheet.template);

  var html='';
  if (templates.length > 0){
    for (var i = 0; i < templates.length; i++){
      html += '<input type="button" value="' + templates[i].replace(homesheet.template, '') + '" onclick="google.script.run.createPhoneSheet(\'' + templates[i] + '\');google.script.host.close();" />';
    }
  } else {
    html = 'Sorry, but I could not find any template sheets. These should start with "' + homesheet.template + '"';
  }

  var output = HtmlService.createHtmlOutput(html)
  .setWidth(200);

  SpreadsheetApp.getUi().showModalDialog(output, 'Which template would you like to use?');
}

// Open a dialog box that to enter a preformatted row from IFTTT. In essence, this created a new header row
function dialog_newSource(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.prompt(
      'Add a new data source',
      'Please paste the "Formatted Row" from IFTTT here:',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {

    // User clicked "OK". Create the data sheet (if not already present) and add the content as header
    var rowdata = text.replace(/{|}/g,"").split("|||");
    var data_sheetname = homesheet.data + ' ' + rowdata[0].trim();
    var data_sheet = doc.getSheetByName(data_sheetname);    // get the specific data sheet

    if (data_sheet == null){                                // create the sheet if it doesn't exist
      data_sheet = doc.insertSheet(data_sheetname, doc.getNumSheets()).setTabColor("4a85e7");
      updateDataSheets();
      sortSheets();
    }
    var rowdataColumned = rowdata.map(x => [x.trim(), ]);
    var testdata = Array.from(Array(rowdata.length), function(x, index) {if(index == 0){return [rowdata[0]]} else {return ['testdata ' + index]}});
    prependRow(data_sheet,testdata);
    prependRow(data_sheet,rowdataColumned, 1);                        // move one row of data to its sheet

  }
}


// Method called from the dialogbox, deletes an existing phone sheet and replaces it
function createPhoneSheet(name){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var template = doc.getSheetByName(name);

  var sheet = doc.getSheetByName(homesheet.device);
  if (sheet != null){
    doc.deleteSheet(sheet);
  }

  template.copyTo(doc).setName(homesheet.device).setTabColor("ff00ff");

  sortSheets();
}

/**
 * Sets up the script to connect to the database anonymously,
 * and start listening to changes to the sheet (for incoming data).
 */
function setup() {
  // yet TODO: check if requests succeed and fix / inform google sheet user
  var thisSheet = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Store the ID to this spreadsheet in this script, and create variable to use
  script.setProperty("key", thisSheet.getId());

  // 2. Create a new anonymous user in the Firestore Database
  newAnonymousUser();

  // 5. Install a trigger that listen to spreadsheet changes by the user (e.g. adding/removing sheets or deleting columns)
  ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(thisSheet)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create();
}
