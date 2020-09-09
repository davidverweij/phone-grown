// (1) use global variables
var currentInstructions = []; // list of background to implement
var lastSeenInstruction = 0;  // timestamp of last received instruction
var lastSeenClearPhone = 0;
var timeout; // timeout for tracking duration of backgrounds
var periodicTimeout; // timeout to keep in touch with google sheet
var periodicTimer = 15 * 60 * 1000; // duration between periodicTimeout (e.g. 15 minutes)
var sleeptimes; // store times for the phone to not display backgrounds (sleep mode)
var menu0shown = true; // do not display second menu if first is shown

// (2) initiale the database object (with specific details for this projects' database) and connect
firebase.initializeApp({
  apiKey: "AIzaSyCAHz6izwenF8F84SoQqRCekYhNeAe7u68",
  authDomain: "phone-grown.firebaseapp.com",
  projectId: "phone-grown",
});
const db = firebase.firestore();

// (3) when loaded, show the little form to connect to a Google sheet
document.addEventListener("DOMContentLoaded", function() {

  let oldLink = getCookie("gSheetLink");
  showUI(0);
  if (typeof(oldLink) != "undefined") {
    document.getElementById("scriptUrl").value = oldLink;
    submitID(oldLink);
  }



  // add a listener if the user clicks on the screen
  document.getElementById("ambientdisplay").addEventListener("click", function() {
    if (menu0shown) showUI(1, false)
    else showUI(1, (document.getElementById('menu1').style.display == "none"));
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
  if (int == 0) menu0shown = bool;
  document.getElementById('helptext0').style.display = (retry ? "none" : "block");
  document.getElementById('helptext1').style.display = (retry ? "block" : "none");
  if (retry) {
    loading(false);
    document.getElementById("scriptUrl").value = "";
  }
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
  document.getElementById('IDbutton').style.display = (bool ? "none" : "block");
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
        console.log(result);

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

          // (7) initialize periodic connecting to sheet
          periodicTimeout = setTimeout(getDataFromSheet, periodicTimer); // in 30 minutes

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
    xhr.open("GET", "https://tinyurl.com/" + url + "?origin=phone&data=database&lastInstruction=" + lastSeenInstruction + "&now=" + (new Date).toISOString(), true); // true for asynchronous
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
      getDataFromSheet();
    });
}


/**
 * Perform a GET request to the Google Sheet App and act accordingl to the result
 */
function getDataFromSheet() {
  // Prep a HTTPS REST request to get data from the Google Sheet
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let result = JSON.parse(this.responseText);

      // if success, store the result and update the background
      // the script should not send
      if (result.result == "success") {
        console.log(result);

        // ensure phone is sleeping when requested
        sleeptimes = JSON.parse(result.sleeptimes);

        clear = JSON.parse(result.clear);
        // check if the phone and instructions need to be cleared
        if (lastSeenClearPhone == 0) lastSeenClearPhone = clear;
        if (clear > lastSeenClearPhone) {
          lastSeenClearPhone = clear;
          currentInstructions = [];
          updateAmbientDisplay();
        } else {
          updateAmbientDisplay(result.todo);
        }

        // clear the periodicTimeout to prevent unintentional requests
        clearTimeout(periodicTimeout);
        // check again in [periodicTimer] time for new data
        periodicTimeout = setTimeout(getDataFromSheet, periodicTimer); // in 30 minutes

      } else {
        // something went wrong.. TODO: Handle error
      }
    }
  };

  // (1b) send the GET request
  xhr.open("GET", "https://tinyurl.com/" + getCookie("gSheetLink") + "?origin=phone&data=update&lastInstruction=" + lastSeenInstruction + "&now=" + (new Date).toISOString(), true); // true for asynchronous
  xhr.send();
}

/**
 * Check if the phone should be 'sleeping' right now. Returns the remaining duration of sleep in seconds (negative is until going to sleep)
 *
 * @param {Array} times - 4 integers indicating: [fromhour,fromminute,tohour,tominute]
 * @param {Integer} now - unix timestamp of the time now
 */
function isSleeping(times, now) {
  if (typeof(times) != "undefined") { // only continue if we are already connected to the service

    // get the sleeping times projected on today
    let today = (new Date(now * 1000));
    today.setHours(times[0], times[1], 0);
    let from = today.getTime() / 1000;
    today.setHours(times[2], times[3], 0);
    let to = today.getTime() / 1000;

    if (to < from) {
      // spanning midnight
      // e.g. 00:00     to      from   00:00
      //        |---a---|    b   |---c---|

      if (now < to) return to;                     // a
      else if (now > from) return to + (60*60*24); // c
      else return -from; // negative, time left    // b

    } else if (to > from) {
      // not spanning midnight
      // e.g.  00:00    from       to    00:00
      //         |   a   |-----b----|   c  |

      if (now < from) return -from; // negative, time left          // a
      else if (now > to) return -(from + (60 * 60 * 24)) // ditto  // c
      else return to                                                // b
    } // else if equal, do nothing.
  }
  // in all other cases
  return 0;
}

/**
 * Create an array of <div>'s with background colors correpsonding to the Google Sheet instructions
 * based on new incoming instructions and those ongoing. Note that only 'black' cells can be overruled
 * by other colors, colored cells are not 'mixed' if they overlap. In that case it's FIFO (though arbitrary)
 *
 * @param {String} instructions - a stringified array of instructions (default an empty array)
 */
