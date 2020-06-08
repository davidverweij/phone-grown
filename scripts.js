var script_url = "https://script.google.com/macros/s/AKfycbwIowCfB6hNHIiEjkbb80fPCZywfaUmFB5rnh-sgr_NzszSOOBN/exec";
var emailcheck = false;
// Make an AJAX call to Google Script
function insert_value() {
  var name = $("#link").val();
  var url = script_url + "?callback=ctrlq&message=" + name + "&action=insert";
  var request = jQuery.ajax({
    crossDomain: true,
    url: url,
    method: "GET",
    dataType: "jsonp"
  });
}
