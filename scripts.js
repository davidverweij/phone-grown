var gSheetLink, databasePing; // the link to the google sheet and database reference


// Initialize Database connection
firebase.initializeApp({
  apiKey: "AIzaSyAAtx_UIictBak4_bZ5tPuRVMOagCUan_w",
  authDomain: "sheetablephone.firebaseapp.com",
  projectId: "sheetablephone",
});

const db = firebase.firestore();
const status = document.getElementById("status");

document.addEventListener("DOMContentLoaded", function() {

  // retreive stored information in cookies if present
  databasePing = getCookie("databasePing");
  gSheetLink = getCookie("gSheetLink");

  // if no link to a GSheet is found, prompt for a new one
  if (typeof(gSheetLink) == "undefined") {
    promptConnectUI(true);
  } else if (typeof(databasePing) == "undefined") {
    // do something!
  } else { // all good, start listening to the database
    startDatabaseListener();
  }


  // TODO: if no databasePing present, request a new one!

});

function promptConnectUI(bool) {
  document.getElementById('form').style.display = (bool ? "block" : "none");
}

function connectToGsheet(url) {
  if (typeof(url) != "undefined" && url != "") {
    document.getElementById('button').style.display = "none";
    document.getElementById('loader').style.display = "block";

    // prepare REST GET request and response
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        // console.log(result);
        // if a successful connect, store the link for future use
        if (result.result == "succes!") {
          setCookie("gSheetLink", url);
          setCookie("databasePing", result.databasePing);

          // update UI to show connected
          document.getElementById('loader').style.display = "none";
          document.getElementById('form').innerHTML = "<h1>Connected!</h1>";
          setTimeout(function() {
            promptConnectUI(false);
            updateAmbientDisplay(result.background);
            startDatabaseListener();
          }, 3000)

        } else {

          // something went wrong.. error! / try again

        }
      }
    };

    // send GET request
    xhr.open("GET", "https://tinyurl.com/" + url + "?origin=phone&data=database", true); // true for asynchronous
    xhr.send();
  } else {
    alert("empty url");
  }
}

function startDatabaseListener() {
  db.collection("anonymous").doc(getCookie("databasePing"))
    .onSnapshot(function(doc) {

      // prepare REST GET request and response
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var result = JSON.parse(this.responseText);
          // console.log(result);
          // if a successful connect, store the link for future use
          if (result.result == "succes!") {
            updateAmbientDisplay(result.background);
          } else {

            // something went wrong.. error! / try again

          }
        }
      };
      // send GET request
      xhr.open("GET", "https://tinyurl.com/" + getCookie("gSheetLink") + "?origin=phone&data=update", true); // true for asynchronous
      xhr.send();


    });
}

function updateAmbientDisplay(backgrounds) {
  let height = backgrounds.length,
    width = backgrounds[0].length;
  let html = "";
  for (let i in backgrounds)
    for (let j in backgrounds[i])
      html += "<div style='background-color:" + backgrounds[i][j] + "'></div>";

  document.getElementById('ambientdisplay').style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
  document.getElementById('ambientdisplay').innerHTML = html;
  document.getElementById('ambientdisplay').style.display = "grid";
}




function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    secure: true,
    'max-age': 31536000, // one year in seconds
    'samesite': 'strict',
  };

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// returns the cookie with the given name, or undefined if not found
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
