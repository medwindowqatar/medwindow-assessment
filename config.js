// MedWindow Qatar - Configuration
// © 2025 MedWindow Qatar

const CONFIG = {
    // Google Apps Script Web App URL for form submissions
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec',
    
    // Contact Information
    CONTACT: {
        whatsapp: '+97474749336',
        whatsappLink: 'https://wa.me/97474749336',
        email: 'medwindowqatar@gmail.com',
        website: 'https://medwindowqatar.github.io/medwindow-assessment/'
    },
    
    // Form Configuration
    FORM: {
        totalSteps: 12, // Updated to include all new steps
        enableValidation: true,
        enableAutosave: false
    },
    
    // Assessment Rules
    ASSESSMENT: {
        breakInPracticeThresholdMonths: 12,
        minimumInternshipMonths: 12,
        
        categoryRequirements: {
            category1: {
                physicians: {
                    postSpecialtyYears: 1,
                    examRequired: false
                },
                dentists: {
                    postSpecialtyYears: 1,
                    examRequired: false
                }
            },
            category2: {
                physicians: {
                    postSpecialtyYears: 2,
                    examRequired: false
                },
                dentists: {
                    postSpecialtyYears: 2,
                    examRequired: false
                }
            },
            category3: {
                physicians: {
                    structuredTrainingYears: 3,
                    postSpecialtyYears: 3,
                    examRequired: true,
                    examType: 'DHP Qualifying Exam'
                },
                dentists: {
                    structuredTrainingYears: 3,
                    postSpecialtyYears: 3,
                    examRequired: true,
                    examType: 'DHP Qualifying Exam'
                }
            }
        },
        
        aestheticMedicine: {
            minimumExperienceYears: 3,
            nonResidentTotalYears: 5,
            acceptableBaseSpecialties: ['Dermatology', 'Plastic & Reconstructive Surgery', 'General Practitioner'],
            trainingRequired: true
        }
    },
    
    // DataFlow validity period (in months)
    DATAFLOW_VALIDITY_MONTHS: 24,
    
    // Good Standing Certificate validity (in months)
    GSC_VALIDITY_MONTHS: 6,
    
    // Feature Flags
    FEATURES: {
        showEligibilityToUser: false, // IMPORTANT: Results hidden from user
        exportToGoogleSheets: true,
        enableMultipleExperiences: true,
        enableBreakExceptions: true,
        enableAestheticMedicine: true
    }
};

