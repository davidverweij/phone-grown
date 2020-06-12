// TODO: Explain database and safety thereof! (link to github?)
// TODO: refresh token before lifetime (e.g. everyday? Or every 50 to 'ping' we are alive? Or based on a setting in the google sheet? (prevent redundant communication)
// using firebase authentication, avoiding service account and also adheres to firebase rules!

var script = PropertiesService.getScriptProperties();        // secure 'local' storage of values repeatadly needed
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


function doGet(e) {
  
  var lock = LockService.getPublicLock();  // prevent simultaneuous access to this script
  lock.waitLock(10000);                    // wait 10 seconds before conceding defeat.
  
  try {
    var doc = SpreadsheetApp.openById(script.getProperty("key"));  // get this sheet's ID
    var sheet = doc.getSheetByName("HOME");                             // get up the "Home" sheet
/*
    var hashId = e.parameter.hashId;                                    // if a fresh connection, store the identifier in the sheet
    if (typeof(hashId) != "undefined") {
      var homesheet = doc.getSheetByName("Home");
      homesheet.getRange('I4').setValue(hashId);
    }
  */  
    // sheet.appendRow([data]);
    
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "databasePing": script.getProperty(database.userid)}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){

    
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock(); //release lock
  }
 
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
  
  // 1. Update the database with a new timestamp (a.k.a. 'ping')
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