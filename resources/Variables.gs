// secure 'local' storage of values repeatadly needed (persistent cross-sessions)
var script = PropertiesService.getScriptProperties();

// This can give inconsistent results, hence a few important values are stored in the sheet.
// inside 'local' storage, we keep:
// - userID (database userID)
// - auth_token (authentication token to acces the database)
// - refresh_token (to refresh the authentication token)
// - databaseLive (indicating if the database connection is seemingly viable)
// - onChangeID (trigger ID to prevent multiple instances)

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
    home       : "HOME",
    dataIn     : "[DATA] New",
    dataStored : "[DATA] History",
    logs       : "[LOGS]",
    backgrounds: "[BG]"
  },
  ranges : {
    background : "C3:G12",
    listOfBackgrounds: "F5:O5",
    status: "L2:L2",
    lastSeen: "F8:F8",
    sleepModus: "L8:O8",
    todos: "P2:P2",
    clearphone: "P1:P1",
    sleeptimes: "P3:P3",
  },
  columns : {
    active     : {'char':'N', 'index' : 13 },
    test       : {'char':'O', 'index' : 14 },
    rule       : {'char':'E', 'index' :  4 },
    background : {'char':'I', 'index' :  8 },
    duration   : {'char':'L', 'index' : 11 },
    durationUnit : {'char':'M', 'index' : 12 }
  },
  fixed :{
    firstRule  : 13,
    totalBackgrounds: 10,
  }
};
