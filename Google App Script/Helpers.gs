
var script = PropertiesService.getScriptProperties();        // secure 'local' storage of values repeatadly needed
var homesheet = {
  'name'          : '2. Home',           // the main sheet to interact with
  'datasheet'     : '1. Incoming Data',  // the data sheet (must be first!)
  'device'        : '3. Phone',          // name convention for connected device
  'template'      : '[Template]',        // name convention for templates
  'data'          : '[Data]',            // name concention for data sheets
  'devicelist'    :  [23, 2, 10],        // location of the devices on the sheet {row, column, maxnumber}
  'datalist'      :  [6, 8, 10],         // location of the devices on the sheet {row, column, maxnumber}
  'colorlist'     :  [20, 19, 8],        // rows that could be used as colorouput
  'phone'         :  [20, 14, 8],        // column with reference to the phone ranges
  'fullphone'     :  "A1:A1",            // cell in the phone sheet storing full phone size
  'dataheader'    :  "X26:X26"           // cell in the home sheet containing a new header row for a new data set
};

// used in the custom formula
var operators = {
  'is bigger than': function(a, b) { return a > b },
  'is smaller than': function(a, b) { return a < b },
  'is exactly': function(a, b) { return a == b },
  'is not': function(a, b) { return a != b },
};



/**
 * Insert data row at the second line (prepend)
 *
 * @param {Sheet} sheet - The destination sheet to prepend the data to
 * @param {Array} rowData - The data to prepend
 * @param {Integer} row - a specific row to prepend the data to, defaults to 2
 */
function prependRow(sheet, rowData, row = 2) {
  sheet.insertRowBefore(row).getRange(1, 1, 1, rowData.length).setValues([rowData]);
}


/**
 * Get the background color of a single cell
 *
 * @param {Range} range - a range representing the single cell
 */
function getBackgroundColor(range){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getActiveSheet();
  var cell = sheet.getRange(range);
  return(cell.getBackground());
}

/**
 * Calculate the background color based on a test using a provided operator. Returns
 * the colorrange background color if true, else 'black'
 *
 * @param {Number} value - the value to put to the test
 * @param {String} operator - the operator (from a list of valid operators) to use in the test
 * @param {Number} reference - the reference value to apply the test to
 * @param {Range} colorrange - the range that contains has the backgroundcolor we should apply (if true)
 */
function ruleBackgroundColor(value, operator, reference, colorrange){
  if (operator != "" && typeof(operators[operator]) != "undefined"){
    if (operators[operator](value, reference)){
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = doc.getActiveSheet();
      var color = sheet.getRange(colorrange).getBackground();
      return color;
    }
  }
  return "black";
}


/**
 * Find all the sheet following a specific naming convention
 *
 * @param {Sheet[]} sheets - An array of sheet to look through
 * @param {String} keyString - The naming convention to look for
 * @param {Boolean} column - If true return as a 2D array (needed to write to a range of cells)
 */
function findSheets(sheets, keyString, column = false){
  var foundSheets = [];
  for (var i = 0; i < sheets.length; i++){
    var name = sheets[i].getName();
    if (name.includes(keyString)){
      if (column) foundSheets.push([name.trim()]);
      else foundSheets.push(name.trim());
      }
  }
  return foundSheets;
}


/**
 * Sort all sheet alphabetically
 */
function sortSheets(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  sheets.sort(function (a, b) {
    return (a.getSheetName().toUpperCase() < b.getSheetName().toUpperCase()) ? -1 : 1;
  });
  for (var i in sheets){
    doc.setActiveSheet(sheets[i]);
    doc.moveActiveSheet(sheets.length);
  }
  doc.setActiveSheet(doc.getSheetByName(homesheet.name));
}

/**
 * Find all sheets that store incoming data, and update the home sheet.
 */
function updateDataSheets(){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = doc.getSheets();
  var home = doc.getSheetByName(homesheet.name);

  var datasheets = findSheets(sheets, homesheet.data, true);                // find all sheets that relate to devices

  var filler = new Array(homesheet.datalist[2] - datasheets.length).fill([""]);  // filler, ranges need to match in length
  var datasheetsrange = datasheets.concat(filler);
  var range = home.getRange(homesheet.datalist[0], homesheet.datalist[1], homesheet.datalist[2]);

  var values = range.setValues(datasheetsrange);
}
