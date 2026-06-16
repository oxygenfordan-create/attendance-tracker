// Google Apps Script code - Paste this into your Google Sheet's Apps Script editor
// Link: Extensions → Apps Script

/**
 * Handle POST requests from the attendance web app
 * Receives attendance data and appends it to the Google Sheet
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active sheet named "Log"
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Log");
    
    // Get current timestamp
    const timestamp = new Date();
    
    // Append each attendance record as a new row
    data.records.forEach(function(record) {
      sheet.appendRow([
        timestamp,           // Column A: Timestamp
        record.name,         // Column B: Student Name
        record.status        // Column C: Status (Present/Absent/Late/Unmarked)
      ]);
    });
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        "status": "success",
        "message": "Attendance recorded successfully",
        "rowsAdded": data.records.length
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        "status": "error",
        "message": error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
