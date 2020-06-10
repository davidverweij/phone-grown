var hashedID, gSheetLink;

document.addEventListener("DOMContentLoaded", function() {
  hashedID = getCookie("hashedID");
  gSheetLink = getCookie("gSheetLink");
  if (gSheetLink == ""){
    // document.getElementById("form").style.display = "block";
    // need the link anyway - might as well refresh the hash
    // setCookie("gSheetLink", variable, 365);
  }
  if (hashedID == "" || hashedID == "undefined") {
    // create new hash
    generateIdentifier();
  }
});

function generateIdentifier() {
  // get current time in milliseconds
  var date = new Date();
  var ISOtimestamp = date.toISOString();

  // get current IP address
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var ip = (/^ip=(.*$)/gm.exec(this.responseText))[1];
      setCookie("hashedID", generateHash(ip, ISOtimestamp), 365);
      hashedID = getCookie("hashedID");
    }
  };
  xhr.open("GET", "https://www.cloudflare.com/cdn-cgi/trace", true); // true for asynchronous
  xhr.send();

  function generateHash(ip, timestamp) {
    var hashed = hash64((ip[1] + ";" + ISOtimestamp));
    return hashed;
  }
}

/**
* Connect with the Google Sheet via the 'webapp'
*/

function sendSheet() {
  var scriptUrl = document.getElementById("scriptUrl").value
  if (scriptUrl != "") {
    var data = "hashId=" + hashedID;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // succes! Store the sheet link for future references in the cookie
        // TODO: check for actual success..
        console.log(this.responseText);
        console.log(this.getResponseHeader("Location"));
        setCookie("gSheetLink", scriptUrl, 365);
      }
    };
    xhr.open("GET", "http://tinyurl.com/" + scriptUrl + "?" + data, true); // true for asynchronous
    xhr.send();
  } else {
    alert("Please enter a Code");
  }
}

/**
 * Calculate a 64 bit FNV-1a hash, based on  https://stackoverflow.com/a/22429679/7053198
 */
function hash64(str) {
  var h1 = hashFnv32a(str, true); // returns 32 bit (as 8 byte hex string)
  return h1 + hashFnv32a(h1 + str, true); // 64 bit (as 16 byte hex string)

  function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    var i, l,
      hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
      // Convert to 8 digit hex string
      return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
  }
}

/**
*  Function check for an existing hash identifier, or override if not present
*/

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
