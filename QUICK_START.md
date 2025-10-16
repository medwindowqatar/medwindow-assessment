# MedWindow Qatar Assessment Tool - Quick Start Guide

## Version 3.0 - Optimized Package

---

## 📦 What's in This Package

This zip file contains the complete, optimized MedWindow Qatar Physician & Dentist Licensing Eligibility Assessment Tool with all new features implemented.

### Files Included:
- `index.html` - Main application page
- `app.js` - Application logic (12-step form with all new features)
- `styles.css` - Custom styling
- `config.js` - Configuration settings
- `apps_script.gs` - Google Apps Script backend
- `logo.jpeg` - MedWindow logo
- **Data Files:**
  - `static_lists.json` - Countries, specialties, workplace types
  - `qualifications_index.json` - Qualification mappings
  - `specialties_map.json` - Specialty categories
  - `specialty_aliases.json` - Specialty name variations
  - `dentist_exam_rules.json` - Dentist exam requirements
  - `aesthetic_medicine_rules.json` - Aesthetic medicine requirements (NEW)
  - `break_practice_rules.json` - Break-in-practice rules (NEW)
- **Documentation:**
  - `README.md` - Complete documentation
  - `DEPLOYMENT_INSTRUCTIONS.md` - Detailed deployment guide
  - `QUICK_START.md` - This file

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Setup Google Sheets Backend (2 minutes)

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "MedWindow Assessments"
4. Click **Extensions** → **Apps Script**
5. Delete any default code
6. Open `apps_script.gs` from this package
7. Copy ALL the code and paste it into Apps Script
8. Click **Save** (disk icon)
9. Click **Deploy** → **New deployment**
10. Click the gear icon ⚙️ next to "Select type"
11. Choose **Web app**
12. Settings:
    - Description: "MedWindow Assessment Backend"
    - Execute as: **Me**
    - Who has access: **Anyone**
13. Click **Deploy**
14. Click **Authorize access** and complete authorization
15. **COPY the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

### Step 2: Configure the Tool (1 minute)

1. Open `config.js` in a text editor
2. Find the line: `GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/...'`
3. Replace the URL with the one you copied in Step 1
4. Save the file

### Step 3: Upload to GitHub (2 minutes)

1. Go to your GitHub repository: `medwindowqatar/medwindow-assessment`
2. Click **Add file** → **Upload files**
3. Drag and drop ALL files from this package
4. Check "Replace existing files" if prompted
5. Scroll down and click **Commit changes**
6. Wait 1-2 minutes for GitHub Pages to rebuild

### Step 4: Test Your Tool

1. Visit: `https://medwindowqatar.github.io/medwindow-assessment/`
2. Complete a test assessment
3. Check your Google Sheet to verify data is being received

---

## ✅ What's New in Version 3.0

### New Features:
- ✅ **12-step comprehensive assessment** (was 9 steps)
- ✅ **Multi-entry experience tracking** with "Add More" button
- ✅ **Home country, nationality, residency tracking**
- ✅ **Internship duration validation** (minimum 12 months)
- ✅ **Medical license tracking** (home & residency countries)
- ✅ **Good Standing Certificate status** (Available/Can Provide/Cannot Provide)
- ✅ **DataFlow history in GCC** (Never/Transfer with date tracking)
- ✅ **Break-in-practice logic** with exceptions (maternity, medical, COVID, etc.)
- ✅ **Aesthetic Medicine pathway** with specific requirements
- ✅ **Salary expectations** (QAR monthly for Qatar-based, USD daily for visiting)
- ✅ **Hidden results** - Users see only thank you message (results in Google Sheets only)

### Enhanced Data Export:
All submissions now include **60+ data points** exported to Google Sheets for comprehensive team review.

---

## 🔧 Configuration Options

Edit `config.js` to customize:

```javascript
// Contact Information
CONTACT: {
    whatsapp: '+97474749336',
    email: 'medwindowqatar@gmail.com'
}

// Form Settings
FORM: {
    totalSteps: 12,
    enableValidation: true
}

// Assessment Rules
ASSESSMENT: {
    breakInPracticeThresholdMonths: 12,
    minimumInternshipMonths: 12
}

// Feature Flags
FEATURES: {
    showEligibilityToUser: false,  // Keep false - results hidden
    exportToGoogleSheets: true
}
```

---

## 📊 Google Sheets Columns

Your Google Sheet will automatically create these columns:

**Personal:** fullName, email, phone, profession, nationality, homeCountry, currentResidencyCountry

**Education:** medicalSchool, graduationYear, internshipMonths, internshipLocation

**Specialty:** targetScopeOfPractice, specialtyQualification, specialtyYear

**Licensing:** licenseHomeStatus, licenseResidencyStatus, goodStandingHome, goodStandingResidency

**DataFlow:** dataflowStatus, dataflowLastGCCCountry, dataflowLastGCCDate

**Experience:** experienceEntriesJSON (array), qualifyingPostSpecYears

**Break:** breakInPractice, breakYears, breakReasons, breakExceptionDetails

**Aesthetic:** isAestheticMedicinePath, aestheticCoreSpecialty, aestheticExperienceYears

**Salary:** employmentType, salaryQatarMin, salaryQatarMax, visitingUSDMin, visitingUSDMax

**Assessment:** eligibilityStatus, eligibilitySummaryText, dataflowAction, examRequired, supervisionRequired

---

## 🎯 User Experience Flow

1. User visits your GitHub Pages URL
2. Completes 12-step assessment (15-20 minutes)
3. Submits form
4. Sees **thank you message only** (NO eligibility results)
5. Data exports to Google Sheets with full analysis
6. Your team reviews and contacts via WhatsApp within 24-48 hours

---

## 🆘 Troubleshooting

### Form not submitting?
- Check that `config.js` has the correct Google Script URL
- Verify Google Apps Script deployment is set to "Anyone" access
- Check browser console for errors (F12)

### Data not appearing in Google Sheets?
- Verify the Google Script URL is correct
- Check that the script is deployed as a web app
- Look at the Apps Script execution logs (View → Executions)

### Styling looks broken?
- Ensure `styles.css` is uploaded
- Check that Tailwind CSS CDN is loading (internet required)
- Clear browser cache

---

## 📞 Support

For technical issues or questions:
- **Email:** medwindowqatar@gmail.com
- **WhatsApp:** +974 7474 9336

---

## 📝 License

© 2025 MedWindow Qatar. All rights reserved.

---

## 🎉 You're All Set!

Your optimized assessment tool is now ready to use. The new features will help you collect comprehensive data for better eligibility evaluation.

**Next Steps:**
1. Test the tool thoroughly
2. Share the URL with your team
3. Monitor submissions in Google Sheets
4. Contact applicants with detailed guidance

Good luck! 🚀
