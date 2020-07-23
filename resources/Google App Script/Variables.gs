// secure 'local' storage of values repeatadly needed (persistent cross-sessions)
var script = PropertiesService.getScriptProperties();

// inside 'local' storage, we keep:
// - todo (an array of tasks keeping track of tests and tasks to inform the phone upon doGet())
//    e.g. [{background: [[],[],[]], duration: 60, timestamp: 1234567}, {...}]
// - userID (database userID)
// - auth_token (authentication token to acces the database)
// - refresh_token (to refresh the authentication token)
// - databaseLive (indicating if the database connection is seemingly viable)

// Turn off if you do not want to keep collecting logs
var activeLogging = true;

// Fixed variables:
var variables = {
  database : {
    signup     : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
    refresh    : "https://securetoken.googleapis.com/v1/token?key=",
    url        : "https://firestore.googleapis.com/v1/projects/phone-grown/databases/(default)/documents/anonymous/",
    ID         : "AIzaSyCAHz6izwenF8F84SoQqRCekYhNeAe7u68"
  },
  sheetNames : {
    home       : "2. Home",
    dataIn     : "1. Incoming Data",
    dataStored : "3. Received Data",
    logs       : "4. Logs",
    backgrounds: "[BACKGROUND]"
  },
  ranges : {
    background : "C3:G12"
  },
  A1Notations : {
    status     : "2. Home!C1:C1",
    backgrounds: "[SETTINGS]!A2:A",
  },
  columns : {
    active     : {'char':'Q', 'index' : 16 },
    test       : {'char':'R', 'index' : 18 },
    rule       : {'char':'E', 'index' :  5 },
    background : {'char':'I', 'index' :  9 },
    duration   : {'char':'L', 'index' : 12 },
    durationUnit : {'char':'M', 'index' : 13 }
  },
  rows :{
    firstRule  : 5
  }
};
