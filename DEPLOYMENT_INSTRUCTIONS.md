# MedWindow Qatar - Deployment Instructions for GitHub

## Quick Deployment Steps

### Step 1: Download the Package
1. Download the `medwindow-qatar-final-optimized.zip` file
2. Extract all files to a folder on your computer

### Step 2: Update Google Sheets URL (IMPORTANT!)
1. Open `config.js` in a text editor
2. Find the line: `const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbm_UMBVs7eAMCU64bK1FBQLv3unp9o3W9uQwmFVh4LMGS3dM8N98nF1vnw_5sEsPb/exec';`
3. **Replace with your actual Google Apps Script URL** (if different)
4. Save the file

### Step 3: Upload to GitHub (iPhone or Computer)

#### Option A: Using GitHub Web Interface (Works on iPhone!)

1. Go to: https://github.com/medwindowqatar/medwindow-assessment
2. Click on each file in the repository and delete it (or delete the entire repository and create a new one)
3. Click "Add file" > "Upload files"
4. Drag and drop ALL files from the extracted folder:
   - index.html
   - app.js
   - config.js
   - styles.css
   - logo.jpeg
   - apps_script.gs
   - qualifications_index.json
   - specialties_map.json
   - specialty_aliases.json
   - static_lists.json
   - dentist_exam_rules.json
   - README.md
   - DEPLOYMENT_INSTRUCTIONS.md (this file)
5. Scroll down and click "Commit changes"
6. Enter commit message: "Deploy optimized MOPH/DHP compliant assessment tool v2.0"
7. Click "Commit changes"

#### Option B: Using Git Command Line (Computer Only)

```bash
# Clone your repository
git clone https://github.com/medwindowqatar/medwindow-assessment.git
cd medwindow-assessment

# Remove old files
rm -rf *

# Copy new files
cp /path/to/extracted/files/* .

# Commit and push
git add .
git commit -m "Deploy optimized MOPH/DHP compliant assessment tool v2.0"
git push origin main
```

### Step 4: Wait for GitHub Pages to Update
1. Wait 2-3 minutes for GitHub Pages to rebuild
2. Visit: https://medwindowqatar.github.io/medwindow-assessment/
3. Test the assessment tool

### Step 5: Verify Google Sheets Integration
1. Complete a test assessment
2. Check your Google Sheet: https://docs.google.com/spreadsheets/d/1-XK4taMSrD6gT1FMvr1QQ5SjNUyHpO6Gr1XVYAAillI/edit
3. Verify data appears in the "Physician Assessments" sheet

## What's New in This Version

### ✅ All 18 Critical Gaps Fixed:
1. Category 1/2/3 classification system
2. "Other" specialty qualification option
3. Break-in-practice threshold corrected (1 year)
4. Post-specialty experience tracking
5. Qualifying exam requirements
6. Experience type validation
7. Mandatory Dataflow checking
8. Good Standing Certificate enforcement
9. Supervised practice period calculation
10. Private practice experience rejection
11. Proper eligibility algorithm
12. And 7 more critical fixes...

### 🎯 New Features:
- Typo-tolerant specialty search
- Modular JSON data files
- Support for both physicians and dentists
- Improved user experience
- Mobile-responsive design
- Real-time validation

## Troubleshooting

### Assessment tool doesn't load
- Check browser console for errors (F12)
- Verify all JSON files are uploaded
- Clear browser cache and reload

### Data not saving to Google Sheets
- Verify Google Apps Script URL in config.js
- Check that Apps Script is deployed as web app
- Ensure "Who has access" is set to "Anyone"

### Form validation errors
- Ensure all required fields are filled
- Check that radio buttons and checkboxes are working

## Support

For technical support:
- **Email**: medwindowqatar@gmail.com
- **WhatsApp**: +974 74749336

## Version Information

- **Version**: 2.0 Final Optimized
- **Release Date**: 2025
- **Compliance**: MOPH/DHP Qatar Physician & Dentist Licensing Requirements
- **Status**: Production Ready

---

© 2025 MedWindow Qatar. All rights reserved.

