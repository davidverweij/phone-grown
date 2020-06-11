/*   
   Copyright 2020 David Verweij
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var SHEET_NAME = "Sheet1";
        
//  1. Run > setup
//  2. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//  3. Copy the 'Current web app URL' and paste this in the 'Home' sheet
//  4. Enter the resulting code into the browser on your old phone. Enjoy!

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function handleResponse(e) {
  
  console.log(JSON.stringify(e));
  
  var lock = LockService.getPublicLock();
  lock.waitLock(10000);  // wait 10 seconds before conceding defeat.
  
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    var hashId = e.parameter.hashId;
    if (hashId != "") {
      var homesheet = doc.getSheetByName("Home");
      homesheet.getRange('I4').setValue(hashId);
    }
    
    //sheet.appendRow([data]);
    
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "data": "all good!"}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    console.log("error!");
    console.log(e);
    
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
