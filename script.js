document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('assessment-form');
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    const thankYouMessage = document.getElementById('thank-you-message');
    const closeThankYouBtn = document.getElementById('close-thank-you');

    // Initialize variables
    let currentStep = 0;
    const totalSteps = steps.length;

    // Google Sheets Web App URL - Replace with your deployed script URL
    const GOOGLE_SHEETS_URL = `AKfycbwbm_UMBVs7eAMCU64bK1FBQLv3unp9o3W9uQwmFVh4LMGS3dM8N98nF1vnw_5sEsPb/exec`

    // Specialty qualifications database by country
    const specialtyQualifications = {
        usa: [
            "American Board of Internal Medicine",
            "American Board of Surgery",
            "American Board of Pediatrics",
            "American Board of Obstetrics and Gynecology",
            "American Board of Dermatology",
            "American Board of Psychiatry and Neurology",
            "American Board of Radiology",
            "American Board of Anesthesiology",
            "American Board of Ophthalmology",
            "American Board of Otolaryngology",
            "American Board of Orthopedic Surgery",
            "American Board of Plastic Surgery",
            "American Board of Urology",
            "American Board of Emergency Medicine"
        ],
        uk: [
            "MRCP (UK) - Royal College of Physicians",
            "MRCS - Royal College of Surgeons",
            "MRCPCH - Royal College of Paediatrics and Child Health",
            "MRCOG - Royal College of Obstetricians and Gynaecologists",
            "MRCP (UK) Dermatology",
            "MRCPsych - Royal College of Psychiatrists",
            "FRCR - Royal College of Radiologists",
            "FRCA - Royal College of Anaesthetists",
            "FRCOphth - Royal College of Ophthalmologists",
            "FRCS (ORL-HNS) - Royal College of Surgeons",
            "FRCS (Tr & Orth) - Royal College of Surgeons",
            "FRCS (Plast) - Royal College of Surgeons",
            "FRCS (Urol) - Royal College of Surgeons",
            "FRCEM - Royal College of Emergency Medicine",
            "CCT/CCST in relevant specialty"
        ],
        canada: [
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Internal Medicine)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Surgery)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Pediatrics)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Obstetrics and Gynecology)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Dermatology)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Psychiatry)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Radiology)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Anesthesiology)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Ophthalmology)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Otolaryngology)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Orthopedic Surgery)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Plastic Surgery)",
            "FRCSC - Royal College of Physicians and Surgeons of Canada (Urology)",
            "FRCPC - Royal College of Physicians and Surgeons of Canada (Emergency Medicine)",
            "CCFP - College of Family Physicians of Canada"
        ],
        australia: [
            "FRACP - Royal Australasian College of Physicians",
            "FRACS - Royal Australasian College of Surgeons",
            "FRACP - Royal Australasian College of Physicians (Paediatrics)",
            "FRANZCOG - Royal Australian and New Zealand College of Obstetricians and Gynaecologists",
            "FACD - Australasian College of Dermatologists",
            "FRANZCP - Royal Australian and New Zealand College of Psychiatrists",
            "FRANZCR - Royal Australian and New Zealand College of Radiologists",
            "FANZCA - Australian and New Zealand College of Anaesthetists",
            "RANZCO - Royal Australian and New Zealand College of Ophthalmologists",
            "FRACS (ORL-HNS) - Royal Australasian College of Surgeons",
            "FRACS (Orthopaedic Surgery) - Royal Australasian College of Surgeons",
            "FRACS (Plastic and Reconstructive) - Royal Australasian College of Surgeons",
            "FRACS (Urology) - Royal Australasian College of Surgeons",
            "FACEM - Australasian College for Emergency Medicine"
        ],
        india: [
            "MD (Internal Medicine) - Medical Council of India",
            "MS (Surgery) - Medical Council of India",
            "MD (Pediatrics) - Medical Council of India",
            "MS/MD (Obstetrics and Gynecology) - Medical Council of India",
            "MD (Dermatology) - Medical Council of India",
            "MD (Psychiatry) - Medical Council of India",
            "MD (Radiology) - Medical Council of India",
            "MD (Anesthesiology) - Medical Council of India",
            "MS (Ophthalmology) - Medical Council of India",
            "MS (Otorhinolaryngology) - Medical Council of India",
            "MS (Orthopedics) - Medical Council of India",
            "MCh (Plastic Surgery) - Medical Council of India",
            "MCh (Urology) - Medical Council of India",
            "MD (Emergency Medicine) - Medical Council of India",
            "DNB in relevant specialty - National Board of Examinations"
        ],
        egypt: [
            "MD (Internal Medicine) - Egyptian Fellowship Board",
            "MD (Surgery) - Egyptian Fellowship Board",
            "MD (Pediatrics) - Egyptian Fellowship Board",
            "MD (Obstetrics and Gynecology) - Egyptian Fellowship Board",
            "MD (Dermatology) - Egyptian Fellowship Board",
            "MD (Psychiatry) - Egyptian Fellowship Board",
            "MD (Radiology) - Egyptian Fellowship Board",
            "MD (Anesthesiology) - Egyptian Fellowship Board",
            "MD (Ophthalmology) - Egyptian Fellowship Board",
            "MD (Otorhinolaryngology) - Egyptian Fellowship Board",
            "MD (Orthopedics) - Egyptian Fellowship Board",
            "MD (Plastic Surgery) - Egyptian Fellowship Board",
            "MD (Urology) - Egyptian Fellowship Board",
            "MD (Emergency Medicine) - Egyptian Fellowship Board",
            "Egyptian Board in relevant specialty"
        ],
        other: [
            "Arab Board Certification in relevant specialty",
            "Other internationally recognized specialty qualification"
        ]
    };

    // Update progress indicators
    function updateProgress() {
        const percent = Math.round((currentStep / (totalSteps - 1)) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `STEP ${currentStep + 1} OF ${totalSteps}`;
        progressPercentage.textContent = `${percent}%`;
    }

    // Show the current step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index !== stepIndex);
        });

        // Update buttons
        prevBtn.classList.toggle('hidden', stepIndex === 0);
        nextBtn.classList.toggle('hidden', stepIndex === totalSteps - 1);
        submitBtn.classList.toggle('hidden', stepIndex !== totalSteps - 1);

        // Update progress
        currentStep = stepIndex;
        updateProgress();
    }

    // Validate the current step
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                // For radio buttons, check if any in the group is checked
                const name = field.name;
                const checked = currentStepElement.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    // Find the label for this radio group
                    const label = currentStepElement.querySelector(`label[for="${name}"]`) || 
                                 currentStepElement.querySelector(`label:has(input[name="${name}"])`);
                    if (label) {
                        label.classList.add('text-red-600');
                    }
                }
            } else if (field.type === 'checkbox' && field.name === 'consent') {
                // Special handling for consent checkbox
                if (!field.checked) {
                    isValid = false;
                    field.parentElement.classList.add('text-red-600');
                }
            } else {
                // For other input types
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                }
            }
        });
        
        return isValid;
    }

    // Clear validation errors
    function clearValidationErrors() {
        document.querySelectorAll('.text-red-600').forEach(el => {
            el.classList.remove('text-red-600');
        });
        
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });
    }

    // Handle next button click
    nextBtn.addEventListener('click', function() {
        clearValidationErrors();
        
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                showStep(currentStep + 1);
            }
        } else {
            alert('Please fill in all required fields before proceeding.');
        }
    });

    // Handle previous button click
    prevBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearValidationErrors();
        
        if (validateStep(currentStep)) {
            // Disable submit button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
            
            // Collect form data
            const formData = new FormData(form);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                // Handle checkboxes (multiple values)
                if (formDataObj[key]) {
                    if (!Array.isArray(formDataObj[key])) {
                        formDataObj[key] = [formDataObj[key]];
                    }
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = value;
                }
            });
            
            // Perform eligibility assessment
            const eligibilityResult = assessEligibility(formDataObj);
            formDataObj.eligibilityResult = eligibilityResult;
            
            // Send data to Google Sheets
            fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                body: JSON.stringify(formDataObj)
            })
            .then(response => {
                console.log('Form submitted successfully');
                form.classList.add('hidden');
                thankYouMessage.classList.remove('hidden');
                
                // Reset form for future submissions
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Assessment <i class="fas fa-check ml-2"></i>';
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your assessment. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Assessment <i class="fas fa-check ml-2"></i>';
            });
        } else {
            alert('Please fill in all required fields before submitting.');
        }
    });

    // Handle close thank you button
    if (closeThankYouBtn) {
        closeThankYouBtn.addEventListener('click', function() {
            thankYouMessage.classList.add('hidden');
            showStep(0);
            form.classList.remove('hidden');
        });
    }

    // Perform eligibility assessment based on form data
    function assessEligibility(data) {
        try {
            // Check for specialist eligibility
            if (data.hasSpecialty === 'yes' && 
                parseFloat(data.totalExperience) >= 5 && 
                data.validLicense === 'yes') {
                
                // Check for break in practice
                if (data.currentlyPracticing === 'no' && parseFloat(data.breakDuration) > 2) {
                    return "Potentially Eligible with Conditions: Specialist license possible after supervised practice due to break in practice";
                }
                
                return "Eligible for Specialist License";
            }
            
            // Check for general practitioner eligibility
            if (data.internshipCompleted === 'yes' && 
                parseFloat(data.totalExperience) >= 2 && 
                data.validLicense === 'yes') {
                
                // Check for break in practice
                if (data.currentlyPracticing === 'no' && parseFloat(data.breakDuration) > 2) {
                    return "Potentially Eligible with Conditions: General Practitioner license possible after supervised practice due to break in practice";
                }
                
                return "Eligible for General Practitioner License";
            }
            
            // Check for potential eligibility with conditions
            if (data.internshipCompleted === 'yes' && parseFloat(data.totalExperience) >= 1) {
                return "Potentially Eligible with Conditions: May require qualifying examination and additional documentation";
            }
            
            // Check for ineligibility
            if (data.internshipCompleted === 'no' || parseFloat(data.totalExperience) < 1) {
                return "Not Eligible: Does not meet minimum requirements for licensing in Qatar";
            }
            
            // Default case
            return "Needs Further Information: Please contact MedWindow for detailed assessment";
            
        } catch (error) {
            console.error('Error in eligibility assessment:', error);
            return "Assessment Error: Unable to determine eligibility";
        }
    }

    // Handle conditional fields
    
    // Family sponsorship details
    const visaStatus = document.getElementById('visaStatus');
    const familySponsorshipDetails = document.getElementById('familySponsorshipDetails');
    
    if (visaStatus && familySponsorshipDetails) {
        visaStatus.addEventListener('change', function() {
            familySponsorshipDetails.classList.toggle('hidden', this.value !== 'family');
        });
    }
    
    // Internship details
    const internshipRadios = document.querySelectorAll('input[name="internshipCompleted"]');
    const internshipDetails = document.getElementById('internshipDetails');
    
    if (internshipRadios.length && internshipDetails) {
        internshipRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                internshipDetails.classList.toggle('hidden', this.value !== 'yes');
            });
        });
    }
    
    // Specialty details
    const specialtyRadios = document.querySelectorAll('input[name="hasSpecialty"]');
    const specialtyDetails = document.getElementById('specialtyDetails');
    
    if (specialtyRadios.length && specialtyDetails) {
        specialtyRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                specialtyDetails.classList.toggle('hidden', this.value !== 'yes');
            });
        });
    }
    
    // Break in practice details
    const practicingRadios = document.querySelectorAll('input[name="currentlyPracticing"]');
    const breakInPracticeDetails = document.getElementById('breakInPracticeDetails');
    
    if (practicingRadios.length && breakInPracticeDetails) {
        practicingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                breakInPracticeDetails.classList.toggle('hidden', this.value !== 'no');
            });
        });
    }
    
    // GCC experience details
    const gccExperienceRadios = document.querySelectorAll('input[name="gccExperience"]');
    const gccExperienceDetails = document.getElementById('gccExperienceDetails');
    
    if (gccExperienceRadios.length && gccExperienceDetails) {
        gccExperienceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                gccExperienceDetails.classList.toggle('hidden', this.value !== 'yes');
            });
        });
    }
    
    // Dataflow details
    const dataflowRadios = document.querySelectorAll('input[name="dataflowReport"]');
    const dataflowDetails = document.getElementById('dataflowDetails');
    
    if (dataflowRadios.length && dataflowDetails) {
        dataflowRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                dataflowDetails.classList.toggle('hidden', this.value !== 'yes');
            });
        });
    }
    
    // Populate specialty qualifications based on country
    const specialtyCountry = document.getElementById('specialtyCountry');
    const specialtyQualificationSelect = document.getElementById('specialtyQualification');
    
    if (specialtyCountry && specialtyQualificationSelect) {
        specialtyCountry.addEventListener('change', function() {
            const country = this.value;
            
            // Clear existing options
            specialtyQualificationSelect.innerHTML = '<option value="">Select Qualification</option>';
            
            // Add new options based on selected country
            if (country && specialtyQualifications[country]) {
                specialtyQualifications[country].forEach(qualification => {
                    const option = document.createElement('option');
                    option.value = qualification;
                    option.textContent = qualification;
                    specialtyQualificationSelect.appendChild(option);
                });
            } else if (country) {
                // If country not in our database, use "other" options
                specialtyQualifications.other.forEach(qualification => {
                    const option = document.createElement('option');
                    option.value = qualification;
                    option.textContent = qualification;
                    specialtyQualificationSelect.appendChild(option);
                });
            }
        });
    }

    // Initialize the form
    showStep(0);
});
