/**
 * MedWindow Qatar v4.1 – Google Apps Script
 */
const CONFIG={MAIN_SHEET_NAME:'Assessments_v41',COLOR_CODES:{HEADER:'#073763',HEADER_TEXT:'#ffffff',ELIGIBLE:'#d1fae5',CONDITIONAL:'#fef3c7',INELIGIBLE:'#fee2e2',REVIEW:'#eff6ff'}};

function doPost(e){
  try{
    let data;
    if(e.postData&&e.postData.contents)data=JSON.parse(e.postData.contents);
    else if(e.parameter)data=e.parameter;
    else throw new Error('No data');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    const sheet=getOrCreate(ss,CONFIG.MAIN_SHEET_NAME);
    const headers=getHeaders();
    if(sheet.getLastRow()===0)setupHeaders(sheet,headers);
    const row=formatRow(data);
    const nr=sheet.getLastRow()+1;
    sheet.getRange(nr,1,1,row.length).setValues([row]);
    const sc=sheet.getRange(nr,headers.indexOf('Eligibility Status')+1);
    const st=data.eligibilityStatus||'';
    if(st==='ELIGIBLE')sc.setBackground(CONFIG.COLOR_CODES.ELIGIBLE);
    else if(st==='ELIGIBLE_WITH_CONDITIONS')sc.setBackground(CONFIG.COLOR_CODES.CONDITIONAL);
    else if(st==='INELIGIBLE')sc.setBackground(CONFIG.COLOR_CODES.INELIGIBLE);
    else sc.setBackground(CONFIG.COLOR_CODES.REVIEW);
    return ContentService.createTextOutput(JSON.stringify({result:'success'})).setMimeType(ContentService.MimeType.JSON);
  }catch(error){
    console.error(error);
    return ContentService.createTextOutput(JSON.stringify({result:'error',message:error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
function getOrCreate(ss,name){let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);return s;}
function setupHeaders(sheet,headers){
  sheet.getRange(1,1,1,headers.length).setValues([headers]);
  const r=sheet.getRange(1,1,1,headers.length);
  r.setBackground(CONFIG.COLOR_CODES.HEADER);r.setFontColor(CONFIG.COLOR_CODES.HEADER_TEXT);r.setFontWeight('bold');
  sheet.setFrozenRows(1);sheet.getRange(1,1,1,headers.length).createFilter();
}
function getHeaders(){
  return[
    'Timestamp',
    'Full Name','Email','WhatsApp',
    'Nationality','Home Country','Current Residency','Visa Status','QID Number',
    'Profession','Practice Scope','Target Sector',
    'Medical School','FAIMER Listed','Graduation Year','Program Duration',
    'Internship Completed','Internship Months','Internship Country',
    'Specialty Name','Qualification Category','Specific Qualification','Specialty Year',
    'Granted by Equivalency','Cat3 Structured Training','Cat3 Board Exam',
    'Trained in Qatar',
    'Has Fellowship','Fellowship Specialty','Fellowship Main Cat','Fellowship Sub Cat','Fellowship Duration',
    'Work Nature',
    'Experience Entries JSON',
    'Break in Practice','Break Duration','Break Reason',
    'GP Exam Exempt','GP Exempt Exam Name','Prometric Taken',
    'DataFlow Status','DataFlow Date','DataFlow Country',
    'Good Standing','Home License',
    'Healthcare Sector','Compensation Plan',
    'Salary Min QAR','Salary Max QAR','Daily Rate Min USD','Daily Rate Max USD',
    'Assistance','Additional Notes',
    'Eligibility Status','Eligibility Scope','Eligibility Exam',
    'Eligibility Supervision','Eligibility DataFlow','Eligibility Summary'
  ];
}
function formatRow(d){
  return[
    new Date(),
    d.fullName||'',d.email||'',d.phone||'',
    d.nationality||'',d.homeCountry||'',d.residencyCountry||'',d.visaStatus||'',d.qidNumber||'',
    d.profession||'',d.practiceScope||'',d.targetSector||'',
    d.medicalSchool||'',d.faimerListed||'',d.graduationYear||'',d.programDuration||'',
    d.internshipCompleted||'',d.internshipMonths||'',d.internshipCountry||'',
    d.specialtyName||'',d.qualCategory||'',d.specificQual||'',d.specialtyYear||'',
    d.grantedByEquivalency||'',d.cat3StructuredTraining||'',d.cat3BoardExam||'',
    d.trainedInQatar||'',
    d.hasFellowship||'',d.fellowshipSpecialty||'',d.fellowshipMainCat||'',d.fellowshipSubCat||'',d.fellowshipDuration||'',
    d.workNature||'',
    d.experienceEntriesJson||'',
    d.breakInPractice||'',d.breakDuration||'',d.breakReason||'',
    d.gpExamExempt||'',d.gpExamExemptName||'',d.prometricTaken||'',
    d.dataflowStatus||'',d.dataflowDate||'',d.lastDataflowCountry||'',
    d.goodStanding||'',d.homeLicense||'',
    d.healthcareSector||'',d.compensationPlan||'',
    d.salaryMin||'',d.salaryMax||'',d.dailyRateMin||'',d.dailyRateMax||'',
    d.assistance||'',d.additionalNotes||'',
    d.eligibilityStatus||'',d.eligibilityScope||'',d.eligibilityExam||'',
    d.eligibilitySupervision||'',d.eligibilityDataflow||'',d.eligibilitySummary||''
  ];
}
function doGet(e){return ContentService.createTextOutput('MedWindow v4.1 API running');}
