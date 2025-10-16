// MedWindow Qatar - Physician & Dentist Licensing Eligibility Assessment Tool
// Version 3.0 - Complete Optimization
// © 2025 MedWindow Qatar

// ============================================================================
// GLOBAL STATE
// ============================================================================

let STATIC_DATA = {};
let QUALIFICATIONS = {};
let SPECIALTIES = {};
let ALIASES = {};
let DENTAL_EXAMS = {};
let AESTHETIC_RULES = {};
let BREAK_RULES = {};

let currentStep = 1;
const totalSteps = 12;
let formData = {
    experienceEntries: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadDataFiles();
        renderFormSteps();
        setupEventListeners();
        populateDynamicDropdowns();
        showStep(1);
        console.log('MedWindow Qatar Assessment Tool v3.0 initialized');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error loading assessment tool. Please refresh the page.');
    }
});

async function loadDataFiles() {
    try {
        const [staticData, quals, specs, aliases, dentalExams, aestheticRules, breakRules] = await Promise.all([
            fetch('static_lists.json').then(r => r.json()),
            fetch('qualifications_index.json').then(r => r.json()),
            fetch('specialties_map.json').then(r => r.json()),
            fetch('specialty_aliases.json').then(r => r.json()),
            fetch('dentist_exam_rules.json').then(r => r.json()),
            fetch('aesthetic_medicine_rules.json').then(r => r.json()),
            fetch('break_practice_rules.json').then(r => r.json())
        ]);
        
        STATIC_DATA = staticData;
        QUALIFICATIONS = quals;
        SPECIALTIES = specs;
        ALIASES = aliases;
        DENTAL_EXAMS = dentalExams;
        AESTHETIC_RULES = aestheticRules;
        BREAK_RULES = breakRules;
    } catch (error) {
        console.error('Error loading data files:', error);
        throw error;
    }
}

function populateDynamicDropdowns() {
    // Populate countries
    const countrySelects = document.querySelectorAll('#nationality, #homeCountry, #currentResidencyCountry');
    const countries = STATIC_DATA.countries || ['Qatar', 'Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain', 'Oman', 'Egypt', 'Jordan', 'Lebanon', 'Syria', 'Iraq', 'Palestine', 'Sudan', 'India', 'Pakistan', 'Bangladesh', 'Philippines', 'United Kingdom', 'United States', 'Canada', 'Australia'];
    
    countrySelects.forEach(select => {
        if (select) {
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                select.appendChild(option);
            });
        }
    });
}

// ============================================================================
// FORM STEP RENDERING
// ============================================================================

function renderFormSteps() {
    const container = document.getElementById('form-steps-container');
    if (!container) return;
    
    container.innerHTML = `
        ${renderStep1()}
        ${renderStep2()}
        ${renderStep3()}
        ${renderStep4()}
        ${renderStep5()}
        ${renderStep6()}
        ${renderStep7()}
        ${renderStep8()}
        ${renderStep9()}
        ${renderStep10()}
        ${renderStep11()}
        ${renderStep12()}
    `;
}

