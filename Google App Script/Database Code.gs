/**
 * Create a new user in the database, and store the userID in this scripts variables (not in the Google Sheet)
 */
function newAnonymousUser(){

  // 1. Sign in a new anonymous user in the database
  var signin_options  = {'method' : 'post','contentType': 'application/json','payload' : '{"returnSecureToken":true}'};
  var signin_response = UrlFetchApp.fetch(script.getProperty("databaseSignupUrl") + script.getProperty("databaseID"), signin_options);
  var signin_data     = JSON.parse(signin_response.getContentText());

  // 2. Store database anonymous user profile in this script
  script.setProperties({
    userID        : signin_data.localId,
    auth_token    : signin_data.idToken,
    refresh_token : signin_data.refreshToken,
  });

  // 3. Create an initial entry in the database
  var setup_options = {
    'method' : 'post',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty("auth_token") + ''},
    'contentType': 'application/json',
    'payload': "{'fields':{'ping':{'stringValue':'" + Math.floor((new Date()).getTime()/1000).toString() + "'},}}",
    'muteHttpExceptions': true
  };
  var setup_response = UrlFetchApp.fetch(script.getProperty("databaseUrl") + "?documentId=" + script.getProperty("userID"), setup_options);

}

/**
 * Update the temporary token to keep a valid authentication with the database
 * Note: this method does not seem to work properly...
 */
function refreshDatabaseToken() {

  // 1. Get a new token
  var refresh_options = {'method' : 'post','contentType': 'application/x-www-form-urlencoded ','payload' : 'grant_type=refresh_token&refresh_token=' + script.getProperty("refresh_token")};
  var refresh_response = UrlFetchApp.fetch(script.getProperty("databaseRefreshUrl") + script.getProperty("databaseID"), refresh_options);
  var refresh_data = JSON.parse(refresh_response);

  // 2. Store new token in this script
  script.setProperty("refresh_token", refresh_data.refresh_token);

}

/**
 * Update a value in the database which should trigger the phone to get new data
 */
function pingDatabase() {

  // 1. Update the database with a new timestamp (a.k.a. 'ping')
  var ping_options = {
    'method' : 'patch',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty("auth_token") + ''},
    'contentType': 'application/json',
    'payload': "{'name':'projects/sheetablephone/databases/(default)/documents/anonymous/" + script.getProperty("userID") +"','fields':{'ping':{'stringValue':'" + Math.floor((new Date()).getTime()/1000).toString() + "'},}}",
    'muteHttpExceptions': true
  };
  var ping_response = UrlFetchApp.fetch(script.getProperty("databaseUrl") + script.getProperty("userID"), ping_options);
}
