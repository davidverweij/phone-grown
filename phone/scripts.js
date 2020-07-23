// (1) use global variables for the googleSheet and database link and phone status / instructions
var gSheetLink, databasePing, currentInstructions = [], timeout;

// (2) initiale the database object (with specific details for this projects' database) and connect
firebase.initializeApp({
  apiKey: "AIzaSyCAHz6izwenF8F84SoQqRCekYhNeAe7u68",
  authDomain: "phone-grown.firebaseapp.com",
  projectId: "phone-grown",
});
const db = firebase.firestore();

// (3) when loaded, show the little form to connect to a Google sheet
document.addEventListener("DOMContentLoaded", function() {
  showUI(0);

  // add a listener if the user clicks on the screen
  document.getElementById("ambientdisplay").addEventListener("click", function() {
    showUI(1);
    console.log("click!");
  });

  // add a listener if the user closes a menu
  document.getElementById("close").addEventListener("click", function() {
    showUI(1, false);
  });

});


/**
 * Control the visibility of the form. It will show a hint when hiding
 *
 * @param {Integer} int - 0 = the connect menu, 1 = the settings menu
 * @param {Boolean} bool - show (true) or hide (false) the form
 * @param {Boolean} retry - adjust the helptext if the connection failed
 */
function showUI(int, bool = true, retry = false) {

  document.getElementById('helptext0').style.display = (retry ? "none" : "block");
  document.getElementById('helptext1').style.display = (retry ? "block" : "none");
  if (retry) loading(false);
  document.getElementById('menu' + int).style.display = (bool ? "flex" : "none");

  // If we hide a form, show a hint for a few seconds that shows how to bring up the menu
  if (!bool) {
    document.getElementById('hint').style.opacity = 1;
    setTimeout(function() {
      document.getElementById('hint').style.opacity = 0;
    }, 5000);
  }
}

/**
 * Control the visibility of the loader.
 *
 * @param {Boolean} bool - show (true) or hide (false) the loader
 */
function loading(bool) {
  document.getElementById('loader').style.display = (bool ? "block" : "none");
}


/**
 * Use the PhoneGrownID to find the Google Sheet.
 *
 * @param {String} url - an identifyer of the tinyurl that points to the Google Sheet
 */
function submitID(url) {

  // (1) check if input is valid
  if (typeof(url) != "undefined" && url != "") {

    loading(true);

    // (3a) prepare HTTPS REST GET request and response
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let result = JSON.parse(this.responseText);

        // (4) if success, store the result (the link, as well as a received databaseID)
        if (result.result == "success") {
          setCookie("gSheetLink", url);
          setCookie("databasePing", result.databasePing);

          // (5) update UI to show the next step
          loading(false);
          showUI(0, false);
          showUI(1);

          // (6) update the background, with a little bit of a delay for easing in.
          setTimeout(function() {
            updateAmbientDisplay(result.todo);
            startDatabaseListener();
          }, 1500)

        } else {
          // The connection was unsuccesful
          console.log("submitID(): unsuccesful");
          showUI(0, true, true); // please try again
        }
      }
    };
    xhr.onloadend = function() {
      if (this.status == 404) {
        console.log("submitID(): website not found");
        showUI(0, true, true); // please try again
      }
    }
    xhr.onerror = function() {
      console.log("submitID(): website inaccesible");
      showUI(0, true, true); // please try again
    }

    // (3b) actually send the GET request
    xhr.open("GET", "https://tinyurl.com/" + url + "?origin=phone&data=database", true); // true for asynchronous
    xhr.send();
  } else {
    showUI(0, true, true); // please try again
  }
}

/**
 * Start listening to changes to the database, to get notified when new information is in the GSheet.
 */
function startDatabaseListener() {
  db.collection("anonymous").doc(getCookie("databasePing"))
    .onSnapshot(function(doc) {

      // (1a) onSnapShot is executed when there is a change in the database
      // Prep a HTTPS REST request to get data from the Google Sheet
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let result = JSON.parse(this.responseText);

          // (4) if success, store the result and update the background
          if (result.result == "success") {
            updateAmbientDisplay(result.todo);
          } else {
            // something went wrong.. TODO: Handle error
          }
        }
      };

      // (1b) send the GET request
      xhr.open("GET", "https://tinyurl.com/" + getCookie("gSheetLink") + "?origin=phone&data=update", true); // true for asynchronous
      xhr.send();
    });
}


/**
 * Create an array of <div>'s with background colors correpsonding to the Google Sheet instructions
 * based on new incoming instructions and those ongoing. Note that only 'black' cells can be overruled
 * by other colors, colored cells are not 'mixed' if they overlap. In that case it's FIFO (though arbitrary)
 *
 * @param {String} instructions - a stringified array of instructions (default an empty array)
 */
function updateAmbientDisplay(newInstructions = '[]') {

  // (1) clear the timeout to prevent parralel execution
  clearTimeout(timeout);

  // (2) convert new instruction durations to timestamps and add them to the existing instructions (if any)
  let todos = JSON.parse(newInstructions);
  if (todos.length > 0){
    let now = Date.now();

    todos.forEach((instruction) => {
      currentInstructions.push({
        'starts' : now,
        'ends' : now + instruction.duration,
        'backgrounds' : instruction.backgrounds
      });
    });
  }

  // (3) check all current instructions and create an appropriate display. Sort based on starttime
  currentInstructions.sort();

  // I AM HERE

  // timeout - setTimeout(updateAmbientDisplay)


  let height = backgrounds.length,
    width = backgrounds[0].length;
  let html = "";

  // (1) create a list of <div>'s with correct background colours in HTML
  for (let i in backgrounds)
    for (let j in backgrounds[i])
      html += "<div style='background-color:" + backgrounds[i][j] + "'></div>";

  // (2) set a GRID layout to the correct number of columns (from the data), and update the HTML
  document.getElementById('ambientdisplay').style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
  document.getElementById('ambientdisplay').innerHTML = html;
  document.getElementById('ambientdisplay').style.display = "grid";
}
}



/**
 * Helper method to set a value of a Cookie
 *
 * @param {String} name - the name of the cookie
 * @param {String} value - the value to be stored
 * @param {Object} options - optionally override default options
 */

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    secure: true, // security measure
    'max-age': 31536000, // set expiry date at one year (in seconds)
    'samesite': 'strict', // security measure
  };

  // (1) URI encode the strings to keep their exact value
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  // (2) concatenate the options to prepare for setting the cookie
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  // (3) set the cookie
  document.cookie = updatedCookie;
}

/**
 * Returns the cookie with the given name, or undefined if not found
 *
 * @param {String} name - the name of the cookie to be retreived
 */
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
