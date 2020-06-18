/**
* @OnlyCurrentDoc Limits the script to only accessing the current sheet.
*/

// TODO: Explain database and safety thereof! (link to github?)
// TODO: refresh token before lifetime (e.g. everyday? Or every 50 to 'ping' we are alive? Or based on a setting in the google sheet? (prevent redundant communication)
// NOTE: onEdit() is not triggered if the sheet is changed through an API. Current solution is another IFTTT trigger instead of polling (due to limited runtime: https://developers.google.com/apps-script/guides/services/quotas)
// using firebase authentication, avoiding service account and also adheres to firebase rules!

var script = PropertiesService.getScriptProperties();        // secure 'local' storage of values repeatadly needed
var homesheet = {
  'name'          : '2. Home',           // the main sheet to interact with
  'data'          : '1. Incoming Data',  // the data sheet (must be first!) 
  'template'      : '[Phone Template]',  // name convention for templates
  'device'        : '[Device]',          // name convention for connected devices
};
var database = {                                             // settings and naming convention for database details
  'signup'        : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',                                    
  'refresh'       : 'https://securetoken.googleapis.com/v1/token?key=',                                                   
  'url'           : 'https://firestore.googleapis.com/v1/projects/sheetablephone/databases/(default)/documents/anonymous/',
  'id'            : 'AIzaSyAAtx_UIictBak4_bZ5tPuRVMOagCUan_w',                                                             
  
  /* below some naming conventions to access script values storage consistently (no typos) */
  
  'userid'        : 'uid',                      
  'auth_token'    : 'token',
  'refresh_token' : 'r_token',
};


//  1. Run > setup
//  2. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//  3. Copy the 'Current web app URL' and paste this in the 'Home' sheet
//  4. Enter the resulting code into the browser on your old phone. Enjoy!

/**
* A special function that runs when the spreadsheet is open, used to add a
* custom menu to the spreadsheet.
*/
function onOpen() {
  var menuItems = [
    {name: '⚙️ Setup', functionName: 'setup'},
    {name: '📱 Add Phone', functionName: 'addphone'}
  ];
  SpreadsheetApp.getActive().addMenu('♻️📱 PhoneGrown', menuItems);

}


/*
*   This function gets called by visiting the webapp url. This is used by the IFTTT.com
*   triggers to to clean up the data and by the phone to collect the new data.
*/
function doGet(e) {                        
  
  var lock = LockService.getPublicLock();  // prevent simultaneuous access to this script
  lock.waitLock(10000);                    // wait 10 seconds before conceding defeat.
  
  try {
    var doc = SpreadsheetApp.openById(script.getProperty("key"));  // get this sheet's ID
    var sheet = doc.getSheetByName(homesheet.data);                // get the incoming data sheet
    var result = {"result" : "success"};
    var origin = e.parameter.origin;   
    
    // It's the phone calling in. Let's reply with the latest 'background'
    if (typeof(origin) != "undefined" && origin == "phone"){     
      result.databasePing = script.getProperty(database.userid);  // send back the database id
    } 
    
    // It's the IFTTT trigger calling in. Let's clean up the data, and ping the database, so the
    // phone knows to collect the new data soon.
    else {                                                        // IFTTT trigger to clean up data
      var newRows = sheet.getLastRow();
      
      if (newRows > 0){                                           // Check if we actually have new data
        var lastColumn = sheet.getLastColumn();
        var range = sheet.getRange(1, 1, newRows, lastColumn);
        var array = range.getValues();
        
        for (var i = 0; i < newRows; i++) {
          
          var data_sheetname = "Data - " + array[i][0];
          var data_sheet = doc.getSheetByName(data_sheetname);    // get the specific data sheet
          
          if (data_sheet == null)                                 // create the sheet if it doesn't exist  
            data_sheet = doc.insertSheet(data_sheetname);
          
          data_sheet.appendRow(array[i]);                         // move one row of data to its sheet
        }
        sheet.deleteRows(1, newRows);                             // delete the original data   
        
        pingDatabase();                                           // ping the database, so the phone can retreive the new data
      }
    }
    
    return ContentService                                         // return json success results
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    
    console.log(e);
    return ContentService
    .createTextOutput(JSON.stringify({"result":"error", "error": e}))
    .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock(); //release lock
  } 
}

function findSheets(sheets, keyString){
  var foundSheets = [];
  for (var i = 0; i < sheets.length; i++){
    var name = sheets[i].getName();
    if (name.includes(keyString))
      foundSheets.push(name.trim()); 
  }
  return foundSheets;
}

function addphone(){
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var templates = findSheets(sheets, homesheet.template);
  //  var devices = findSheets(sheets, homesheet.device);

  var html='';
  if (templates.length > 0){ 
    for (var i = 0; i < templates.length; i++){
      html += '<input type="button" value="' + templates[i].replace(homesheet.template, '') + '" onclick="google.script.run.phoneFromTemplate(\'' + templates[i] + '\');google.script.host.close();" />';
    }
  } else {
    html = 'Sorry, but I could not find any template sheets. These should start with "' + homesheet.template + '"';
  }
  
  var output = HtmlService.createHtmlOutput(html);
  
  SpreadsheetApp.getUi().showModalDialog(output, 'Which template would you like to use?');

  
}

function phoneFromTemplate(name){
  console.log(name);
}

function setup() {
  // yet TODO: check if requests succeed and fix / inform google sheet user
  
  // 1. Store the ID to this spreadsheet in this script
  script.setProperty("key", SpreadsheetApp.getActiveSpreadsheet().getId());
  
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
}

function refreshDatabaseToken() {
  // TODO: refreshed token is not (yet) accepted by Firestore..
  
  // 1. Get a new token 
  var refresh_options = {'method' : 'post','contentType': 'application/x-www-form-urlencoded ','payload' : 'grant_type=refresh_token&refresh_token=' + script.getProperty(database.refresh_token)};
  var refresh_response = UrlFetchApp.fetch(database.refresh + database.id, refresh_options);
  var refresh_data = JSON.parse(refresh_response);  
  
  // 2. Store new token in this script
  script.setProperty(database.refresh_token, refresh_data.refresh_token);
  
  console.log(refresh_response.getContentText());   // for debugging purposes only
}

function pingDatabase() {
  
  // Update the database with a new timestamp (a.k.a. 'ping')
  var ping_options = {
    'method' : 'patch',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty(database.auth_token) + ''}, 
    'contentType': 'application/json',
    'payload': "{'name':'projects/sheetablephone/databases/(default)/documents/anonymous/" + script.getProperty(database.userid) +"','fields':{'ping':{'stringValue':'" + Math.floor((new Date()).getTime()/1000).toString() + "'},}}",
    'muteHttpExceptions': true
  };
  var ping_response = UrlFetchApp.fetch(database.url + script.getProperty(database.userid), ping_options);
  console.log(ping_response.getContentText());   // For debugging purposes only
}