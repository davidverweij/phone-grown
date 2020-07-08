var script = PropertiesService.getScriptProperties();        // secure 'local' storage of values repeatadly needed

/**
 * Insert data row at the second line (prepend)
 *
 * @param {Sheet} sheet - The destination sheet to prepend the data to
 * @param {Array} rowData - The data to prepend
 * @param {Integer} row - a specific row to prepend the data to, defaults to 1
 */
function prependRow(sheet, rowData, row = 1) {
  sheet.insertRowBefore(row).getRange(1, 1, 1, rowData.length).setValues([rowData]);
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
  doc.setActiveSheet(doc.getSheetByName(app.home));
}

/**
 * Clear the background to start your drawing again
 */
function clearBackground(){
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("C3:G12").setBackground("black");
}

/**
 * Get all variables from the [SETTINGS] sheet, and store these in the script properties for easy access.
 */
function getVariableFromSettings(){
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let data = doc.getSheetByName("[SETTINGS]").getDataRange().getValues();
  let newProperties = {};
  data.forEach(element => newProperties[element[0]] = element[1]);
  script.setProperties(newProperties);
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
