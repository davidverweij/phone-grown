var gSheetLink, databasePing; // the link to the google sheet and database reference


// Initialize Database connection
firebase.initializeApp({
  apiKey: "AIzaSyCAHz6izwenF8F84SoQqRCekYhNeAe7u68",
  authDomain: "phone-grown.firebaseapp.com",
  projectId: "phone-grown",
});

const db = firebase.firestore();
const status = document.getElementById("status");

document.addEventListener("DOMContentLoaded", function() {
  promptConnectUI(true);


});

function promptConnectUI(bool) {
  document.getElementById('form').style.display = (bool ? "block" : "none");
}
function promptUIAgain(){
  document.getElementById('button').style.display = "block";
  document.getElementById('loader').style.display = "none";
  document.getElementById('form').getElementsByTagName("h1")[0].innerHTML = "Something went wrong. Please try again."
  document.getElementById('form').getElementsByTagName("h5")[0].innerHTML = "Did you type in only the personal ID?"
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

        } else { // retry..
          console.log("Waited too long, or access denied by user");
          promptUIAgain();
        }
      }
    };
    xhr.onloadend = function() {
      if (this.status == 404) {
        console.log("Website not Found");
        promptUIAgain();
      }
    }
    xhr.onerror = function() {
      console.log("Website not accessible (e.g. cross-origin block, unsafe link?)");
      promptUIAgain();
    }

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