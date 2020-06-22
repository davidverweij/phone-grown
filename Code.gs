/**
* @OnlyCurrentDoc Limits the script to only accessing the current sheet.
*/

// TODO: Explain database and safety thereof! (link to github?)
// TODO: refresh token before lifetime (e.g. everyday? Or every 50 to 'ping' we are alive? Or based on a setting in the google sheet? (prevent redundant communication)
// using firebase authentication, avoiding service account and also adheres to firebase rules!
// TODO: Sort Function seems to break?

var script = PropertiesService.getScriptProperties();        // secure 'local' storage of values repeatadly needed
var homesheet = {
  'name'          : '2. Home',           // the main sheet to interact with
  'datasheet'     : '1. Incoming Data',  // the data sheet (must be first!) 
  'device'        : '3. Phone',          // name convention for connected device
  'template'      : '[Template]',        // name convention for templates
  'data'          : '[Data]',            // name concention for data sheets
  'devicelist'    :  [23, 2, 10],        // location of the devices on the sheet {row, column, maxnumber}
  'datalist'      :  [6, 8, 10],         // location of the devices on the sheet {row, column, maxnumber}
  'colorlist'     :  [20, 19, 8],        // rows that could be used as colorouput
  'phone'         :  [20, 14, 8],        // column with reference to the phone ranges 
  'fullphone'     :  "A1:A1"             // cell in the phone sheet storing full phone size
};
var database = {                                             // settings and naming convention for database details
  'signup'        : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',                                    
  'refresh'       : 'https://securetoken.googleapis.com/v1/token?key=',                                                   
  'url'           : 'https://firestore.googleapis.com/v1/projects/sheetablephone/databases/(default)/documents/anonymous/',
  'id'            : 'AIzaSyAAtx_UIictBak4_bZ5tPuRVMOagCUan_w',                                                             
  
  // naming conventions
  'userid'        : 'uid',                      
  'auth_token'    : 'token',
  'refresh_token' : 'r_token',
};

// used in the custom formula
var operators = {
  'is bigger than': function(a, b) { return a > b },
  'is smaller than': function(a, b) { return a < b },
  'is exactly': function(a, b) { return a == b },
  'is not': function(a, b) { return a != b },
};


//  1. Run > setup
//  2. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//  3. Copy the 'Current web app URL' and paste this in the 'Home' sheet
//  4. Enter the resulting code into the browser on your old phone. Enjoy!


/**
 * Add menu items when the Google Sheet is opened.
 */
