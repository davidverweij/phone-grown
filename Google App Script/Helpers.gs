/**
 * Insert data row at the second line (prepend)
 *
 * @param {Sheet} sheet - The destination sheet to prepend the data to
 * @param {Array} rowData - The data to prepend
 */
function prependRow(sheet, rowData, timestamp = false) {
  if (timestamp) row.unshift(new Date);
  sheet.insertRowBefore(2).getRange(1, 1, 1, rowData.length).setValues([rowData]);
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

function updatePhoneStatus(doc, status){
  doc.getRange(homeSheetName + "!" + connectionStatusRange).setValue(status);
}

function activateRule(name, doc){
  let values = doc.getSheetByName(homeSheetName).getDataRange().getValues();
  let activate = (activateColumn.charCodeAt(0) % 32)-1;
  let rulename = (ruleNameColumn.charCodeAt(0) % 32)-1;
  let backgroundName = (backgroundNameColumn.charCodeAt(0) % 32)-1;
  let durationLength = (ruleDuration[0].charCodeAt(0) % 32)-1;
  let durationUnit = (ruleDuration[1].charCodeAt(0) % 32)-1;

  values.forEach(function(row, index){
    // converting column names to column numbers. If the trigger name corresponds, and is active - ping the database
    if (row[rulename] == name && row[activate]){
      let background = row[backgroundName];
      let duration = calcDuration(row[durationLength], row[durationUnit]);
    }
  });
}
function calcDuration(length, unit){
  let convertion = {
    seconds : 1,
    minutes : 60,
    hours : 3600,
    days : 86400,
    indefinite : -1
  }
  return Math.max((length * convertion[unit]), -1);
}
