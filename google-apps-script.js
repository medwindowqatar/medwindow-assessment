/**
 * MedWindow Qatar - Physician Licensing Eligibility Assessment Tool
 * Google Apps Script for data collection and management
 * 
 * Instructions:
 * 1. Create a new Google Apps Script project in your spreadsheet
 * 2. Copy and paste this entire code
 * 3. Save the project and deploy as a web app
 * 4. Use the web app URL in your assessment tool's form submission
 */

// Spreadsheet ID - Replace with your actual spreadsheet ID if needed
// const SPREADSHEET_ID = '1-XK4taMSrD6gT1FMvr1QQ5SjNUyHpO6Gr1XVYAAillI'; // Uncomment and use this if accessing a specific spreadsheet by ID

// Configuration
const CONFIG = {
  MAIN_SHEET_NAME: 'Physician Assessments',
  SUMMARY_SHEET_NAME: 'Dashboard',
  COLOR_CODES: {
    HEADER: '#073763',
    HEADER_TEXT: '#ffffff',
    SPECIALIST_ELIGIBLE: '#b6d7a8',
    GP_ELIGIBLE: '#ffe599',
    POTENTIALLY_ELIGIBLE: '#9fc5e8',
    NOT_ELIGIBLE: '#ea9999',
    NEEDS_INFO: '#d5a6bd'
  }
};

/**
 * Process form submissions from the assessment tool
 */
