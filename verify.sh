#!/bin/bash

# Attendance Tracker Setup Verification Script
# This script verifies that all files are in place and the app is ready to deploy

echo "🔍 Attendance Tracker Setup Verification"
echo "========================================"
echo ""

# Check if all required files exist
echo "✓ Checking files..."
files=("index.html" "app.js" "styles.css" "google-apps-script.js" "README.md")

missing_files=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file found"
    else
        echo "  ❌ $file MISSING"
        missing_files=$((missing_files + 1))
    fi
done

echo ""
if [ $missing_files -eq 0 ]; then
    echo "✅ All files are present!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Open README.md for complete setup instructions"
    echo "2. Create a Google Sheet named 'Grade 11 Attendance'"
    echo "3. Go to Extensions → Apps Script in the Google Sheet"
    echo "4. Copy the code from google-apps-script.js and paste it"
    echo "5. Deploy as 'Web app' (Execute as: Me, Access: Anyone)"
    echo "6. Copy the Web App URL provided"
    echo "7. Open index.html in your browser"
    echo "8. Click ⚙️ and paste the Web App URL"
    echo ""
    echo "✅ App is ready to use!"
else
    echo "❌ Some files are missing! Please re-download the app."
    echo "   Missing: $missing_files file(s)"
fi
