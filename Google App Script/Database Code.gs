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

/**
 * Create a new user in the database, and store the userID in this scripts variables (not in the Google Sheet)
 */
function newAnonymousUser(){
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
  //console.log(setup_response.getContentText());   // For debugging purposes only
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
