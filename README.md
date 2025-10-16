# MedWindow Qatar - Physician & Dentist Licensing Eligibility Assessment Tool

## Version 3.0 - Complete Optimization

© 2025 MedWindow Qatar - Your window to healthcare excellence in Qatar

---

## Overview

This is a comprehensive web-based eligibility assessment tool for physicians and dentists seeking medical licensing in Qatar. The tool evaluates candidates based on official MOPH (Ministry of Public Health) and DHP (Department of Healthcare Professions) requirements.

### Key Features

- **12-Step Comprehensive Assessment** - Covers all aspects of eligibility
- **Multi-Entry Experience Tracking** - Detailed work history with validation
- **Intelligent Eligibility Logic** - Based on official DHP flowcharts and requirements
- **Hidden Results** - Assessment results exported to Google Sheets only (not shown to users)
- **Mobile Responsive** - Works on all devices
- **Google Sheets Integration** - Automatic data export for team review

---

## What's New in Version 3.0

### New Form Fields

#### Identity & Location
- **Nationality** - Applicant's citizenship
- **Home Country** - Country of origin
- **Current Residency Country** - Where applicant currently lives

#### Internship Details
- **Internship Duration (months)** - Must be ≥12 months
- **Internship Location** - Institution and country

#### Licensing Status
- **License to Practice in Home Country** - Status and number
- **License to Practice in Residency Country** - Status and number

#### Good Standing Certificates (GSC)
- **GSC from Home Country** - Available/Can Provide/Cannot Provide
- **GSC from Residency Country** - Available/Can Provide/Cannot Provide
- **GSC Validity Tracking** - Must be within 6 months

#### DataFlow History
- **Last DataFlow in GCC** - Never/Transfer/Renewal
- **DataFlow Country** - Which GCC country
- **DataFlow Date** - When it was done
- **DataFlow Action Required** - New Application/Transfer/Renewal

#### Experience Tracking (Multi-Entry)
Each experience entry includes:
- **From Date** - MM/YYYY format
- **To Date** - MM/YYYY format
- **Place of Work** - Institution name
- **Workplace Type** - Government/Private Hospital/Academic/etc.
- **Country** - Where the work was done
- **Clinical Hours per Week** - For private sector validation

Users can add multiple experience entries with "Add More Experience" button.

#### Break in Practice
- **Last Practice Date** - When they last worked clinically
- **Break Duration** - Calculated automatically
- **Break Reasons** - Why there was a gap
- **Break Exceptions** - Maternity/Medical/Education/COVID/etc.
- **Exception Documentation** - Details of exception

#### Aesthetic Medicine Path
- **Core Specialty** - Dermatology/Plastic Surgery/GP
- **Aesthetic Training Courses** - Injectable/Laser certifications
- **Aesthetic Experience Years** - Years in aesthetic practice

#### Salary Expectations
- **Employment Type** - Fixed salary/Visiting/Partnership
- **Salary Range (QAR)** - For Qatar-based positions (min-max per month)
- **Daily Rate (USD)** - For visiting physicians (min-max per day)

### New Assessment Logic

#### 1. DataFlow Logic
```
IF never had DataFlow in GCC:
    → Action: New Application

IF had DataFlow (Transfer):
    IF within validity (24 months):
        → Action: Transfer
    ELSE:
        → Action: Renewal
```

#### 2. Good Standing Certificate Logic
```
GSC from Home Country: Required
GSC from Residency Country: Required if different from home

Validity Window: Must be within 6 months of application
```

#### 3. Aesthetic Medicine Path
```
IF Target Scope = Aesthetic Medicine:
    Check Core Specialty (Derm/Plastics/GP+training)
    Check Aesthetic Courses (injectables/laser)
    Check Aesthetic Experience (≥3 years for residents, ≥5 for non-residents)
    
    IF all requirements met:
        → Proceed like Specialist + possible exam
    ELSE:
        → Supervised track or ineligible
```

#### 4. Experience Qualification Logic
```
FOR each experience entry:
    IF Workplace Type = Government/Educational/Military/Quasi-Gov:
        → Counts fully
    
    IF Workplace Type = Private Hospital/Center:
        Check: Licensed facility?
        Check: Full-time (≥40 hours/week)?
        IF yes → Counts fully
        ELSE → Does not qualify
    
    IF Workplace Type = Academic/Charity:
        Check: Direct clinical patient care?
        IF yes → Counts fully
        ELSE → Does not qualify

Calculate: Total Qualifying Post-Specialty Years
```