function updateAmbientDisplay(newInstructions = '[]') {
  let now = Math.floor(Date.now() / 1000);

  // (1) clear the timeout to prevent parralel execution
  clearTimeout(timeout);

  // (2) convert new instruction durations to timestamps and add them to the existing instructions (if any)
  let todos = JSON.parse(newInstructions);
  if (todos.length > 0) {
    todos.forEach((instruction) => {
      if (instruction.timestamp > lastSeenInstruction) lastSeenInstruction = instruction.timestamp;
      currentInstructions.push({
        'starts': now,
        'ends': now + instruction.duration,
        'backgrounds': instruction.backgrounds
      });
    });
  }

  let html = ""; // the html to populate the screen with

  // (3a) remove expired instructions, or when 'sleeping'
  currentInstructions = currentInstructions.filter((instruction) => {
    // isSleeping(sleeptimes, now);
    return (instruction.ends > now);
  });

  // (3b) if the phone should be sleeping, display sleeping message, else show whatever backgrounds needed
  let sleeping = isSleeping(sleeptimes, now);
  let nextTimeoutCheck = 0;

  if (sleeping >= 0) {
    // This implementation does not alter the intstructions nor removes operations based on sleeptime
    // instead, just ignores the result. This allows for sudden changes in sleep times (e.g. removes that constraint)
    html = "<div class='sleepmode'>sleep mode on</div>";
    // check back again once sleeptime is over (or new instructions has been sent)
    nextTimeoutCheck = Math.max(sleeping, now + 5); // in the unlikely event of sleeping ~ 0, wait 5 seconds at least
  } else {
    nextTimeoutCheck = -sleeping; // revert polarity to set to future time

    if (currentInstructions.length > 0) {
      // (3) check all current instructions and create an appropriate display.

      let view;

      if (currentInstructions.length == 1) {
        view = currentInstructions[0].backgrounds;
      } else {
        // (3b) construct a combined view if multiple instructions are present
        // First, create all values as arrays, empty if color is black (to remove for mixing)
        view = currentInstructions[0].backgrounds.map(
          // for each row
          function(row, rowIndex) {
            return row.map(
              // and each column
              function(column, columnIndex) {

                // return an array, empty if black, otherwise populated with a color
                let resultingHEX = (column == "#000000") ? [] : [column];

                // check all other instructions for more colors
                for (let i = 1; i < currentInstructions.length; i++) {
                  if (currentInstructions[i].backgrounds[rowIndex][columnIndex] != "#000000") {
                    resultingHEX.push(currentInstructions[i].backgrounds[rowIndex][columnIndex]);
                  }
                }

                // return black if no color has been provided, otherwise calculate average.
                return (resultingHEX.length == 0) ? "#000000" : ((resultingHEX.length == 1) ? resultingHEX[0] : averageHex(resultingHEX));

              });
          });
      }

      view.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          // create HTML elements with correct color
          html += "<div style='background-color:" + view[rowIndex][columnIndex] + "'></div>";
        });
      });

      // (3c) set a GRID layout to the correct number of columns (from the data)
      document.getElementById('ambientdisplay').style.gridTemplateColumns = "repeat(" + view[0].length + ", 1fr)";
      document.getElementById('ambientdisplay').style.display = "grid";

      // (3d) set a timeout to redo this calculation when an the duration of an instruction ends
      currentInstructions.forEach((instruction) => {
        if (instruction.ends < nextTimeoutCheck) nextTimeoutCheck = instruction.ends;
      });

    }
  }

  // set timeout to check this method again
  timeout = setTimeout(updateAmbientDisplay, (nextTimeoutCheck - now) * 1000);

  // (4) update the html (empty if no instructions)
  document.getElementById('ambientdisplay').innerHTML = html;

}

// DOUBLE TAP? https://stackoverflow.com/a/26809354/7053198

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
    // also add expires date, as max-age is relatively new (old browser support)
    'expires': new Date(Date.now() + (31536000 * 1000)),
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



/**
 * Averages an array of hex colors. Returns one hex value (with leading #)
 *
 * @param {Array} colors - An array of hex strings, e.g. ["#001122", "#001133", ...]
 */
function averageHex(colors) {

  // transform all hex codes to integer arrays, e.g. [[255, 0, 205], [0, 22, 50], ...]
  let numbers = colors.map(function(hex) {
    // split in seperate R, G and B
    let split = hex.match(/[\da-z]{2}/gi);

    // transform to integer values
    return split.map(function(toInt) {
      return parseInt(toInt, 16);
    });
  });

  // average all R's, G's and B's, by iterating over the array, and adding the respective values
  let averages = numbers.reduce(function(total, amount, index, array) {


    return total.map(function(subcolor, subindex) { // per color, add the R, G and B respectively using a map
      subcolor += amount[subindex];
      if (index == array.length - 1) { // if we reached the last color, average it out and return the hex value
        let result = Math.round(subcolor / array.length).toString(16);
        return result.length == 2 ? '' + result : '0' + result; // add a leading 0 if it is only one character
      } else {
        return subcolor;
      }
    });
  });

  // return them as a single hex string
  return "#" + averages.join('');
}