function onOpen() {
  var menuItems = [{name: '⚙️ Setup', functionName: 'setup'},{name: '📱 Setup Phone', functionName: 'addphone'}];
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


/**
 * The webapp was contacted (HTTPS). Check if this is a phone and reply with details
 * @param {Event} e - The event object containing details
 */
function doGet(e) {                        
  
  var lock = LockService.getPublicLock();  // prevent simultaneuous access to this script
  lock.waitLock(10000);                    // wait 10 seconds before conceding defeat.
  
  try {
    var doc = SpreadsheetApp.openById(script.getProperty("key"));  // get this sheet's ID
    var sheet = doc.getSheetByName(homesheet.datasheet);           // get the incoming data sheet
    var result = {"result" : "error - wrong use of the webapp"};
    if (typeof(e) != 'undefined') {
      var origin = e.parameter.origin;   
      var data = e.parameter.data;
      if (typeof(origin) != "undefined" && typeof(data) != "undefined" && origin == "phone"){     
        result.result = "succes!";
        sheet.getRange(2, 24).setValue((new Date()).toString());
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

/**
 * Find all sheets that store incoming data, and update the home sheet.
 */
function updateDataSheets(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  var home = doc.getSheetByName(homesheet.name);
  
  var datasheets = findSheets(sheets, homesheet.data);                // find all sheets that relate to devices
  var datasheetsColumned = datasheets.map(x => [x]);
  
  var filler = new Array(homesheet.datalist[2] - datasheetsColumned.length).fill([""]);  // filler, ranges need to match in length
  var datasheetsrange = datasheetsColumned.concat(filler);
  var range = home.getRange(homesheet.datalist[0], homesheet.datalist[1], homesheet.datalist[2]);
  
  var values = range.setValues(datasheetsrange); 
}

/**
 * Sort all sheet alphabetically
 */
function sortSheets(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  sheets.sort(function (a, b) {
    return (a.getSheetName().toUpperCase() < b.getSheetName().toUpperCase()) ? -1 : 1;
  });
  for (var i in sheets){
    doc.setActiveSheet(sheets[i]);
    doc.moveActiveSheet(sheets.length);
  }
  doc.setActiveSheet(doc.getSheetByName(homesheet.name));
}

/**
 * Open a dialog box that allows the creation of a fresh phone based on template
 */
function addphone(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  var templates = findSheets(sheets, homesheet.template);

  var html='';
  if (templates.length > 0){ 
    for (var i = 0; i < templates.length; i++){
      html += '<input type="button" value="' + templates[i].replace(homesheet.template, '') + '" onclick="google.script.run.phoneFromTemplate(\'' + templates[i] + '\');google.script.host.close();" />';
    }
  } else {
    html = 'Sorry, but I could not find any template sheets. These should start with "' + homesheet.template + '"';
  }
  
  var output = HtmlService.createHtmlOutput(html)
  .setWidth(200);
  
  SpreadsheetApp.getUi().showModalDialog(output, 'Which template would you like to use?'); 
}

function customFormula(value, operator, reference, colorrange){
  if (operator != "" && typeof(operators[operator]) != "undefined"){
    if (operators[operator](value, reference)){
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = doc.getActiveSheet();
      var color = sheet.getRange(colorrange).getBackground();
      return color;
    }
  }
  return "black";
}

function getBackgroundColor(range){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getActiveSheet();
  var cell = sheet.getRange(range);
  return(cell.getBackground());
}

/**
 * Method called from the dialogbox, deletes an existing phone sheet and replaces it
 */
function phoneFromTemplate(name){
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
  script.setProperty("devices", new Array(10).fill(['']));
  
  // 2. Create a new anonymous user in the Firestore Database 
  var signin_options  = {'method' : 'post','contentType': 'application/json','payload' : '{"returnSecureToken":true}'};
  var signin_response = UrlFetchApp.fetch(database.signup + database.id, signin_options);
  var signin_data     = JSON.parse(signin_response.getContentText());  
  
  // 3. Store database anonymous user profile in this script
  script.setProperties({
    [database.userid]        : signin_data.localId,
    [database.auth_token]    : signin_data.idToken,
    [database.refresh_token] : signin_data.refreshToken,
  });
  
  // 4. Create an initial entry in the database
  var setup_options = {
    'method' : 'post',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty(database.auth_token) + ''}, 
    'contentType': 'application/json',
    'payload': "{'fields':{'ping':{'stringValue':'" + Math.floor((new Date()).getTime()/1000).toString() + "'},}}",
    'muteHttpExceptions': true
  };
  var setup_response = UrlFetchApp.fetch(database.url + "?documentId=" + script.getProperty(database.userid), setup_options);
  console.log(setup_response.getContentText());   // For debugging purposes only
  
  // 5. Install a trigger that listen to spreadsheet changes by the user (e.g. adding/removing sheets or deleting columns)
  ScriptApp.newTrigger("somethingChanged")
  .forSpreadsheet(thisSheet)
  .onChange()        // onEdit() is not called if the API makes changes, onChange() is - but it is limited (no event data)
  .create();
}

/**
 * Insert data row at the first line (prepend)
 * @param {Sheet} sheet - The destination sheet to prepend the data to
 * @param {Array} rowData - The data to prepend
 */
function prependRow(sheet, rowData) {
  sheet.insertRowBefore(1).getRange(1, 1, 1, rowData.length).setValues([rowData]);
}

/**
 * Update the temporary token to keep a valid authentication with the database
 * Note: this method does not seem to work properly...
 */
function refreshDatabaseToken() {
  
  // 1. Get a new token 
  var refresh_options = {'method' : 'post','contentType': 'application/x-www-form-urlencoded ','payload' : 'grant_type=refresh_token&refresh_token=' + script.getProperty(database.refresh_token)};
  var refresh_response = UrlFetchApp.fetch(database.refresh + database.id, refresh_options);
  var refresh_data = JSON.parse(refresh_response);  
  
  // 2. Store new token in this script
  script.setProperty(database.refresh_token, refresh_data.refresh_token);
  
  console.log(refresh_response.getContentText());   // for debugging purposes only
}

/**
 * Update a value in the database which should trigger the phone to get new data
 */
function pingDatabase() {
  
  // 1. Update the database with a new timestamp (a.k.a. 'ping')
  var ping_options = {
    'method' : 'patch',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty(database.auth_token) + ''}, 
    'contentType': 'application/json',
    'payload': "{'name':'projects/sheetablephone/databases/(default)/documents/anonymous/" + script.getProperty(database.userid) +"','fields':{'ping':{'stringValue':'" + Math.floor((new Date()).getTime()/1000).toString() + "'},}}",
    'muteHttpExceptions': true
  };
  var ping_response = UrlFetchApp.fetch(database.url + script.getProperty(database.userid), ping_options);
}


/**
 * Change the color of a range of cells
 */
function setColor(inputrange){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getRange(inputrange);
  range.setBackground("red");
}

/**
 * Find all the sheet following a specific naming convention
 * @param {Sheet[]} sheets - An array of sheet to look through
 * @param {String} keyString - The naming convention to look for
 * @param {Boolean} column - If true return as a 2D array (needed to write to a range of cells)
 */
function findSheets(sheets, keyString, column = false){
  var foundSheets = [];
  for (var i = 0; i < sheets.length; i++){
    var name = sheets[i].getName();
    if (name.includes(keyString)){
      if (column) foundSheets.push([name.trim()]); 
      else foundSheets.push(name.trim()); 
      }
  }
  return foundSheets;
}