#### 5. Break in Practice Logic
```
Break Threshold: 12 months without clinical practice

FOR Overseas Applicants:
    Maximum Break Allowed: 24 months
    
    IF break 12-18 months:
        → Recency requirement: 3 months recent activity
    IF break 18-24 months:
        → Recency requirement: 6 months recent activity
    IF break >24 months:
        → Ineligible

FOR Qatar Residents (QID holders):
    No maximum break limit
    
    IF break 12-24 months:
        → Supervised practice: 3 months in Qatar
    IF break 24-36 months:
        → Supervised practice: 6 months in Qatar
    IF break 36-60 months:
        → Supervised practice: 12 months in Qatar
    IF break >60 months:
        → Supervised practice: 24 months in Qatar

Exceptions (do not count as break):
- Maternity/Paternity leave (≤12 months)
- Medical leave (≤12 months)
- Further education (accredited program)
- Research with clinical component (≤24 months)
- COVID-related interruptions (≤18 months, 2020-2022)
```

#### 6. Master Eligibility Flow
```
1. Check: Observership-only?
   IF yes → Ineligible

2. Check: Certification title approved for specialty & category?
   IF no → Flag for manual review

3. Check: Internship months ≥ minimum (12)?
   IF no → Missing requirement

4. Compute: Qualifying post-specialty years (from accepted sources)

5. Check: Enough years for target scope?
   IF no → Suggest lower scope or supervised track

6. Evaluate: Break-in-practice
   Apply overseas or Qatar resident rules

7. Determine: Exam requirement
   Based on qualification category

8. Determine: DataFlow action
   New/Transfer/Renewal

9. Check: Good Standing certificates
   Home + Residency

10. Compose: Eligibility Summary (HIDDEN FROM USER)

11. Export: To Google Sheet with all details
```

### Google Sheets Export Columns

All submissions are exported to Google Sheets with these columns:

**Metadata:**
- submissionDate
- submissionTime

**Personal Information:**
- fullName
- email
- phone
- profession

**Identity & Location:**
- nationality
- homeCountry
- currentResidencyCountry

**Visa Status:**
- visaStatus
- qidNumber

**Education:**
- medicalSchool
- graduationYear

**Internship:**
- internshipCompleted
- internshipMonths
- internshipLocation

**Specialty:**
- hasSpecialty
- targetScopeOfPractice
- specialtyName
- specialtyQualification
- otherQualification
- qualifyingExam
- specialtyYear
- qualificationCategory

**Licensing:**
- licenseHomeStatus
- licenseHomeNumber
- licenseResidencyStatus
- licenseResidencyNumber

**Good Standing:**
- goodStandingHome
- goodStandingResidency
- gscActionsNeeded

**DataFlow:**
- dataflowStatus
- dataflowLastGCCCountry
- dataflowLastGCCDate
- dataflowAction

**Experience:**
- totalExperienceYears
- postSpecialtyExperienceYears
- experienceEntriesJSON (array of all entries)
- qualifyingPostSpecYears

**Break in Practice:**
- lastPracticeDate
- breakInPractice
- breakYears
- breakMonths
- breakReasons
- breakHasExceptions
- breakExceptionDetails
- recencyMonthsOrSupervisedMonths
- recencyType

**Private Experience:**
- privateExperienceFlags

**Aesthetic Medicine:**
- isAestheticMedicinePath
- aestheticCoreSpecialty
- aestheticCoursesCompleted
- aestheticExperienceYears
- aestheticPathNotes

**Salary:**
- employmentType
- salaryQatarMin
- salaryQatarMax
- visitingUSDMin
- visitingUSDMax

**Work Preferences:**
- desiredWorkNature
- compensationPlan
- sector
- assistance

**Additional:**
- additionalNotes
- consent
- whatsappConsent

**Eligibility Assessment (INTERNAL - NOT SHOWN TO USER):**
- eligibilityStatus
- eligibilitySummaryText
- dataflowRequired
- prometric ExamRequired
- prometric ExamType
- supervisionRequired
- supervisionMonths
- goodStandingRequired
- nextSteps
- internalNotes

