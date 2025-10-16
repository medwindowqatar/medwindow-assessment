// MedWindow Qatar - Physician & Dentist Licensing Eligibility Assessment Tool
// Version 2.0 - Final Optimized with MOPH/DHP Compliance
// © 2025 MedWindow Qatar

// ============================================================================
// GLOBAL STATE
// ============================================================================

let QUALIFICATIONS = {};
let SPECIALTIES = {};
let ALIASES = {};
let STATIC_DATA = {};
let DENTAL_EXAMS = {};

let currentStep = 1;
const totalSteps = 9;
let formData = {};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data files
        await loadDataFiles();
        
        // Initialize form
        initializeForm();
        
        // Setup event listeners
        setupEventListeners();
        
        // Show first step
        showStep(1);
        
        console.log('MedWindow Qatar Assessment Tool initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error loading assessment tool. Please refresh the page or contact support.');
    }
});

async function loadDataFiles() {
    try {
        const [quals, specs, aliases, staticData, dentalExams] = await Promise.all([
            fetch('qualifications_index.json').then(r => r.json()),
            fetch('specialties_map.json').then(r => r.json()),
            fetch('specialty_aliases.json').then(r => r.json()),
            fetch('static_lists.json').then(r => r.json()),
            fetch('dentist_exam_rules.json').then(r => r.json())
        ]);
        
        QUALIFICATIONS = quals;
        SPECIALTIES = specs;
        ALIASES = aliases;
        STATIC_DATA = staticData;
        DENTAL_EXAMS = dentalExams;
        
        console.log('All data files loaded successfully');
    } catch (error) {
        console.error('Error loading data files:', error);
        throw error;
    }
}

function initializeForm() {
    // Initialize any dynamic content
    updateProgress();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Navigation buttons
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (nextBtn) nextBtn.addEventListener('click', handleNext);
    if (prevBtn) prevBtn.addEventListener('click', handlePrevious);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    
    // Profession change
    const profession = document.getElementById('profession');
    if (profession) {
        profession.addEventListener('change', handleProfessionChange);
    }
    
    // Visa status change
    const visaStatus = document.querySelectorAll('input[name="visaStatus"]');
    visaStatus.forEach(radio => {
        radio.addEventListener('change', handleVisaStatusChange);
    });
}

// ============================================================================
// NAVIGATION
// ============================================================================

function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.add('hidden');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
    }
    
    // Update buttons
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (prevBtn) {
        prevBtn.classList.toggle('hidden', stepNumber === 1);
    }
    
    if (nextBtn && submitBtn) {
        if (stepNumber === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }
    
    currentStep = stepNumber;
    updateProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleNext() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        // Load dynamic steps if needed
        if (currentStep === 1) {
            loadDynamicSteps();
        }
        
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    } else {
        alert('Please fill in all required fields before proceeding.');
    }
}

