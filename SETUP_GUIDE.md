# Complete Setup Guide - Attendance Tracker for STEM A

This guide walks you through setting up the attendance tracker with your Google Sheet step-by-step.

## ⚠️ Important: CORS and Google Apps Script

Google Apps Script Web Apps have special requirements. Follow these steps exactly to avoid deployment issues.

---

## Phase 1: Prepare Google Sheet (5 minutes)

### Step 1.1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Create** → **Blank spreadsheet**
3. Name it: **`Grade 11 Attendance`**
4. In the first sheet tab, rename it to **`Log`** (right-click the tab)

### Step 1.2: Add Column Headers

In the `Log` sheet, add these headers in **Row 1**:
- **A1:** `Timestamp`
- **B1:** `Student Name`
- **C1:** `Status`

Leave rows 2 onwards empty—the app will populate them automatically.

Your sheet should look like this:

```
Timestamp | Student Name | Status
----------|--------------|-------
          |              |
```

---

## Phase 2: Deploy Google Apps Script (10 minutes)

### Step 2.1: Open Apps Script

1. In your Google Sheet (the one you just created), click **Extensions** → **Apps Script**
2. A new tab will open with the Apps Script editor
3. Delete any existing code (should be blank or have a placeholder)

### Step 2.2: Paste the Script Code

Copy the **entire** code from `google-apps-script.js` (all of it) and paste it into the Apps Script editor.

It should look like this:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Log");
    const timestamp = new Date();
    
    data.records.forEach(function(record) {
      sheet.appendRow([timestamp, record.name, record.status]);
    });
    
    return ContentService.createTextOutput(
      JSON.stringify({"status": "success", "message": "Attendance recorded successfully", "rowsAdded": data.records.length})
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(
      JSON.stringify({"status": "error", "message": error.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2.3: Save the Script

Click the **Save** icon (💾) in the top menu. You'll see a popup asking you to name the project.

Name it: **`STEM A Attendance Tracker`**

Click **OK**.

### Step 2.4: Deploy as Web App

1. Click **Deploy** (top right) → **New deployment**
2. Click the ⚙️ **gear icon** next to "Select type"
3. Choose **Web app** from the dropdown

### Step 2.5: Configure Deployment Settings

⚠️ **IMPORTANT**: These settings MUST be exact for the app to work:

- **Execute as:** Select **`Me (your email)`**
- **Who has access:** Select **`Anyone`** (not "Only me")

> ✅ "Anyone" is safe because the URL is random and long. Only people with the exact URL can access it. Users cannot read your Google Sheet without the URL.

### Step 2.6: Deploy!

1. Click **Deploy**
2. Google will ask for permissions—click **Review permissions**
3. Select your Google account
4. It will show a warning about "This app isn't verified"—click **Advanced** then **Go to STEM A Attendance Tracker (unsafe)**
5. Click **Allow**

### Step 2.7: Copy Your Web App URL

After deployment, a dialog will show your **Web App URL**.

It looks like:
```
https://script.google.com/macros/d/1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T/userweb/access/v1/...
```

**⚠️ IMPORTANT:** Copy this entire URL and save it somewhere safe. You'll need it next.

---

## Phase 3: Configure the Attendance App (2 minutes)

### Step 3.1: Open the App

1. Open `index.html` in your web browser
2. You should see the attendance tracker with STEM A roster pre-loaded

### Step 3.2: Add Your Web App URL

1. Click the **⚙️ Settings** button (bottom right)
2. Paste your Web App URL from Step 2.7
3. Click **Save**
4. Close the modal

✅ Your app is now configured!

---

## Phase 4: Test It! (2 minutes)

### Step 4.1: Mark Some Attendance

1. Click **Load Roster** (the roster should already be loaded)
2. Click a few "Present", "Absent", or "Late" buttons
3. Watch the stats update in real-time

### Step 4.2: Submit Test Data

1. Click **✓ Submit Attendance** at the bottom
2. A confirmation dialog will ask about unmarked students—click **OK**
3. You should see: **"✓ Attendance submitted successfully!"**

### Step 4.3: Verify in Google Sheets

1. Go back to your Google Sheet (the `Log` tab)
2. Refresh the page (F5)
3. **You should see the attendance records appearing automatically!**

Columns should show:
- **A:** Timestamp (date & time)
- **B:** Student names
- **C:** Status (Present/Absent/Late)

✅ **If you see data in the sheet, everything is working!**

---

## Troubleshooting

### Problem: "Error submitting attendance"

**Cause:** Web App URL is wrong or not configured

**Solution:**
1. Click ⚙️ Settings
2. Make sure the URL is pasted correctly (check for extra spaces)
3. Try again

---

### Problem: "Unauthorized" error when deploying

**Cause:** Permissions were denied during deployment

**Solution:**
1. Go back to Apps Script (Extensions → Apps Script)
2. Click **Deploy** → **Manage deployments**
3. Click the trash icon to delete the failed deployment
4. Try deploying again, making sure to click "Allow" on all permission prompts

---

### Problem: Nothing appears in Google Sheet after submitting

**Cause:** Either the Web App URL is wrong, or the deployment wasn't successful

**Solution:**
1. Open the Web App URL directly in your browser
2. You should see `{}` displayed (empty JSON object)
3. If you see an error, the deployment failed—try deploying again
4. Check the browser console (F12 → Console) for error messages

---

### Problem: "Sheet 'Log' not found"

**Cause:** The sheet is named something other than "Log"

**Solution:**
1. Right-click the sheet tab in Google Sheets
2. Click "Rename"
3. Name it exactly: `Log`

---

### Problem: "Cannot read property 'appendRow' of null"

**Cause:** Same as above—the sheet name doesn't match

**Solution:** Make sure your sheet is named exactly `Log` (case-sensitive)

---

## Using the App Daily

### To Track Attendance for STEM A:

1. Open `index.html` (bookmark it!)
2. The roster is already loaded with "STEM A"
3. Click **Load Roster**
4. Mark attendance (Present/Absent/Late)
5. Click **Submit Attendance**
6. Done! Data is automatically in your Google Sheet

### Optional: Export as CSV

If you want to keep a local backup, click **⬇ Export CSV** before submitting. This downloads a CSV file to your computer.

---

## Tips

- **Keep the URL safe:** Don't share your Web App URL publicly. Anyone with it could submit fake attendance records.
- **Backup your sheet:** Google Sheets auto-saves, but consider downloading your attendance records monthly.
- **Multiple classes:** Create separate sheets for different classes. Each needs its own Apps Script deployment.
- **Test first:** Always test with a few students before doing a full class submission.

---

## Still Having Issues?

1. **Check the browser console:** Press F12 → Console tab. Look for red error messages.
2. **Check the Apps Script logs:** Go back to Apps Script, click Logs (clock icon). Look for error messages.
3. **Verify the sheet name:** Must be exactly `Log`
4. **Verify deployment:** Go to Apps Script → Deploy → Manage deployments. Should show a deployment for "Web app"

---

**Good luck with STEM A! 📚**
