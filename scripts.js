var hashedId, gSheetLink;

document.addEventListener("DOMContentLoaded", function() {

  // retreive stored information in cookies if present
  hashedId = getCookie("hashedId"), gSheetLink = getCookie("gSheetLink");

  // if no link to a GSheet is found, prompt for a new one
  if (typeof(gSheetLink) == "undefined")
    promptConnectUI(true);

  // if no ID is found, or a wrong formatted one, generate a new one.
  if (typeof(hashedId) == "undefined" | !(/\b[A-Za-z0-9]{16}\b/gm.test(hashedId)))
    hashedId = generateHashedIdentifier();

});

function promptConnectUI(bool){
  document.getElementById('form').style.display = (bool ? "block" : "none");
}

function generateHashedIdentifier() {

  // get current time in milliseconds
  var now = (new Date()).toISOString();

  // prepare REST GET request and response
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      // upon succes, trim the response (ip) and create hash with timestamp
      var ip = (/^ip=(.*$)/gm.exec(this.responseText))[1];
      var newHashId = generateHash(ip + ";" + now);
      setCookie("hashedId", newHashId);
      return newHashId;
    }
  };

  // send GET request
  xhr.open("GET", "https://www.cloudflare.com/cdn-cgi/trace", true); // get IP
  xhr.send();

}

function connectToGsheet(url) {
  if (typeof(url) != "undefined" && url != "") {
    document.getElementById('button').style.display = "none";
    document.getElementById('loader').style.display = "block";

    var data = "hashId=" + getCookie("hashedId");

    // prepare REST GET request and response
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        console.log(result);
        // if a successful connect, store the link for future use
        if (result.result == "success") {
          setCookie("gSheetLink", url);

          // update UI to show connected
          document.getElementById('loader').style.display = "none";
          document.getElementById('form').getElementsByTagName("h1")[0].innerHTML = "Connected!";
          setTimeout(function() {promptConnectUI(false);}, 3000)

        }
      }
    };

    // send GET request
    xhr.open("GET", "https://tinyurl.com/" + url + "?" + data, true); // true for asynchronous
    xhr.send();
  } else {
    alert("empty url");
  }
}



/**
*   HELPER METHODS
**/

function generateHash(str) {
  // Calculate a 64 bit FNV-1a hash, based on  https://stackoverflow.com/a/22429679/7053198
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

// returns the cookie with the given name,
// or undefined if not found
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
