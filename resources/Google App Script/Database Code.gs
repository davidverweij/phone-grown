/**
 * Create a new user in the database, and store the userID in this scripts variables (not in the Google Sheet)
 */
function newAnonymousUser(){

  // (1) Sign in a new anonymous user in the database
  let signin_options  = {'method' : 'post','contentType': 'application/json','payload' : '{"returnSecureToken":true}'};
  let signin_response = UrlFetchApp.fetch(databaseSignupUrl + databaseID, signin_options);
  let signin_data     = JSON.parse(signin_response.getContentText());

  // (2) Store database anonymous user profile in this script
  script.setProperties({
    userID        : signin_data.localId,
    auth_token    : signin_data.idToken,
    refresh_token : signin_data.refreshToken,
  });

  // (3) Create an initial entry in the database
  let setup_options = {
    'method' : 'post',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty("auth_token") + ''},
    'contentType': 'application/json',
    'payload': "{'fields':{'ping':{'integerValue':'" + Math.floor((new Date()).getTime()/1000) + "'},}}",
    'muteHttpExceptions': true
  };

  let setup_response = UrlFetchApp.fetch(databaseUrl + "?documentId=" + script.getProperty("userID"), setup_options);

  if (setup_response.getResponseCode() != 200) {
    // (2) something went wrong. Most likely too many new users or requests. Suggest to try again at a later stage.
    script.setProperty("databaseLive", false);
    updatePhoneStatus(SpreadsheetApp.openById(script.getProperty("key")), "Error - Cannot create a new User. Please try again in 60 minutes.");
  } else {
    script.setProperty("databaseLive", true);
  }
}

/**
 * Update the temporary token to keep a valid authentication with the database
 * Note: this method does not seem to work properly...
 */
function refreshDatabaseToken() {

  // (1) Get a new token
  let refresh_options = {'method' : 'post','contentType': 'application/x-www-form-urlencoded ','payload' : 'grant_type=refresh_token&refresh_token=' + script.getProperty("refresh_token")};
  let refresh_response = UrlFetchApp.fetch(databaseRefreshUrl + databaseID, refresh_options);
  let refresh_data = JSON.parse(refresh_response);

  // (2) Store new tokens in this script
  script.setProperties({
    auth_token    : refresh_data.id_token,
    refresh_token : refresh_data.refresh_token,
  });
}

/**
 * Update a value in the database which should trigger the phone to get new data
 *
 * @param {Boolean} retry - allows recursion once
 */
function pingDatabase(retry = false) {

  // (1) Update the database with a new timestamp (a.k.a. 'ping')
  let ping_options = {
    'method' : 'patch',                // writing is a 'post' operation
    'headers': {'Authorization': 'Bearer ' + script.getProperty("auth_token") + ''},
    'contentType': 'application/json',
    'payload': "{'name':'projects/phone-grown/databases/(default)/documents/anonymous/" + script.getProperty("userID") +"','fields':{'ping':{'integerValue':'" + Math.floor((new Date()).getTime()/1000) + "'},}}",
    'muteHttpExceptions': true
  };
  let ping_response = UrlFetchApp.fetch(databaseUrl + script.getProperty("userID"), ping_options);

  if (ping_response.getResponseCode() != 200) {
    // (2) something went wrong. Most likely the auth_token expired. Refresh auth_token and retry. Other cases are not caught.
    if (!retry) {
      refreshDatabaseToken();
      pingDatabase(true)
    } else {
      console.log("Error. Unfortunately something went wrong in connecting with the Database.");
      console.log(ping_response.getContentText());
      script.setProperty("databaseLive", false);
      updatePhoneStatus(SpreadsheetApp.openById(script.getProperty("key")), "Error - Cannot reach Database");
    }
  }
}