---

## File Structure

```
medwindow-assessment/
├── index.html                      # Main HTML file
├── app.js                          # Application logic
├── styles.css                      # Custom styles
├── config.js                       # Configuration
├── logo.jpeg                       # MedWindow logo
├── qualifications_index.json      # Qualification mappings
├── specialties_map.json           # Specialty categories
├── specialty_aliases.json         # Specialty name variations
├── static_lists.json              # Countries, workplace types, specialties
├── dentist_exam_rules.json        # Dentist exam requirements
├── aesthetic_medicine_rules.json  # Aesthetic medicine requirements
├── break_practice_rules.json      # Break-in-practice rules
├── apps_script.gs                 # Google Apps Script backend
├── README.md                      # This file
└── DEPLOYMENT_INSTRUCTIONS.md     # Deployment guide
```

---

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet
2. Open **Extensions** → **Apps Script**
3. Delete the default code
4. Copy and paste the entire content of `apps_script.gs`
5. Save the project (name it "MedWindow Assessment Backend")
6. Click **Deploy** → **New deployment**
7. Select type: **Web app**
8. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
9. Click **Deploy**
10. Copy the **Web app URL**
11. Paste it in `config.js` as `GOOGLE_SCRIPT_URL`

### 2. GitHub Pages Deployment

1. Create a new repository on GitHub (e.g., `medwindow-assessment`)
2. Upload all files to the repository
3. Go to **Settings** → **Pages**
4. Source: **Deploy from a branch**
5. Branch: **main** / **root**
6. Save
7. Your site will be live at: `https://yourusername.github.io/medwindow-assessment/`

### 3. Testing

1. Open the deployed URL
2. Complete a test assessment
3. Check Google Sheets to verify data is being received
4. Verify all form steps are working
5. Test on mobile devices

---

## Configuration

Edit `config.js` to customize:

- **GOOGLE_SCRIPT_URL**: Your Google Apps Script web app URL
- **Contact Information**: WhatsApp, email, website
- **Assessment Rules**: Category requirements, break thresholds, etc.
- **Feature Flags**: Enable/disable specific features

---

## Data Files

### static_lists.json
Contains:
- Countries list
- Workplace types (Government, Private, Academic, etc.)
- DHP approved specialties (Physicians and Dentists)
- GCC countries

### aesthetic_medicine_rules.json
Defines:
- Acceptable base specialties for aesthetic medicine
- Required training/courses
- Experience requirements
- Exam requirements

### break_practice_rules.json
Defines:
- Break-in-practice thresholds
- Recency requirements for overseas applicants
- Supervised practice requirements for Qatar residents
- Acceptable exceptions (maternity, medical, education, COVID)

---

## User Experience

1. **User completes 12-step assessment** (15-20 minutes)
2. **Submits form**
3. **Sees thank you message** (NO eligibility results shown)
4. **Data exported to Google Sheets** with complete eligibility analysis
5. **MedWindow team reviews** and contacts via WhatsApp within 24-48 hours

---

## Privacy & Data Protection

- No personal data is stored on the client side
- All data is transmitted securely to Google Sheets via HTTPS
- Users must consent to data processing before submission
- Optional WhatsApp consent for follow-up

---

## Support

For questions or issues:
- **WhatsApp**: +974 7474 9336
- **Email**: medwindowqatar@gmail.com
- **Website**: https://medwindowqatar.github.io/medwindow-assessment/

---

## License

© 2025 MedWindow Qatar. All rights reserved.

This tool is proprietary software developed for MedWindow Qatar's internal use and client services.

---

## Version History

### Version 3.0 (October 2025)
- Complete optimization with all new requirements
- 12-step comprehensive assessment
- Multi-entry experience tracking
- Enhanced eligibility logic with all DHP flowcharts
- Aesthetic medicine path
- Break-in-practice exceptions
- Salary expectations
- Hidden results (Google Sheets only)

### Version 2.0 (Previous)
- 9-step assessment
- Basic eligibility logic
- Single experience entry
- Results shown to users

### Version 1.0 (Initial)
- Basic form with Google Sheets integration
- Simple eligibility check