function doPost(e) {
  try {
    // Parse the incoming data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // const ss = SpreadsheetApp.openById(SPREADSHEET_ID); // Alternative if using specific spreadsheet ID
    
    // Set up the main data sheet
    const mainSheet = getOrCreateSheet(ss, CONFIG.MAIN_SHEET_NAME);
    
    // Set up the headers if they don't exist
    const headers = getAssessmentHeaders();
    if (mainSheet.getLastRow() === 0) {
      setupHeaders(mainSheet, headers);
    }
    
    // Process the assessment data
    const assessmentResult = processAssessment(data);
    
    // Add the data to the spreadsheet
    const rowData = formatRowData(data, assessmentResult, headers);
    const newRow = mainSheet.getLastRow() + 1;
    mainSheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Apply conditional formatting to the new row
    applyRowFormatting(mainSheet, newRow, assessmentResult.eligibilityCategory);
    
    // Update the dashboard summary
    updateDashboard(ss);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Assessment data saved successfully',
      eligibility: assessmentResult.eligibilityText
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing assessment:', error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create a sheet with the given name
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Set up the headers in the given sheet
 */
function setupHeaders(sheet, headers) {
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(CONFIG.COLOR_CODES.HEADER);
  headerRange.setFontColor(CONFIG.COLOR_CODES.HEADER_TEXT);
  headerRange.setFontWeight('bold');
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Add filters
  sheet.getRange(1, 1, 1, headers.length).createFilter();
}

/**
 * Get the standard headers for the assessment data
 */
function getAssessmentHeaders() {
  return [
    'Timestamp',
    'Full Name',
    'Nationality',
    'Email',
    'WhatsApp',
    'Country of Residence',
    'Visa Status',
    'QID Number',
    'Medical Degree',
    'University',
    'Country of Education',
    'Graduation Year',
    'Internship Completed',
    'Has Specialty',
    'Specialty Name',
    'Specialty Country',
    'Specialty Qualification',
    'Total Experience (Years)',
    'Currently Practicing',
    'Break Duration (Years)',
    'GCC Experience',
    'Dataflow Report',
    'Work Nature',
    'Compensation Plan',
    'Expected Salary (QAR)',
    'Availability',
    'Valid License',
    'Good Standing Certificate',
    'Experience Certificates',
    'CPR Certification',
    'Updated CV',
    'Assistance Needed',
    'Additional Comments',
    'Eligibility Assessment',
    'Next Steps',
    'Follow-up Status'
  ];
}

/**
 * Format the row data for insertion into the spreadsheet
 */
function formatRowData(data, assessmentResult, headers) {
  // Create an array to hold the row data
  const rowData = [];
  
  // Map form data to spreadsheet columns
  rowData.push(new Date()); // Timestamp
  rowData.push(data.fullName || '');
  rowData.push(data.nationality || '');
  rowData.push(data.email || '');
  rowData.push(data.phone || '');
  rowData.push(data.currentCountry || '');
  rowData.push(data.visaStatus || '');
  rowData.push(data.qidNumber || '');
  rowData.push(data.medicalDegree || '');
  rowData.push(data.universityName || '');
  rowData.push(data.countryOfEducation || '');
  rowData.push(data.graduationYear || '');
  rowData.push(data.internshipCompleted || '');
  rowData.push(data.hasSpecialty || '');
  rowData.push(data.specialtyName || '');
  rowData.push(data.specialtyCountry || '');
  rowData.push(data.specialtyQualification || '');
  rowData.push(data.totalExperience || '');
  rowData.push(data.currentlyPracticing || '');
  rowData.push(data.breakDuration || '');
  rowData.push(data.gccExperience || '');
  rowData.push(data.dataflowReport || '');
  rowData.push(data.workNature || '');
  rowData.push(data.compensationPlan || '');
  rowData.push(data.expectedSalary || '');
  rowData.push(data.availabilityToStart || '');
  rowData.push(data.validLicense || '');
  rowData.push(data.goodStandingCertificate || '');
  rowData.push(data.experienceCertificates || '');
  rowData.push(data.cprCertification || '');
  rowData.push(data.updatedCV || '');
  
  // Handle array values (checkboxes)
  if (Array.isArray(data.assistanceNeeded)) {
    rowData.push(data.assistanceNeeded.join(', '));
  } else {
    rowData.push(data.assistanceNeeded || '');
  }
  
  rowData.push(data.additionalComments || '');
  rowData.push(assessmentResult.eligibilityText);
  rowData.push(assessmentResult.nextSteps);
  rowData.push('Pending'); // Follow-up Status
  
  // Ensure the row data has the correct number of columns
  while (rowData.length < headers.length) {
    rowData.push('');
  }
  
  return rowData;
}

/**
 * Apply formatting to a row based on eligibility category
 */
function applyRowFormatting(sheet, rowIndex, eligibilityCategory) {
  let backgroundColor;
  
  switch (eligibilityCategory) {
    case 'SPECIALIST_ELIGIBLE':
      backgroundColor = CONFIG.COLOR_CODES.SPECIALIST_ELIGIBLE;
      break;
    case 'GP_ELIGIBLE':
      backgroundColor = CONFIG.COLOR_CODES.GP_ELIGIBLE;
      break;
    case 'POTENTIALLY_ELIGIBLE':
      backgroundColor = CONFIG.COLOR_CODES.POTENTIALLY_ELIGIBLE;
      break;
    case 'NOT_ELIGIBLE':
      backgroundColor = CONFIG.COLOR_CODES.NOT_ELIGIBLE;
      break;
    default:
      backgroundColor = CONFIG.COLOR_CODES.NEEDS_INFO;
  }
  
  // Apply background color to the eligibility assessment cell
  const eligibilityColumn = 34; // Column AH - Eligibility Assessment
  sheet.getRange(rowIndex, eligibilityColumn).setBackground(backgroundColor);
}

/**
 * Process the assessment data and determine eligibility
 */
function processAssessment(data) {
  try {
    let eligibilityText = '';
    let eligibilityCategory = '';
    let nextSteps = '';
    
    // Check for specialist eligibility
    if (data.hasSpecialty === 'yes' && 
        parseFloat(data.totalExperience) >= 5 && 
        data.validLicense === 'yes') {
      
      // Check for break in practice
      if (data.currentlyPracticing === 'no' && parseFloat(data.breakDuration) > 2) {
        eligibilityText = "Potentially Eligible with Conditions: Specialist license possible after supervised practice due to break in practice";
        eligibilityCategory = 'POTENTIALLY_ELIGIBLE';
        nextSteps = "1. Submit Break in Practice remediation plan\n2. Prepare for supervised practice period\n3. Complete QCHP licensing application";
      } else {
        eligibilityText = "Eligible for Specialist License";
        eligibilityCategory = 'SPECIALIST_ELIGIBLE';
        nextSteps = "1. Prepare QCHP licensing application\n2. Submit dataflow verification\n3. Gather required documentation";
      }
    }
    // Check for general practitioner eligibility
    else if (data.internshipCompleted === 'yes' && 
             parseFloat(data.totalExperience) >= 2 && 
             data.validLicense === 'yes') {
      
      // Check for break in practice
      if (data.currentlyPracticing === 'no' && parseFloat(data.breakDuration) > 2) {
        eligibilityText = "Potentially Eligible with Conditions: General Practitioner license possible after supervised practice due to break in practice";
        eligibilityCategory = 'POTENTIALLY_ELIGIBLE';
        nextSteps = "1. Submit Break in Practice remediation plan\n2. Prepare for supervised practice period\n3. Complete QCHP licensing application";
      } else {
        eligibilityText = "Eligible for General Practitioner License";
        eligibilityCategory = 'GP_ELIGIBLE';
        nextSteps = "1. Prepare QCHP licensing application\n2. Submit dataflow verification\n3. Gather required documentation";
      }
    }
    // Check for potential eligibility with conditions
    else if (data.internshipCompleted === 'yes' && parseFloat(data.totalExperience) >= 1) {
      eligibilityText = "Potentially Eligible with Conditions: May require qualifying examination and additional documentation";
      eligibilityCategory = 'POTENTIALLY_ELIGIBLE';
      nextSteps = "1. Prepare for qualifying examination\n2. Submit additional documentation\n3. Consider supervised practice options";
    }
    // Check for ineligibility
    else if (data.internshipCompleted === 'no' || parseFloat(data.totalExperience) < 1) {
      eligibilityText = "Not Eligible: Does not meet minimum requirements for licensing in Qatar";
      eligibilityCategory = 'NOT_ELIGIBLE';
      nextSteps = "1. Gain additional clinical experience\n2. Complete required training\n3. Consider alternative pathways";
    }
    // Default case
    else {
      eligibilityText = "Needs Further Information: Please contact MedWindow for detailed assessment";
      eligibilityCategory = 'NEEDS_INFO';
      nextSteps = "1. Submit additional documentation\n2. Schedule consultation with MedWindow\n3. Explore alternative licensing options";
    }
    
    return {
      eligibilityText: eligibilityText,
      eligibilityCategory: eligibilityCategory,
      nextSteps: nextSteps
    };
    
  } catch (error) {
    console.error('Error in eligibility assessment:', error);
    return {
      eligibilityText: "Assessment Error: Unable to determine eligibility",
      eligibilityCategory: 'NEEDS_INFO',
      nextSteps: "Contact MedWindow for manual assessment"
    };
  }
}

/**
 * Update the dashboard summary sheet
 */
function updateDashboard(spreadsheet) {
  // Get or create the dashboard sheet
  const dashboardSheet = getOrCreateSheet(spreadsheet, CONFIG.SUMMARY_SHEET_NAME);
  
  // Clear existing content
  dashboardSheet.clear();
  
  // Set up dashboard title
  dashboardSheet.getRange(1, 1).setValue('MedWindow Qatar - Physician Assessment Dashboard');
  dashboardSheet.getRange(1, 1).setFontWeight('bold').setFontSize(16);
  
  // Get the main data sheet
  const mainSheet = spreadsheet.getSheetByName(CONFIG.MAIN_SHEET_NAME);
  const dataRange = mainSheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length <= 1) {
    // No data yet
    dashboardSheet.getRange(3, 1).setValue('No assessment data available yet.');
    return;
  }
  
  // Calculate summary statistics
  const totalAssessments = values.length - 1; // Subtract header row
  
  let specialistEligible = 0;
  let gpEligible = 0;
  let potentiallyEligible = 0;
  let notEligible = 0;
  let needsInfo = 0;
  
  // Find the eligibility column index
  const headers = values[0];
  const eligibilityIndex = headers.findIndex(header => header === 'Eligibility Assessment');
  
  if (eligibilityIndex === -1) {
    dashboardSheet.getRange(3, 1).setValue('Error: Eligibility Assessment column not found.');
    return;
  }
  
  // Count the different eligibility categories
  for (let i = 1; i < values.length; i++) {
    const eligibility = values[i][eligibilityIndex];
    
    if (eligibility.includes('Eligible for Specialist')) {
      specialistEligible++;
    } else if (eligibility.includes('Eligible for General Practitioner')) {
      gpEligible++;
    } else if (eligibility.includes('Potentially Eligible')) {
      potentiallyEligible++;
    } else if (eligibility.includes('Not Eligible')) {
      notEligible++;
    } else {
      needsInfo++;
    }
  }
  
  // Add summary statistics to dashboard
  dashboardSheet.getRange(3, 1).setValue('Summary Statistics');
  dashboardSheet.getRange(3, 1).setFontWeight('bold');
  
  dashboardSheet.getRange(4, 1).setValue('Total Assessments:');
  dashboardSheet.getRange(4, 2).setValue(totalAssessments);
  
  dashboardSheet.getRange(5, 1).setValue('Specialist Eligible:');
  dashboardSheet.getRange(5, 2).setValue(specialistEligible);
  dashboardSheet.getRange(5, 2).setBackground(CONFIG.COLOR_CODES.SPECIALIST_ELIGIBLE);
  
  dashboardSheet.getRange(6, 1).setValue('GP Eligible:');
  dashboardSheet.getRange(6, 2).setValue(gpEligible);
  dashboardSheet.getRange(6, 2).setBackground(CONFIG.COLOR_CODES.GP_ELIGIBLE);
  
  dashboardSheet.getRange(7, 1).setValue('Potentially Eligible:');
  dashboardSheet.getRange(7, 2).setValue(potentiallyEligible);
  dashboardSheet.getRange(7, 2).setBackground(CONFIG.COLOR_CODES.POTENTIALLY_ELIGIBLE);
  
  dashboardSheet.getRange(8, 1).setValue('Not Eligible:');
  dashboardSheet.getRange(8, 2).setValue(notEligible);
  dashboardSheet.getRange(8, 2).setBackground(CONFIG.COLOR_CODES.NOT_ELIGIBLE);
  
  dashboardSheet.getRange(9, 1).setValue('Needs Further Information:');
  dashboardSheet.getRange(9, 2).setValue(needsInfo);
  dashboardSheet.getRange(9, 2).setBackground(CONFIG.COLOR_CODES.NEEDS_INFO);
  
  // Add last updated timestamp
  dashboardSheet.getRange(11, 1).setValue('Last Updated:');
  dashboardSheet.getRange(11, 2).setValue(new Date());
  
  // Auto-resize columns
  dashboardSheet.autoResizeColumn(1);
  dashboardSheet.autoResizeColumn(2);
}

/**
 * Test function to simulate a form submission
 * This can be run manually to test the script
 */
function testSubmission() {
  const testData = {
    fullName: 'Dr. Test Physician',
    nationality: 'United Kingdom',
    email: 'test@example.com',
    phone: '+974 1234 5678',
    currentCountry: 'United Kingdom',
    visaStatus: 'none',
    medicalDegree: 'MBBS',
    universityName: 'University of London',
    countryOfEducation: 'United Kingdom',
    graduationYear: '2010',
    internshipCompleted: 'yes',
    internshipDuration: '12',
    hasSpecialty: 'yes',
    specialtyName: 'Internal Medicine',
    specialtyCountry: 'uk',
    specialtyQualification: 'MRCP (UK) - Royal College of Physicians',
    specialtyYear: '2015',
    residencyDuration: '5',
    totalExperience: '10',
    currentlyPracticing: 'yes',
    currentWorkplace: 'London General Hospital',
    currentPosition: 'Consultant',
    licenseCountry: 'United Kingdom',
    gccExperience: 'no',
    dataflowReport: 'no',
    workNature: 'resident-full',
    compensationPlan: 'fixed',
    expectedSalary: '30000',
    availabilityToStart: '2',
    preferredSectors: ['private', 'academic'],
    validLicense: 'yes',
    goodStandingCertificate: 'yes',
    experienceCertificates: 'yes',
    cprCertification: 'yes',
    updatedCV: 'yes',
    assistanceNeeded: ['licensing', 'dataflow'],
    additionalComments: 'Looking forward to opportunities in Qatar.'
  };
  
  // Create a mock event object
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  // Call the doPost function with the mock event
  const result = doPost(mockEvent);
  
  // Log the result
  console.log(result.getContent());
}
