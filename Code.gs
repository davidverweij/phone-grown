       
//  1. Run > setup
//  2. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//  3. Copy the 'Current web app URL' and paste this in the 'Home' sheet
//  4. Enter the resulting code into the browser on your old phone. Enjoy!

var SCRIPT_PROP = PropertiesService.getScriptProperties();    // new property service

function doGet(e) {
  
  var lock = LockService.getPublicLock();  // prevent simultaneuous access to this script
  lock.waitLock(10000);                    // wait 10 seconds before conceding defeat.
  
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));  // get this sheet's ID
    var sheet = doc.getSheetByName("HOME");                             // get up the "Home" sheet

    var hashId = e.parameter.hashId;                                    // if a fresh connection, store the identifier in the sheet
    if (typeof(hashId) != "undefined") {
      var homesheet = doc.getSheetByName("Home");
      homesheet.getRange('I4').setValue(hashId);
    }
    
    // sheet.appendRow([data]);
    
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "data": "all good!"}))
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
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("key", doc.getId());
}