function handlePrevious() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function updateProgress() {
    const percent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percent}%`;
    }
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous validation errors
    clearValidationErrors();
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const name = field.name;
            const checked = currentStepElement.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                isValid = false;
                highlightError(field);
            }
        } else if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                highlightError(field);
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                highlightError(field);
            }
        }
    });
    
    return isValid;
}

function clearValidationErrors() {
    document.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
    });
}

function highlightError(field) {
    field.classList.add('border-red-500');
}

function saveCurrentStepData() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) return;
    
    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

// ============================================================================
// DYNAMIC CONTENT
// ============================================================================

function handleProfessionChange() {
    const profession = document.getElementById('profession').value;
    formData.profession = profession;
    
    // Will load appropriate steps when user clicks Next
}

function loadDynamicSteps() {
    const profession = formData.profession;
    const dynamicStepsContainer = document.getElementById('dynamic-steps');
    
    if (!dynamicStepsContainer) return;
    
    // Clear existing dynamic steps
    dynamicStepsContainer.innerHTML = '';
    
    if (profession === 'Physician') {
        dynamicStepsContainer.innerHTML = getPhysicianSteps();
    } else if (profession === 'Dentist') {
        dynamicStepsContainer.innerHTML = getDentistSteps();
    }
    
    // Re-attach event listeners for dynamic content
    attachDynamicEventListeners();
}

function getPhysicianSteps() {
    return `
        <!-- Step 3: Medical Qualification -->
        <div class="step hidden" data-step="3">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-graduation-cap text-blue-600 mr-2"></i>
                Medical Qualification
            </h3>
            <div class="space-y-6">
                <div>
                    <label for="medicalSchool" class="block text-sm font-medium text-gray-700 mb-2">
                        Medical School <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="medicalSchool" name="medicalSchool" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Cairo University Faculty of Medicine">
                </div>
                <div>
                    <label for="graduationYear" class="block text-sm font-medium text-gray-700 mb-2">
                        Year of Graduation <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="graduationYear" name="graduationYear" required min="1950" max="2025"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2015">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Did you complete internship? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="internshipCompleted" value="yes" required class="mr-3">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="internshipCompleted" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 4: Specialty Qualification -->
        <div class="step hidden" data-step="4">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-stethoscope text-blue-600 mr-2"></i>
                Specialty Qualification
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a specialty qualification? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasSpecialty" value="yes" required class="mr-3" onchange="toggleSpecialtyDetails(true)">
                            <span>Yes - I am a specialist</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasSpecialty" value="no" class="mr-3" onchange="toggleSpecialtyDetails(false)">
                            <span>No - I am a General Practitioner</span>
                        </label>
                    </div>
                </div>

                <div id="specialtyDetails" class="hidden space-y-6">
                    <div>
                        <label for="specialtyName" class="block text-sm font-medium text-gray-700 mb-2">
                            Specialty Name <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="specialtyName" name="specialtyName"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Internal Medicine, Cardiology, ENT">
                        <p class="text-xs text-gray-500 mt-1">You can use abbreviations (e.g., ENT, OB/GYN)</p>
                    </div>

                    <div>
                        <label for="specialtyQualification" class="block text-sm font-medium text-gray-700 mb-2">
                            Specialty Qualification/Certificate <span class="text-red-500">*</span>
                        </label>
                        <select id="specialtyQualification" name="specialtyQualification"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onchange="handleSpecialtyQualificationChange()">
                            <option value="">Select qualification...</option>
                            <optgroup label="Category 1 (1 year experience, no exam)">
                                <option value="cat1:CCT (UK)">CCT (UK)</option>
                                <option value="cat1:ABMS Board Certification (USA)">ABMS Board Certification (USA)</option>
                                <option value="cat1:MRCP (UK)">MRCP (UK)</option>
                                <option value="cat1:FRCA (UK)">FRCA (UK)</option>
                                <option value="cat1:FRCR (UK)">FRCR (UK)</option>
                                <option value="cat1:FRCSC (Canada)">FRCSC (Canada)</option>
                            </optgroup>
                            <optgroup label="Category 2 (2 years experience, no exam)">
                                <option value="cat2:Arab Board">Arab Board of Health Specializations</option>
                                <option value="cat2:DM (India)">DM (India)</option>
                                <option value="cat2:MCh (India)">MCh (India)</option>
                                <option value="cat2:DNB (India)">DNB (India)</option>
                                <option value="cat2:FCPS (Pakistan)">FCPS (Pakistan)</option>
                                <option value="cat2:Jordanian Board">Jordanian Board</option>
                            </optgroup>
                            <option value="cat3:other">Other (Category 3 - requires 3 years training + 3 years experience + DHP exam)</option>
                        </select>
                    </div>

                    <div id="otherQualificationDiv" class="hidden">
                        <label for="otherQualification" class="block text-sm font-medium text-gray-700 mb-2">
                            Please specify your qualification <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="otherQualification" name="otherQualification"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Master's degree in Internal Medicine (Egypt)">
                    </div>

                    <div id="qualifyingExamDiv" class="hidden">
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            Have you passed the DHP qualifying examination? <span class="text-red-500">*</span>
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                                <input type="radio" name="qualifyingExam" value="yes" class="mr-3">
                                <span>Yes</span>
                            </label>
                            <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                                <input type="radio" name="qualifyingExam" value="no" class="mr-3">
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="specialtyYear" class="block text-sm font-medium text-gray-700 mb-2">
                            Year Specialty Qualification Obtained <span class="text-red-500">*</span>
                        </label>
                        <input type="number" id="specialtyYear" name="specialtyYear" min="1950" max="2025"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 2018">
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 5: Work Experience -->
        <div class="step hidden" data-step="5">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-briefcase text-blue-600 mr-2"></i>
                Work Experience
            </h3>
            <div class="space-y-6">
                <div>
                    <label for="totalExperience" class="block text-sm font-medium text-gray-700 mb-2">
                        Total Years of Clinical Experience (after internship) <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="totalExperience" name="totalExperience" required min="0" max="50" step="0.5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5.5">
                </div>

                <div id="postSpecialtyExperienceDiv" class="hidden">
                    <label for="postSpecialtyExperience" class="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience AFTER Obtaining Specialty Qualification <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="postSpecialtyExperience" name="postSpecialtyExperience" min="0" max="50" step="0.5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 3">
                    <p class="text-xs text-gray-500 mt-1">This is critical for eligibility assessment</p>
                </div>

                <div>
                    <label for="experienceType" class="block text-sm font-medium text-gray-700 mb-2">
                        Type of Clinical Experience <span class="text-red-500">*</span>
                    </label>
                    <select id="experienceType" name="experienceType" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select experience type...</option>
                        <option value="Government/semi-government hospital">Government or semi-government hospital</option>
                        <option value="Teaching hospital with post-graduate programs">Teaching hospital with post-graduate programs</option>
                        <option value="Mix of government and private">Mix of government/teaching and private practice</option>
                        <option value="Private practice only">Private practice only</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Note: MOPH requires experience from government/semi-government or teaching hospitals</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Have you had any break in practice (≥1 year)? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="breakInPractice" value="yes" required class="mr-3" onchange="toggleBreakDetails(true)">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="breakInPractice" value="no" class="mr-3" onchange="toggleBreakDetails(false)">
                            <span>No</span>
                        </label>
                    </div>
                </div>

                <div id="breakDetailsDiv" class="hidden">
                    <label for="breakDuration" class="block text-sm font-medium text-gray-700 mb-2">
                        Duration of Break (in years) <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="breakDuration" name="breakDuration" min="0" max="20" step="0.5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2">
                </div>
            </div>
        </div>

        <!-- Step 6: Documentation -->
        <div class="step hidden" data-step="6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-file-alt text-blue-600 mr-2"></i>
                Required Documentation
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a Dataflow verification report? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasDataflow" value="yes" required class="mr-3">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasDataflow" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mr-1"></i>
                        Dataflow is MANDATORY - applications will be rejected without it
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a valid medical license from your country of practice? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="validLicense" value="yes" required class="mr-3">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="validLicense" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a Good Standing Certificate (less than 6 months old)? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="goodStanding" value="yes" required class="mr-3">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="goodStanding" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 7: Work Preferences -->
        <div class="step hidden" data-step="7">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-clipboard-list text-blue-600 mr-2"></i>
                Work Preferences
            </h3>
            <div class="space-y-6">
                <div>
                    <label for="desiredWorkNature" class="block text-sm font-medium text-gray-700 mb-2">
                        Desired Work Nature <span class="text-red-500">*</span>
                    </label>
                    <select id="desiredWorkNature" name="desiredWorkNature" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select work nature...</option>
                        <option value="Resident full-time">Resident full-time</option>
                        <option value="Resident part-time">Resident part-time</option>
                        <option value="Visiting specialist">Visiting specialist</option>
                        <option value="Non-resident (monthly visits)">Non-resident (monthly visits)</option>
                    </select>
                </div>

                <div>
                    <label for="compensationPlan" class="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Compensation Plan <span class="text-red-500">*</span>
                    </label>
                    <select id="compensationPlan" name="compensationPlan" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onchange="toggleSalaryField()">
                        <option value="">Select compensation plan...</option>
                        <option value="Fixed Salary">Fixed Salary</option>
                        <option value="Profit Share">Profit Share</option>
                        <option value="Hybrid (Fixed + Profit Share)">Hybrid (Fixed + Profit Share)</option>
                    </select>
                </div>

                <div id="expectedSalaryDiv" class="hidden">
                    <label for="expectedSalary" class="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Salary (QAR) <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="expectedSalary" name="expectedSalary" min="0" step="1000"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 25000">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Healthcare Sector
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="sector" value="Private healthcare" class="mr-3">
                            <span>Private healthcare</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="sector" value="Government healthcare" class="mr-3">
                            <span>Government healthcare</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="sector" value="Academic/Teaching" class="mr-3">
                            <span>Academic/Teaching</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 8: Assistance Needed -->
        <div class="step hidden" data-step="8">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-hands-helping text-blue-600 mr-2"></i>
                Assistance Needed
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        What assistance do you need from MedWindow Qatar?
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="assistance" value="QCHP Licensing Process" class="mr-3">
                            <span>QCHP Licensing Process</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="assistance" value="Dataflow Verification" class="mr-3">
                            <span>Dataflow Verification</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="assistance" value="Finding Job Offers" class="mr-3">
                            <span>Finding Job Offers</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="assistance" value="Document Preparation" class="mr-3">
                            <span>Document Preparation</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" name="assistance" value="Exam Preparation" class="mr-3">
                            <span>Qualifying Exam Preparation</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label for="additionalNotes" class="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes or Questions
                    </label>
                    <textarea id="additionalNotes" name="additionalNotes" rows="4"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional information you'd like to share..."></textarea>
                </div>
            </div>
        </div>

        <!-- Step 9: Consent -->
        <div class="step hidden" data-step="9">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-check-circle text-blue-600 mr-2"></i>
                Consent & Confirmation
            </h3>
            <div class="space-y-6">
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        By submitting this assessment, you agree to be contacted by MedWindow Qatar via WhatsApp, 
                        email, or phone regarding your licensing eligibility and our services.
                    </p>
                </div>

                <div class="space-y-4">
                    <label class="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" name="consent" value="yes" required class="mr-3 mt-1">
                        <span class="text-sm">
                            I confirm that all information provided is accurate and complete to the best of my knowledge. 
                            I understand that this is a preliminary assessment and final eligibility is subject to 
                            Qatar DHP review. <span class="text-red-500">*</span>
                        </span>
                    </label>

                    <label class="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" name="whatsappConsent" value="yes" required class="mr-3 mt-1">
                        <span class="text-sm">
                            I consent to receive assessment results and follow-up communications via WhatsApp at 
                            the mobile number provided. <span class="text-red-500">*</span>
                        </span>
                    </label>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <strong>Important:</strong> Please ensure your WhatsApp number is correct as we will send 
                        your detailed assessment results there.
                    </p>
                </div>
            </div>
        </div>
    `;
}

function getDentistSteps() {
    return `
        <!-- Similar structure to physician steps but tailored for dentists -->
        <!-- Implementation would follow the same pattern with dentist-specific fields -->
        <div class="step hidden" data-step="3">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-tooth text-blue-600 mr-2"></i>
                Dental Qualification
            </h3>
            <p class="text-gray-600">Dentist-specific qualification fields...</p>
        </div>
        <!-- Additional dentist steps would go here -->
    `;
}

function attachDynamicEventListeners() {
    // Re-attach listeners for dynamically loaded content
    const hasSpecialtyRadios = document.querySelectorAll('input[name="hasSpecialty"]');
    hasSpecialtyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSpecialtyDetails(this.value === 'yes');
        });
    });
    
    const breakRadios = document.querySelectorAll('input[name="breakInPractice"]');
    breakRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleBreakDetails(this.value === 'yes');
        });
    });
    
    const compPlan = document.getElementById('compensationPlan');
    if (compPlan) {
        compPlan.addEventListener('change', toggleSalaryField);
    }
    
    const specialtyQual = document.getElementById('specialtyQualification');
    if (specialtyQual) {
        specialtyQual.addEventListener('change', handleSpecialtyQualificationChange);
    }
}

// ============================================================================
// DYNAMIC FIELD TOGGLES
// ============================================================================

function handleVisaStatusChange() {
    const visaStatus = document.querySelector('input[name="visaStatus"]:checked');
    const familyDetails = document.getElementById('familySponsorshipDetails');
    
    if (familyDetails) {
        if (visaStatus && visaStatus.value === 'family') {
            familyDetails.classList.remove('hidden');
        } else {
            familyDetails.classList.add('hidden');
        }
    }
}

function toggleSpecialtyDetails(show) {
    const specialtyDetails = document.getElementById('specialtyDetails');
    const postSpecialtyDiv = document.getElementById('postSpecialtyExperienceDiv');
    
    if (specialtyDetails) {
        if (show) {
            specialtyDetails.classList.remove('hidden');
            if (postSpecialtyDiv) postSpecialtyDiv.classList.remove('hidden');
        } else {
            specialtyDetails.classList.add('hidden');
            if (postSpecialtyDiv) postSpecialtyDiv.classList.add('hidden');
        }
    }
}

function toggleBreakDetails(show) {
    const breakDetails = document.getElementById('breakDetailsDiv');
    if (breakDetails) {
        if (show) {
            breakDetails.classList.remove('hidden');
        } else {
            breakDetails.classList.add('hidden');
        }
    }
}

function toggleSalaryField() {
    const compPlan = document.getElementById('compensationPlan');
    const salaryDiv = document.getElementById('expectedSalaryDiv');
    
    if (compPlan && salaryDiv) {
        const value = compPlan.value;
        if (value === 'Fixed Salary' || value === 'Hybrid (Fixed + Profit Share)') {
            salaryDiv.classList.remove('hidden');
        } else {
            salaryDiv.classList.add('hidden');
        }
    }
}

function handleSpecialtyQualificationChange() {
    const qualSelect = document.getElementById('specialtyQualification');
    const otherQualDiv = document.getElementById('otherQualificationDiv');
    const qualExamDiv = document.getElementById('qualifyingExamDiv');
    
    if (!qualSelect) return;
    
    const value = qualSelect.value;
    
    if (value.startsWith('cat3:')) {
        if (otherQualDiv) otherQualDiv.classList.remove('hidden');
        if (qualExamDiv) qualExamDiv.classList.remove('hidden');
    } else {
        if (otherQualDiv) otherQualDiv.classList.add('hidden');
        if (qualExamDiv) qualExamDiv.classList.add('hidden');
    }
}

// ============================================================================
// ELIGIBILITY ASSESSMENT
// ============================================================================

function assessEligibility(data) {
    const result = {
        status: '',
        message: '',
        requirements: [],
        category: ''
    };
    
    // Determine qualification category
    const qualValue = data.specialtyQualification || '';
    let category = '';
    
    if (qualValue.startsWith('cat1:')) {
        category = 1;
    } else if (qualValue.startsWith('cat2:')) {
        category = 2;
    } else if (qualValue.startsWith('cat3:')) {
        category = 3;
    }
    
    result.category = category;
    
    // Check if applying as GP or Specialist
    const hasSpecialty = data.hasSpecialty === 'yes';
    
    if (!hasSpecialty) {
        return evaluateGPEligibility(data);
    } else {
        return evaluateSpecialistEligibility(data, category);
    }
}

function evaluateGPEligibility(data) {
    const result = {
        status: '',
        message: '',
        requirements: []
    };
    
    const internshipCompleted = data.internshipCompleted === 'yes';
    const yearsExperience = parseFloat(data.totalExperience) || 0;
    const hasBreak = data.breakInPractice === 'yes';
    const breakDuration = parseFloat(data.breakDuration) || 0;
    const hasDataflow = data.hasDataflow === 'yes';
    const hasValidLicense = data.validLicense === 'yes';
    const hasGoodStanding = data.goodStanding === 'yes';
    
    // CRITICAL CHECKS
    if (!internshipCompleted) {
        result.status = 'Not Eligible';
        result.message = 'Internship completion is mandatory for GP licensing in Qatar.';
        return result;
    }
    
    if (!hasDataflow) {
        result.status = 'Not Eligible';
        result.message = 'Dataflow verification is MANDATORY. Applications will be rejected without it.';
        result.requirements.push('Obtain Dataflow verification report');
        return result;
    }
    
    if (!hasValidLicense) {
        result.status = 'Not Eligible';
        result.message = 'A valid medical license from your country of practice is required.';
        return result;
    }
    
    if (!hasGoodStanding) {
        result.status = 'Not Eligible';
        result.message = 'A Good Standing Certificate (less than 6 months old) is MANDATORY.';
        return result;
    }
    
    // Check break in practice
    if (hasBreak && breakDuration >= 10) {
        result.status = 'Not Eligible';
        result.message = 'Break in practice of 10 years or more makes you ineligible.';
        return result;
    }
    
    if (hasBreak && breakDuration >= 1) {
        result.status = 'Potentially Eligible with Conditions';
        result.message = 'You may be eligible for GP licensing, but will require supervised practice period.';
        result.requirements.push(getSupervisedPracticePeriod(breakDuration));
        result.requirements.push('Pass DHP qualifying examination for GPs');
        return result;
    }
    
    // Check experience
    if (yearsExperience >= 2) {
        result.status = 'Eligible for General Practitioner License';
        result.message = 'You meet the basic requirements for GP licensing in Qatar.';
        result.requirements.push('Pass DHP qualifying examination for General Practitioners');
        result.requirements.push('Complete licensing application through DHP portal');
    } else {
        result.status = 'Potentially Eligible with Conditions';
        result.message = 'You need to reach 2 years total post-internship experience.';
        result.requirements.push(`Complete ${(2 - yearsExperience).toFixed(1)} more years of experience`);
    }
    
    return result;
}

function evaluateSpecialistEligibility(data, category) {
    const result = {
        status: '',
        message: '',
        requirements: [],
        category: category
    };
    
    const yearsPostSpecialty = parseFloat(data.postSpecialtyExperience) || 0;
    const hasBreak = data.breakInPractice === 'yes';
    const breakDuration = parseFloat(data.breakDuration) || 0;
    const hasDataflow = data.hasDataflow === 'yes';
    const hasValidLicense = data.validLicense === 'yes';
    const hasGoodStanding = data.goodStanding === 'yes';
    const passedQualifyingExam = data.qualifyingExam === 'yes';
    const experienceType = data.experienceType || '';
    
    // CRITICAL CHECKS
    if (!hasDataflow) {
        result.status = 'Not Eligible';
        result.message = 'Dataflow verification is MANDATORY. Applications will be rejected without it.';
        return result;
    }
    
    if (!hasValidLicense) {
        result.status = 'Not Eligible';
        result.message = 'A valid medical license is required.';
        return result;
    }
    
    if (!hasGoodStanding) {
        result.status = 'Not Eligible';
        result.message = 'A Good Standing Certificate (less than 6 months old) is MANDATORY.';
        return result;
    }
    
    if (experienceType === 'Private practice only') {
        result.status = 'Not Eligible';
        result.message = 'Private practice experience alone is NOT accepted. Experience must be from government/semi-government or teaching hospitals.';
        return result;
    }
    
    // Check break in practice
    if (hasBreak && breakDuration >= 10) {
        result.status = 'Not Eligible';
        result.message = 'Break in practice of 10 years or more makes you ineligible.';
        return result;
    }
    
    if (hasBreak && breakDuration >= 1) {
        result.status = 'Potentially Eligible with Conditions';
        result.message = 'You will require supervised practice period due to break in practice.';
        result.requirements.push(getSupervisedPracticePeriod(breakDuration));
        if (category === 3) {
            result.requirements.push('Pass DHP qualifying examination');
        }
        return result;
    }
    
    // Category-specific evaluation
    if (category === 1) {
        if (yearsPostSpecialty >= 1) {
            result.status = 'Eligible for Specialist License';
            result.message = 'You meet the requirements for specialist licensing (Category 1).';
            result.requirements.push('Complete licensing application through DHP portal');
        } else {
            result.status = 'Potentially Eligible with Conditions';
            result.message = 'You need additional POST-SPECIALTY experience.';
            result.requirements.push(`Complete ${(1 - yearsPostSpecialty).toFixed(1)} more years of POST-SPECIALTY experience`);
        }
    } else if (category === 2) {
        if (yearsPostSpecialty >= 2) {
            result.status = 'Eligible for Specialist License';
            result.message = 'You meet the requirements for specialist licensing (Category 2).';
            result.requirements.push('Complete licensing application through DHP portal');
        } else {
            result.status = 'Potentially Eligible with Conditions';
            result.message = 'You need additional POST-SPECIALTY experience.';
            result.requirements.push(`Complete ${(2 - yearsPostSpecialty).toFixed(1)} more years of POST-SPECIALTY experience`);
        }
    } else if (category === 3) {
        if (!passedQualifyingExam) {
            result.status = 'Potentially Eligible with Conditions';
            result.message = 'Category 3 qualifications REQUIRE passing the DHP qualifying examination.';
            result.requirements.push('Pass DHP qualifying examination (MANDATORY)');
            result.requirements.push('Complete 3 years of POST-SPECIALTY experience');
            return result;
        }
        
        if (yearsPostSpecialty >= 3) {
            result.status = 'Eligible for Specialist License';
            result.message = 'You meet the requirements for specialist licensing (Category 3 with exam passed).';
            result.requirements.push('Complete licensing application through DHP portal');
        } else {
            result.status = 'Potentially Eligible with Conditions';
            result.message = 'You need additional POST-SPECIALTY experience.';
            result.requirements.push(`Complete ${(3 - yearsPostSpecialty).toFixed(1)} more years of POST-SPECIALTY experience`);
        }
    } else {
        result.status = 'Needs Further Information';
        result.message = 'Unable to determine eligibility. Please contact MedWindow Qatar for personalized assessment.';
    }
    
    return result;
}

function getSupervisedPracticePeriod(breakYears) {
    if (breakYears >= 7 && breakYears < 10) {
        return 'Complete 2 years of supervised practice in Qatar';
    } else if (breakYears >= 5 && breakYears < 7) {
        return 'Complete 18 months of supervised practice in Qatar';
    } else if (breakYears >= 3 && breakYears < 5) {
        return 'Complete 1 year of supervised practice in Qatar';
    } else if (breakYears >= 1 && breakYears < 3) {
        return 'Complete 6 months of supervised practice in Qatar';
    }
    return 'Supervised practice period required';
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        alert('Please fill in all required fields before submitting.');
        return;
    }
    
    // Save final step data
    saveCurrentStepData();
    
    // Collect all checkbox values
    const assistanceCheckboxes = document.querySelectorAll('input[name="assistance"]:checked');
    formData.assistance = Array.from(assistanceCheckboxes).map(cb => cb.value).join(', ');
    
    const sectorCheckboxes = document.querySelectorAll('input[name="sector"]:checked');
    formData.sector = Array.from(sectorCheckboxes).map(cb => cb.value).join(', ');
    
    // Perform eligibility assessment
    const eligibilityResult = assessEligibility(formData);
    formData.eligibilityStatus = eligibilityResult.status;
    formData.eligibilityMessage = eligibilityResult.message;
    formData.eligibilityRequirements = eligibilityResult.requirements.join('; ');
    formData.qualificationCategory = eligibilityResult.category || 'N/A';
    formData.submissionDate = new Date().toISOString();
    
    // Disable submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    }
    
    // Submit to Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        console.log('Form submitted successfully');
        showThankYouMessage(eligibilityResult);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your assessment. Please try again or contact us at medwindowqatar@gmail.com');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Assessment <i class="fas fa-check ml-2"></i>';
        }
    });
}

function showThankYouMessage(eligibilityResult) {
    const assessmentContainer = document.getElementById('assessment-container');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    if (assessmentContainer && thankYouMessage) {
        assessmentContainer.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');
        
        // Populate result
        const resultContainer = document.getElementById('eligibility-result');
        if (resultContainer) {
            const statusColor = getStatusColor(eligibilityResult.status);
            
            resultContainer.innerHTML = `
                <div class="bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-6 mb-6">
                    <h3 class="text-xl font-semibold text-${statusColor}-800 mb-2">
                        ${eligibilityResult.status}
                    </h3>
                    <p class="text-${statusColor}-700 mb-4">
                        ${eligibilityResult.message}
                    </p>
                    ${eligibilityResult.requirements.length > 0 ? `
                        <div class="text-left">
                            <p class="font-semibold text-${statusColor}-800 mb-2">Next Steps:</p>
                            <ul class="list-disc list-inside space-y-1 text-${statusColor}-700">
                                ${eligibilityResult.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStatusColor(status) {
    if (status.includes('Eligible for')) {
        return 'green';
    } else if (status.includes('Potentially Eligible')) {
        return 'yellow';
    } else if (status.includes('Not Eligible')) {
        return 'red';
    } else {
        return 'blue';
    }
}

