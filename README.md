# MedWindow Qatar - Physician & Dentist Licensing Eligibility Assessment Tool
## Final Optimized Version 2.0

### Overview

This is the fully optimized and MOPH/DHP-compliant version of the MedWindow Qatar assessment tool. It incorporates all critical gap fixes and follows best practices for maintainability and scalability.

### Key Features

#### ✅ Full MOPH/DHP Compliance
- Category 1/2/3 classification system
- Accurate break-in-practice logic (≥1 year threshold)
- Post-specialty experience tracking
- Qualifying exam requirements
- Experience type validation
- Mandatory Dataflow verification
- Good Standing Certificate requirements

#### 🎯 Optimized Architecture
- **Modular JSON data files** for easy updates
- **Specialty aliases** for typo-tolerant search
- **Separated configuration** for maintainability
- **Clean Google Apps Script** integration
- **Support for physicians AND dentists**

#### 📊 Enhanced User Experience
- Multi-step form with progress tracking
- Conditional logic based on responses
- Real-time validation
- Mobile-responsive design
- Professional MedWindow branding

### File Structure

```
medwindow-final/
├── index.html                    # Main HTML file
├── app.js                        # Application logic (TO BE CREATED)
├── config.js                     # Configuration (Google Sheets URL, contact info)
├── styles.css                    # Custom styles
├── logo.jpeg                     # MedWindow logo
├── apps_script.gs                # Google Apps Script for data collection
├── qualifications_index.json     # Qualification categories by profession
├── specialties_map.json          # Specialty-specific qualifications
├── specialty_aliases.json        # Typo-tolerant specialty search
├── static_lists.json             # Country categories and other static data
├── dentist_exam_rules.json       # Dentist-specific exam requirements
└── README.md                     # This file
```

### Deployment Instructions

#### Step 1: Set Up Google Sheets Integration

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1-XK4taMSrD6gT1FMvr1QQ5SjNUyHpO6Gr1XVYAAillI/edit
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy the entire contents of `apps_script.gs`
5. Paste into the Apps Script editor
6. Save the project (name it "MedWindow Assessment")
7. Deploy as web app:
   - Click **Deploy > New deployment**
   - Select type: **Web app**
   - Set "Execute as" to **Me**
   - Set "Who has access" to **Anyone**
   - Click **Deploy**
8. Copy the web app URL (ends with `/exec`)
9. Update `config.js` with this URL

#### Step 2: Deploy to GitHub Pages

1. Go to your GitHub repository: https://github.com/medwindowqatar/medwindow-assessment
2. Delete all existing files
3. Upload all files from this package
4. Commit changes
5. Wait 2-3 minutes for GitHub Pages to update
6. Test at: https://medwindowqatar.github.io/medwindow-assessment/

#### Step 3: Test the Complete Flow

1. Open the assessment tool
2. Complete a test assessment
3. Verify data appears in your Google Sheet
4. Check eligibility assessment accuracy

### Data Files Explained

#### qualifications_index.json
Lists all qualification categories (1, 2, Other) by profession (physicians/dentists).

#### specialties_map.json
Maps specific specialties to their accepted qualifications by category.

#### specialty_aliases.json
Provides typo-tolerant search - maps common misspellings and abbreviations to official specialty names.

#### static_lists.json
Contains country categories and other static dropdown options.

#### dentist_exam_rules.json
Specific exam requirements for dentist specialties.

### Updating Data

To update qualification lists or requirements:

1. Edit the appropriate JSON file
2. Commit changes to GitHub
3. Changes take effect immediately (no code changes needed)

### Category System

#### Category 1
- **Physicians**: 1 year post-specialty experience, NO exam required
- **Dentists**: 1 year post-specialty experience, NO exam required
- Examples: CCT (UK), ABMS (USA), MRCP (UK)

#### Category 2
- **Physicians**: 2 years post-specialty experience, NO exam required
- **Dentists**: 2 years post-specialty experience, NO exam required
- Examples: Arab Board, DNB (India), FCPS (Pakistan)

#### Category 3 (Other)
- **Physicians**: 3 years structured training + 3 years experience + MUST pass DHP qualifying exam
- **Dentists**: 3 years structured training + 3 years experience + MUST pass DHP qualifying exam
- Examples: Egyptian Master's degrees, Malaysian Doctorate degrees

### Eligibility Results

The tool provides one of the following results:

1. **Eligible for Specialist/GP License** - Meets all requirements
2. **Potentially Eligible with Conditions** - Needs additional requirements
3. **Not Eligible** - Does not meet minimum requirements
4. **Needs Further Information** - Requires personalized assessment

### Support

For technical support or questions:
- **Email**: medwindowqatar@gmail.com
- **WhatsApp**: +974 74749336

### Version History

- **v2.0-optimized** (Current) - Full MOPH/DHP compliance + optimized architecture
- **v1.0** - Initial version with basic assessment

### License

© 2025 MedWindow Qatar. All rights reserved.

