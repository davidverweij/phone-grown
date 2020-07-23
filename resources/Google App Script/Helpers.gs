/**
 * Insert data row at the second line (prepend)
 *
 * @param {Sheet} sheet - The destination sheet to prepend the data to
 * @param {Array} rowData - The data to prepend
 */
function prependRow(sheet, rowData, timestamp = false) {
  if (timestamp) rowData.unshift(new Date);
  sheet.insertRowBefore(2).getRange(2, 1, 1, rowData.length).setValues([rowData]);
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
  doc.setActiveSheet(doc.getSheetByName(variables.sheetNames.home));
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


/**
 * Update the cell informing the user of the phone status
 *
 * @param {Google Document} doc - The document reference
 * @param {String} status - The text to update the status with
 */
function updatePhoneStatus(doc, status){
  let message = script.getProperty("databaseLive") ? status : status + " // Error: Database offline!";
  doc.getRange(variables.A1Notations.status).setValue(status);
}

/**
 * A quick conversion of the dropdown list and integer to seconds
 *
 * @param {Integer} length - The amount of the duration
 * @param {String} unit - The chosen unit of duration from the dropdown
 */
function calcDuration(length, unit){
  let convertion = {
    seconds : 1,
    minutes : 60,
    hours : 3600,
    days : 86400,
  }
  if (unit == 'indefinite') return 31536000; // indefinite ~1 year
  else return length * convertion[unit];
}

/**
 * Deletes a trigger.
 *
 * @param {string} triggerId The Trigger ID.
 */
function deleteTrigger(triggerId) {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[i].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}