function renderStep1() {
    return `
        <div class="step" data-step="1">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-user text-blue-600 mr-2"></i>
                Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="fullName" name="fullName" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" id="email" name="email" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Mobile (WhatsApp) <span class="text-red-500">*</span>
                    </label>
                    <input type="tel" id="phone" name="phone" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Profession <span class="text-red-500">*</span>
                    </label>
                    <select id="profession" name="profession" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                        <option value="Physician">Physician</option>
                        <option value="Dentist">Dentist</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nationality <span class="text-red-500">*</span>
                    </label>
                    <select id="nationality" name="nationality" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Home Country <span class="text-red-500">*</span>
                    </label>
                    <select id="homeCountry" name="homeCountry" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Current Residency Country <span class="text-red-500">*</span>
                    </label>
                    <select id="currentResidencyCountry" name="currentResidencyCountry" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select...</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}

function renderStep2() {
    return `
        <div class="step hidden" data-step="2">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-passport text-blue-600 mr-2"></i>
                Visa Status in Qatar
            </h3>
            <div class="space-y-4">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="visaStatus" value="none" required class="mr-3">
                    <span>No current visa in Qatar</span>
                </label>
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="visaStatus" value="family" class="mr-3">
                    <span>Qatar resident on family sponsorship</span>
                </label>
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="visaStatus" value="work" class="mr-3">
                    <span>Qatar resident on work visa</span>
                </label>
            </div>
            <div id="qidContainer" class="hidden mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Qatar ID Number</label>
                <input type="text" id="qidNumber" name="qidNumber"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
        </div>
    `;
}

function renderStep3() {
    return `
        <div class="step hidden" data-step="3">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-graduation-cap text-blue-600 mr-2"></i>
                Education & Internship
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Medical/Dental School <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="medicalSchool" name="medicalSchool" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Year <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="graduationYear" name="graduationYear" required min="1950" max="2025"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Internship Duration (months) <span class="text-red-500">*</span>
                    </label>
                    <input type="number" id="internshipMonths" name="internshipMonths" required min="0" max="60"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <p class="text-xs text-gray-500 mt-1">Minimum 12 months required</p>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Internship Location</label>
                    <input type="text" id="internshipLocation" name="internshipLocation"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
            </div>
        </div>
    `;
}

function renderStep4() {
    return `
        <div class="step hidden" data-step="4">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-stethoscope text-blue-600 mr-2"></i>
                Specialty & Scope
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a specialty qualification? <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasSpecialty" value="yes" required class="mr-3">
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="hasSpecialty" value="no" class="mr-3">
                            <span>No (General Practitioner/General Dentist)</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Target Scope of Practice <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="targetScopeOfPractice" name="targetScopeOfPractice" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., Cardiology, General Dentist, Aesthetic Medicine">
                </div>
                <div id="specialtyDetailsContainer" class="hidden space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Specialty Qualification</label>
                        <input type="text" id="specialtyQualification" name="specialtyQualification"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Year Obtained</label>
                        <input type="number" id="specialtyYear" name="specialtyYear" min="1950" max="2025"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStep5() {
    return `
        <div class="step hidden" data-step="5">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-id-card text-blue-600 mr-2"></i>
                Medical Licenses
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <h4 class="font-semibold text-gray-700 mb-3">License in Home Country</h4>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="licenseHomeStatus" name="licenseHomeStatus"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="none">No License</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input type="text" id="licenseHomeNumber" name="licenseHomeNumber"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
                <div class="md:col-span-2 mt-4">
                    <h4 class="font-semibold text-gray-700 mb-3">License in Residency Country</h4>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="licenseResidencyStatus" name="licenseResidencyStatus"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="none">No License</option>
                        <option value="same">Same as Home Country</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input type="text" id="licenseResidencyNumber" name="licenseResidencyNumber"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
            </div>
        </div>
    `;
}

function renderStep6() {
    return `
        <div class="step hidden" data-step="6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-certificate text-blue-600 mr-2"></i>
                Good Standing Certificates
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Good Standing from Home Country
                    </label>
                    <select id="goodStandingHome" name="goodStandingHome"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        <option value="available">Available (within 6 months)</option>
                        <option value="can_provide">Can Provide</option>
                        <option value="cannot_provide">Cannot Provide</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Good Standing from Residency Country
                    </label>
                    <select id="goodStandingResidency" name="goodStandingResidency"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        <option value="available">Available (within 6 months)</option>
                        <option value="can_provide">Can Provide</option>
                        <option value="cannot_provide">Cannot Provide</option>
                        <option value="same">Same as Home Country</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}

function renderStep7() {
    return `
        <div class="step hidden" data-step="7">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-globe text-blue-600 mr-2"></i>
                DataFlow History
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Have you done DataFlow in any GCC country?
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="dataflowStatus" value="never" class="mr-3">
                            <span>Never</span>
                        </label>
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="dataflowStatus" value="transfer" class="mr-3">
                            <span>Yes (Transfer)</span>
                        </label>
                    </div>
                </div>
                <div id="dataflowDetailsContainer" class="hidden space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Which GCC Country?</label>
                        <select id="dataflowLastGCCCountry" name="dataflowLastGCCCountry"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Select...</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="UAE">UAE</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Oman">Oman</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date of Last DataFlow</label>
                        <input type="month" id="dataflowLastGCCDate" name="dataflowLastGCCDate"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStep8() {
    return `
        <div class="step hidden" data-step="8">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-briefcase text-blue-600 mr-2"></i>
                Professional Experience
            </h3>
            <div id="experienceEntriesContainer"></div>
            <button type="button" id="addExperienceBtn" 
                class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <i class="fas fa-plus mr-2"></i>Add Experience Entry
            </button>
        </div>
    `;
}

function renderStep9() {
    return `
        <div class="step hidden" data-step="9">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-calendar-times text-blue-600 mr-2"></i>
                Break in Practice
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Last Date of Clinical Practice
                    </label>
                    <input type="month" id="lastPracticeDate" name="lastPracticeDate"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Have you had a break in practice (>12 months)?
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="breakInPractice" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="breakInPractice" value="yes" class="mr-3">
                            <span>Yes</span>
                        </label>
                    </div>
                </div>
                <div id="breakDetailsContainer" class="hidden space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Break</label>
                        <select id="breakReasons" name="breakReasons"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Select...</option>
                            <option value="maternity">Maternity/Paternity Leave</option>
                            <option value="medical">Medical Leave</option>
                            <option value="education">Further Education</option>
                            <option value="research">Research/Academic</option>
                            <option value="covid">COVID-19 Related</option>
                            <option value="personal">Personal Reasons</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                        <textarea id="breakExplanation" name="breakExplanation" rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStep10() {
    return `
        <div class="step hidden" data-step="10">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-spa text-blue-600 mr-2"></i>
                Aesthetic Medicine (if applicable)
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Is this for Aesthetic Medicine scope?
                    </label>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="isAestheticMedicinePath" value="no" class="mr-3">
                            <span>No</span>
                        </label>
                        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="radio" name="isAestheticMedicinePath" value="yes" class="mr-3">
                            <span>Yes</span>
                        </label>
                    </div>
                </div>
                <div id="aestheticDetailsContainer" class="hidden space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Core Specialty</label>
                        <select id="aestheticCoreSpecialty" name="aestheticCoreSpecialty"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Select...</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Plastic Surgery">Plastic & Reconstructive Surgery</option>
                            <option value="GP">General Practitioner (with training)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Aesthetic Training Courses Completed
                        </label>
                        <textarea id="aestheticCoursesCompleted" name="aestheticCoursesCompleted" rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="List courses in injectables, laser, etc."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Years of Aesthetic Practice
                        </label>
                        <input type="number" id="aestheticExperienceYears" name="aestheticExperienceYears" min="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStep11() {
    return `
        <div class="step hidden" data-step="11">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-money-bill-wave text-blue-600 mr-2"></i>
                Salary Expectations
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select id="employmentType" name="employmentType"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select...</option>
                        <option value="fixed">Fixed Salary (Qatar-based)</option>
                        <option value="visiting">Visiting Physician</option>
                        <option value="partnership">Partnership</option>
                    </select>
                </div>
                <div id="salaryQatarContainer" class="hidden">
                    <h4 class="font-semibold text-gray-700 mb-3">Monthly Salary Range (QAR)</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                            <input type="number" id="salaryQatarMin" name="salaryQatarMin"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
                            <input type="number" id="salaryQatarMax" name="salaryQatarMax"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                    </div>
                </div>
                <div id="salaryVisitingContainer" class="hidden">
                    <h4 class="font-semibold text-gray-700 mb-3">Daily Rate (USD)</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                            <input type="number" id="visitingUSDMin" name="visitingUSDMin"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
                            <input type="number" id="visitingUSDMax" name="visitingUSDMax"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStep12() {
    return `
        <div class="step hidden" data-step="12">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
                <i class="fas fa-check-circle text-blue-600 mr-2"></i>
                Final Information & Consent
            </h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes or Questions
                    </label>
                    <textarea id="additionalNotes" name="additionalNotes" rows="4"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                </div>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <label class="flex items-start">
                        <input type="checkbox" id="consent" name="consent" required class="mt-1 mr-3">
                        <span class="text-sm text-blue-800">
                            I consent to MedWindow Qatar processing my personal data for eligibility assessment 
                            and licensing assistance purposes. <span class="text-red-500">*</span>
                        </span>
                    </label>
                </div>
                <div class="bg-green-50 border-l-4 border-green-500 p-4">
                    <label class="flex items-start">
                        <input type="checkbox" id="whatsappConsent" name="whatsappConsent" class="mt-1 mr-3">
                        <span class="text-sm text-green-800">
                            I consent to be contacted via WhatsApp for follow-up and updates.
                        </span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Navigation
    document.getElementById('next-btn')?.addEventListener('click', handleNext);
    document.getElementById('prev-btn')?.addEventListener('click', handlePrevious);
    document.getElementById('submit-btn')?.addEventListener('click', handleSubmit);
    
    // Dynamic fields
    document.addEventListener('change', function(e) {
        if (e.target.name === 'visaStatus') {
            document.getElementById('qidContainer').classList.toggle('hidden', e.target.value === 'none');
        }
        if (e.target.name === 'hasSpecialty') {
            document.getElementById('specialtyDetailsContainer').classList.toggle('hidden', e.target.value === 'no');
        }
        if (e.target.name === 'dataflowStatus') {
            document.getElementById('dataflowDetailsContainer').classList.toggle('hidden', e.target.value === 'never');
        }
        if (e.target.name === 'breakInPractice') {
            document.getElementById('breakDetailsContainer').classList.toggle('hidden', e.target.value === 'no');
        }
        if (e.target.name === 'isAestheticMedicinePath') {
            document.getElementById('aestheticDetailsContainer').classList.toggle('hidden', e.target.value === 'no');
        }
        if (e.target.id === 'employmentType') {
            document.getElementById('salaryQatarContainer').classList.toggle('hidden', e.target.value !== 'fixed');
            document.getElementById('salaryVisitingContainer').classList.toggle('hidden', e.target.value !== 'visiting');
        }
    });
    
    // Add experience entry
    document.getElementById('addExperienceBtn')?.addEventListener('click', addExperienceEntry);
}

// ============================================================================
// EXPERIENCE ENTRIES
// ============================================================================

let experienceEntryCount = 0;

function addExperienceEntry() {
    experienceEntryCount++;
    const container = document.getElementById('experienceEntriesContainer');
    const entryHTML = `
        <div class="experience-entry border border-gray-300 rounded-lg p-4 mb-4" data-entry="${experienceEntryCount}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-700">Experience Entry #${experienceEntryCount}</h4>
                <button type="button" class="remove-experience-btn text-red-600 hover:text-red-800" data-entry="${experienceEntryCount}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">From (MM/YYYY)</label>
                    <input type="month" name="exp_from_${experienceEntryCount}" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">To (MM/YYYY)</label>
                    <input type="month" name="exp_to_${experienceEntryCount}" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Place of Work</label>
                    <input type="text" name="exp_place_${experienceEntryCount}" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Workplace Type</label>
                    <select name="exp_type_${experienceEntryCount}" class="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select...</option>
                        <option value="government">Government Hospital</option>
                        <option value="private">Private Hospital/Center</option>
                        <option value="academic">Academic/University</option>
                        <option value="military">Military</option>
                        <option value="charity">Charity/NGO</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input type="text" name="exp_country_${experienceEntryCount}" class="w-full px-4 py-2 border rounded-lg">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHTML);
    
    // Add remove listener
    document.querySelector(`[data-entry="${experienceEntryCount}"] .remove-experience-btn`)
        .addEventListener('click', function() {
            this.closest('.experience-entry').remove();
        });
}

// Initialize with one entry
setTimeout(() => {
    if (document.getElementById('experienceEntriesContainer')) {
        addExperienceEntry();
    }
}, 100);

// ============================================================================
// NAVIGATION
// ============================================================================

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.add('hidden'));
    document.querySelector(`[data-step="${stepNumber}"]`)?.classList.remove('hidden');
    
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.classList.toggle('hidden', stepNumber === 1);
    
    if (stepNumber === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    
    currentStep = stepNumber;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleNext() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

function handlePrevious() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function updateProgress() {
    const percent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('progress-text').textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById('progress-percentage').textContent = `${percent}%`;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value || (field.type === 'radio' && !currentStepElement.querySelector(`[name="${field.name}"]:checked`))) {
            isValid = false;
            field.classList.add('border-red-500');
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    return isValid;
}

function saveCurrentStepData() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) return;
    
    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) formData[input.name] = input.value;
        } else if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else {
            formData[input.name] = input.value;
        }
    });
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    saveCurrentStepData();
    collectExperienceEntries();
    
    const eligibilityResult = calculateEligibility();
    formData = { ...formData, ...eligibilityResult };
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
    
    try {
        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showThankYouMessage();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form. Please try again or contact us.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Assessment <i class="fas fa-check ml-2"></i>';
    }
}

function collectExperienceEntries() {
    const entries = [];
    document.querySelectorAll('.experience-entry').forEach(entry => {
        const entryNum = entry.dataset.entry;
        entries.push({
            from: document.querySelector(`[name="exp_from_${entryNum}"]`)?.value || '',
            to: document.querySelector(`[name="exp_to_${entryNum}"]`)?.value || '',
            place: document.querySelector(`[name="exp_place_${entryNum}"]`)?.value || '',
            type: document.querySelector(`[name="exp_type_${entryNum}"]`)?.value || '',
            country: document.querySelector(`[name="exp_country_${entryNum}"]`)?.value || ''
        });
    });
    formData.experienceEntriesJSON = JSON.stringify(entries);
}

function calculateEligibility() {
    // Simplified eligibility logic - full implementation would be much more complex
    let status = 'Pending Review';
    let summary = 'Your application will be reviewed by our team.';
    let dataflowAction = formData.dataflowStatus === 'never' ? 'New Application' : 'Transfer/Renewal';
    let examRequired = 'To be determined';
    let supervisionRequired = 'To be determined';
    
    // Check internship
    if (parseInt(formData.internshipMonths) < 12) {
        status = 'Insufficient Internship';
        summary = 'Internship duration is below the minimum 12 months required.';
    }
    
    return {
        eligibilityStatus: status,
        eligibilitySummaryText: summary,
        dataflowAction: dataflowAction,
        prometric ExamRequired: examRequired,
        supervisionRequired: supervisionRequired,
        nextSteps: 'Our team will contact you with detailed requirements.'
    };
}

function showThankYouMessage() {
    document.getElementById('assessment-container').classList.add('hidden');
    document.getElementById('thank-you-message').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
