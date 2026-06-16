# Grade 11 Attendance Tracker

A fast, mobile-friendly web app for tracking student attendance with automatic integration to Google Sheets. No backend required—entirely client-side with Google Apps Script as the connector.

## Features

✅ **Fast Attendance Marking** — Click to mark Present, Absent, or Late  
✅ **Real-time Stats** — See counts update as you mark attendance  
✅ **Auto-save to Google Sheets** — One-click submission with timestamps  
✅ **CSV Export** — Download attendance records locally  
✅ **Mobile-Friendly** — Responsive design works on phones and tablets  
✅ **No Backend** — Everything runs locally; data stored in Google Sheets  

---

## Setup Instructions

⚠️ **Follow the detailed setup guide: [SETUP_GUIDE.md](SETUP_GUIDE.md)**

The setup has 4 phases:
1. **Prepare Google Sheet** (5 min)
2. **Deploy Google Apps Script** (10 min) 
3. **Configure the App** (2 min)
4. **Test It!** (2 min)

**Quick Summary:**
- Create a Google Sheet named "Grade 11 Attendance"
- Add column headers: Timestamp, Student Name, Status
- Deploy the Google Apps Script code as a Web App
- Copy the Web App URL
- Paste the URL into the app's settings (⚙️ button)
- Mark attendance and submit!

👉 **[Full Setup Guide →](SETUP_GUIDE.md)**

---

## How to Use

### Quick Start

1. **Enter Class Name** (e.g., "Biology 11A")
2. **Paste Student Roster** into the text box (one name per line):
   ```
   Alice Johnson
   Bob Smith
   Carol Lee
   David Martinez
   ```
3. Click **Load Roster**
4. **Mark Attendance** by clicking buttons next to each name:
   - ✓ Present
   - ✗ Absent
   - ⏱ Late
5. Watch the stats update in real-time
6. Click **Submit Attendance** to send data to Google Sheets
7. Data appears instantly in your Google Sheet with a timestamp

### Export Locally (Optional)

- Click **⬇ Export CSV** to download a CSV file to your computer
- Great for backup or importing to other systems

### Reset for Next Class

- Click **Reset** to clear the roster and start over
- Your Web App URL stays saved

---

## File Structure

```
attendance-tracker/
├── index.html              # Main webpage (open this in browser)
├── app.js                  # JavaScript logic
├── styles.css              # Styling & responsive design
├── google-apps-script.js   # Code to paste into Google Sheets
└── README.md               # This file
```

---

## Troubleshooting

### "Error submitting attendance"

**Problem:** Web App URL not configured  
**Solution:** Click ⚙️ and paste your Web App URL from Step 2

---

### Nothing appears in Google Sheet

**Problem:** Apps Script URL might be wrong or not deployed  
**Solution:**
1. Check that you deployed as **"Web app"** (not just saving the script)
2. Verify **"Who has access"** is set to **"Anyone"**
3. Test by opening the Web App URL directly in your browser—you should see `{}` displayed

---

### "Unauthorized" error

**Problem:** Permissions were denied during deployment  
**Solution:**
1. Go back to Apps Script (Extensions → Apps Script in Google Sheet)
2. Click the **⚙️ Project Settings** icon
3. Click **Deploy** → **Manage deployments**
4. Delete the deployment and create a new one, authorizing all permissions

---

## Tips for Grade 11 Teachers

- **Customize the URL:** After deploying, you can rename the deployment in Apps Script for easier identification
- **Share the URL:** If you have a shared class account, teammates can use the same Web App URL
- **Backup Your Sheet:** Google Sheets auto-saves, but consider downloading attendance records monthly as a backup
- **Differentiate Classes:** Create separate sheets for different periods/classes (e.g., "Grade 11 Bio A", "Grade 11 Bio B")

---

## Advanced: Modifying the App

### Add Custom Statuses

Edit `app.js` to add more status options (e.g., "Excused", "Online"):

```javascript
// In renderStudentList() function, add to the status-buttons div:
<button class="status-btn excused ${status === 'excused' ? 'active' : ''}" onclick="markAttendance('${escapeQuotes(student)}', 'excused')">📝 Excused</button>
```

Then add styling in `styles.css`:

```css
.status-btn.excused.active {
    background: #9c27b0;
    border-color: #9c27b0;
}
```

### Change Colors

Edit the color values in `styles.css`:
- Header gradient: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
- Buttons: Search for `#667eea`, `#4caf50`, `#f44336`, etc.

---

## Privacy & Security

- ✅ Your data stays in **your** Google Drive
- ✅ Only people with the URL can submit attendance (anyone can read, but the URL is long/random)
- ✅ No third-party services or analytics
- ✅ Works offline for marking attendance (syncs when you submit)

---

## License

Free to use and modify for educational purposes.

---

## Questions?

Refer to the Google Apps Script documentation or check the browser console for errors (F12 → Console tab).

---

**Happy attendance tracking! 📚**