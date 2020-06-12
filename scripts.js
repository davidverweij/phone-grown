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
    db.collection("anonymous").doc(databasePing)
      .onSnapshot(function(doc) {
        // currently randomly chooses a background color
        document.body.style.background = "rgb(" +
          Math.floor(Math.random() * 256) + "," +
          Math.floor(Math.random() * 256) + "," +
          Math.floor(Math.random() * 256) + ")";
        // get new data from gSheetLink
        status.innerHTML = "Last changed on " + (new Date()).toUTCString();

      });
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
        console.log(result);
        // if a successful connect, store the link for future use
        if (result.result == "success") {
          setCookie("gSheetLink", url);
          setCookie("databasePing", result.databasePing);

          // update UI to show connected
          document.getElementById('loader').style.display = "none";
          document.getElementById('form').getElementsByTagName("h1")[0].innerHTML = "Connected!";
          setTimeout(function() {
            promptConnectUI(false);
          }, 3000)

        }
      }
    };

    // send GET request
    xhr.open("GET", "https://tinyurl.com/" + url, true); // true for asynchronous
    xhr.send();
  } else {
    alert("empty url");
  }
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
