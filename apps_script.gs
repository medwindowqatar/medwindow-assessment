// Google Apps Script backend for MedWindow Qatar Assessment Tool
// Version 3.0 - Complete Optimization with All New Fields
// © 2025 MedWindow Qatar

const SHEET_NAME = 'PhysicianEligibility';
const EMAIL_NOTIFY = 'medwindowqatar@gmail.com'; // Set to empty string '' to disable email notifications

// Define all headers including new optimization fields
const HEADERS = [
  // Submission metadata
  "submissionDate",
  "submissionTime",
  
  // Personal Information
  "fullName",
  "email",
  "phone",
  "profession",
  
  // Identity & Location (NEW)
  "nationality",
  "homeCountry",
  "currentResidencyCountry",
  
  // Visa Status
  "visaStatus",
  "qidNumber",
  
  // Education
  "medicalSchool",
  "graduationYear",
  
  // Internship (ENHANCED)
  "internshipCompleted",
  "internshipMonths",
  "internshipLocation",
  
  // Specialty
  "hasSpecialty",
  "targetScopeOfPractice",
  "specialtyName",
  "specialtyQualification",
  "otherQualification",
  "qualifyingExam",
  "specialtyYear",
  "qualificationCategory",
  
  // Licensing (NEW)
  "licenseHomeStatus",
  "licenseHomeNumber",
  "licenseResidencyStatus",
  "licenseResidencyNumber",
  
  // Good Standing Certificates (NEW)
  "goodStandingHome",
  "goodStandingResidency",
  "gscActionsNeeded",
  
  // DataFlow (NEW)
  "dataflowStatus",
  "dataflowLastGCCCountry",
  "dataflowLastGCCDate",
  "dataflowAction",
  
  // Experience Summary
  "totalExperienceYears",
  "postSpecialtyExperienceYears",
  
  // Experience Entries (NEW - JSON array)
  "experienceEntriesJSON",
  "qualifyingPostSpecYears",
  
  // Break in Practice (ENHANCED)
  "lastPracticeDate",
  "breakInPractice",
  "breakYears",
  "breakMonths",
  "breakReasons",
  "breakHasExceptions",
  "breakExceptionDetails",
  "recencyMonthsOrSupervisedMonths",
  "recencyType",
  
  // Private Experience Flags (NEW)
  "privateExperienceFlags",
  
  // Aesthetic Medicine (NEW)
  "isAestheticMedicinePath",
  "aestheticCoreSpecialty",
  "aestheticCoursesCompleted",
  "aestheticExperienceYears",
  "aestheticPathNotes",
  
  // Salary Expectations (NEW)
  "employmentType",
  "salaryQatarMin",
  "salaryQatarMax",
  "visitingUSDMin",
  "visitingUSDMax",
  
  // Work Preferences
  "desiredWorkNature",
  "compensationPlan",
  "sector",
  "assistance",
  
  // Additional Information
  "additionalNotes",
  "consent",
  "whatsappConsent",
  
  // Eligibility Assessment (HIDDEN FROM USER - FOR INTERNAL USE)
  "eligibilityStatus",
  "eligibilitySummaryText",
  "dataflowRequired",
  "prometric ExamRequired",
  "prometric ExamType",
  "supervisionRequired",
  "supervisionMonths",
  "goodStandingRequired",
  "nextSteps",
  "internalNotes"
];

function _getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  
  // Check if headers need to be added
  const firstRow = sh.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needHeaders = firstRow.filter(String).length === 0;
  
  if (needHeaders) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    
    // Format header row
    const headerRange = sh.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4A5568');
    headerRange.setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  
  return sh;
}

function doPost(e) {
  try {
    const sh = _getSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add submission timestamp
    const now = new Date();
    data.submissionDate = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    data.submissionTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');
    
    // Map data to row based on HEADERS
    const row = HEADERS.map(header => {
      if (header in data) {
        const value = data[header];
        
        // Convert arrays and objects to JSON strings
        if (Array.isArray(value) || typeof value === 'object') {
          return JSON.stringify(value);
        }
        
        return value;
      }
      return '';
    });
    
    // Append the row
    sh.appendRow(row);
    
    // Send email notification if enabled
    if (EMAIL_NOTIFY) {
      sendEmailNotification(data);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: 'Submission received successfully' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(data) {
  try {
    const subject = `New MedWindow Assessment: ${data.fullName || 'Unknown'} - ${data.profession || 'N/A'}`;
    
    let htmlBody = '<h2>New Eligibility Assessment Submission</h2>';
    htmlBody += '<h3>Personal Information</h3>';
    htmlBody += `<p><strong>Name:</strong> ${data.fullName || 'N/A'}</p>`;
    htmlBody += `<p><strong>Email:</strong> ${data.email || 'N/A'}</p>`;
    htmlBody += `<p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>`;
    htmlBody += `<p><strong>Profession:</strong> ${data.profession || 'N/A'}</p>`;
    htmlBody += `<p><strong>Nationality:</strong> ${data.nationality || 'N/A'}</p>`;
    htmlBody += `<p><strong>Target Scope:</strong> ${data.targetScopeOfPractice || 'N/A'}</p>`;
    
    htmlBody += '<h3>Eligibility Summary</h3>';
    htmlBody += `<p><strong>Status:</strong> ${data.eligibilityStatus || 'Pending Review'}</p>`;
    htmlBody += `<p><strong>Summary:</strong> ${data.eligibilitySummaryText || 'N/A'}</p>`;
    
    htmlBody += '<hr><h3>Full Data (JSON)</h3>';
    htmlBody += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    
    MailApp.sendEmail({
      to: EMAIL_NOTIFY,
      subject: subject,
      htmlBody: htmlBody
    });
    
  } catch (err) {
    Logger.log('Error sending email: ' + err.toString());
  }
}

function doGet() {
  return ContentService.createTextOutput('MedWindow Qatar Assessment Tool - Google Apps Script is running');
}

// Test function to verify setup
function testSetup() {
  const sh = _getSheet();
  Logger.log('Sheet name: ' + sh.getName());
  Logger.log('Headers count: ' + HEADERS.length);
  Logger.log('Setup successful!');
}

