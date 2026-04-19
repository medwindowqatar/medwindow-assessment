// MedWindow Qatar v4.1 – All audit fixes applied
// Fixes: BUG-01 through BUG-08, MISS-01 through MISS-05, OPT-01 through OPT-07
let PHYS_QUALS={},DENT_QUALS={},STATIC={};
let currentStep=1; const totalSteps=11; let experienceCounter=0;

document.addEventListener('DOMContentLoaded',async()=>{
    try{ await loadData(); init(); setupEvents(); showStep(1); }
    catch(e){ 
        console.error('First load failed, retrying...',e);
        // Retry once after 1 second
        setTimeout(async()=>{
            try{ await loadData(); init(); setupEvents(); showStep(1); }
            catch(e2){ console.error('Retry failed:',e2); document.body.innerHTML='<div style="padding:40px;text-align:center;font-family:sans-serif"><h2>Loading Error</h2><p>Please refresh the page (Ctrl+R)</p><p style="color:#999;font-size:12px">'+e2.message+'</p></div>'; }
        },1000);
    }
});
async function loadData(){
    function checkOk(r,name){if(!r.ok)throw new Error('HTTP '+r.status+' loading '+name);return r.json();}
    const[pq,dq,st]=await Promise.all([
        fetch('./qualifications_physicians.json').then(r=>checkOk(r,'qualifications_physicians.json')),
        fetch('./qualifications_dentists.json').then(r=>checkOk(r,'qualifications_dentists.json')),
        fetch('./static_lists.json').then(r=>checkOk(r,'static_lists.json'))
    ]); PHYS_QUALS=pq; DENT_QUALS=dq; STATIC=st;
}
function init(){
    updateProgress();
    // Populate visa options
    const vc=document.getElementById('visaStatusOptions');
    if(vc&&STATIC.visa_statuses) vc.innerHTML=STATIC.visa_statuses.map(v=>
        `<label class="option-card"><input type="radio" name="visaStatus" value="${v.id}" required><span class="option-label">${v.label}</span></label>`).join('');
    // Populate break reasons
    const br=document.getElementById('breakReason');
    if(br&&STATIC.break_reasons) STATIC.break_reasons.forEach(r=>{const o=document.createElement('option');o.value=r.id;o.textContent=r.label;br.appendChild(o);});
}

// ============================================================================
// HELPERS
// ============================================================================
function gv(name){
    const f=document.getElementById('assessment-form');
    const el=f.querySelector(`[name="${name}"]:checked`)||f.querySelector(`[name="${name}"]`);
    return el?el.value:'';
}
function isQatari(){return['family_qatari','family_offspring_qw'].includes(gv('visaStatus'));}
function isOffspring(){return gv('visaStatus')==='family_offspring_resident';}
function isSpouse(){return gv('visaStatus')==='family_spouse';}
function isFamilySponsored(){return isOffspring()||isSpouse();}
function isOverseas(){return gv('visaStatus')==='none';}

// ============================================================================
// EVENTS
// ============================================================================
function setupEvents(){
    document.getElementById('nextBtn').addEventListener('click',handleNext);
    document.getElementById('prevBtn').addEventListener('click',handlePrev);
    document.getElementById('submitBtn').addEventListener('click',function(e){e.preventDefault();handleSubmit();});
    document.getElementById('addExperienceBtn').addEventListener('click',addExp);
    document.getElementById('profession').addEventListener('change',onProfessionChange);

    document.addEventListener('change',function(e){
        const n=e.target.name, v=e.target.value;
        // Visa → QID + spouse warning
        if(n==='visaStatus'){
            toggle('qidSection',['family_offspring_resident','family_spouse','work','other_visa'].includes(v));
            toggle('spouseNote',v==='family_spouse');
        }
        // Internship
        if(n==='internshipCompleted'){
            toggle('internshipDetails',v==='yes');
            // Dentist internship note
            if(gv('profession')==='Dentist'&&parseInt(gv('programDuration'))>=5)
                toggle('dentistInternshipNote',v==='yes');
        }
        // Scope → target sector visibility
        if(n==='practiceScope') updateTargetSectorVisibility();
        // Qualification category
        if(n==='qualCategory'){
            toggle('cat3Details',v==='cat3');
            toggle('equivalencyCheck',v==='cat1'||v==='cat2');
            populateQuals(v);
        }
        // Equivalency warning
        if(n==='grantedByEquivalency') toggle('equivalencyWarning',v==='yes');
        // Fellowship
        if(n==='hasFellowship') toggle('fellowshipFields',v==='yes');
        // Break
        if(n==='breakInPractice') toggle('breakDetails',v==='yes');
        // DataFlow
        if(n==='dataflowStatus') toggle('dataflowDetails',v==='yes_done');
        // Work nature warnings
        if(n==='workNature'){
            toggle('locumWarning',v==='locum');
            toggle('visitorWarning',v==='visitor');
            toggle('nonresWarning',v==='non_resident');
        }
        // Compensation
        if(n==='compensationPlan'||n==='workNature') updateSalary();
    });
}
function toggle(id,show){const el=document.getElementById(id);if(el)el.classList.toggle('hidden',!show);}
function updateTargetSectorVisibility(){
    const scope=gv('practiceScope');
    const visa=gv('visaStatus');
    const show=(scope==='gp'||scope==='general_dentist')&&(isQatari()||isOffspring());
    toggle('targetSectorSection',show);
    const hint=document.getElementById('sectorHint');
    if(hint){
        if(isQatari()) hint.textContent='Qatari/offspring of Qatari woman: Gov/Semi-Gov = no experience required. Private = 2 years experience required.';
        else if(isOffspring()) hint.textContent='Offspring of resident: Gov/Semi-Gov = no experience required. Private = 2 years experience required.';
    }
}
function updateSalary(){
    const cp=gv('compensationPlan'),wn=gv('workNature');
    const sf=document.getElementById('salaryFields');
    if(cp){sf.classList.remove('hidden');
        toggle('monthlySalaryRange',!['non_resident','visitor','locum'].includes(wn));
        toggle('dailyRateRange',['non_resident','visitor','locum'].includes(wn));
    }else sf.classList.add('hidden');
}

// ============================================================================
// DYNAMIC CONTENT
// ============================================================================
function onProfessionChange(){
    const prof=gv('profession');
    const ss=document.getElementById('specialtyName');
    ss.innerHTML='<option value="">Select specialty...</option>';
    if(!prof) return;
    const specs=prof==='Physician'?STATIC.physicianSpecialties:STATIC.dentistSpecialties;
    specs.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;ss.appendChild(o);});
    // Scope options
    const so=document.getElementById('scopeOptions');
    if(prof==='Physician'){
        so.innerHTML=`
            <label class="option-card"><input type="radio" name="practiceScope" value="gp" required><span class="option-label">General Practitioner (GP)</span></label>
            <label class="option-card"><input type="radio" name="practiceScope" value="specialist"><span class="option-label">Specialist</span></label>
            <label class="option-card"><input type="radio" name="practiceScope" value="resident"><span class="option-label">Resident (joining training program in Qatar)</span></label>
            <label class="option-card"><input type="radio" name="practiceScope" value="fellow"><span class="option-label">Fellow (joining fellowship in Qatar)</span></label>`;
    }else{
        so.innerHTML=`
            <label class="option-card"><input type="radio" name="practiceScope" value="general_dentist" required><span class="option-label">General Dentist</span></label>
            <label class="option-card"><input type="radio" name="practiceScope" value="dental_specialist"><span class="option-label">Dental Specialist</span></label>`;
    }
}
function populateQuals(cat){
    const prof=gv('profession'),sel=document.getElementById('specificQual');
    sel.innerHTML='<option value="">Select qualification...</option>';
    let qs=[];
    if(prof==='Physician'){
        if(cat==='cat1')qs=PHYS_QUALS.category_1||[];
        else if(cat==='cat2')qs=PHYS_QUALS.category_2||[];
    }else{
        if(cat==='cat1')qs=DENT_QUALS.category_1||[];
        else if(cat==='cat2')qs=[...(DENT_QUALS.category_2||[]),...(DENT_QUALS.category_2_star||[])];
    }
    qs.forEach(q=>{const o=document.createElement('option');o.value=q.id;o.textContent=`${q.name}`;sel.appendChild(o);});
    if(cat==='cat3'){const o=document.createElement('option');o.value='cat3_other';o.textContent='My qualification is not in Category 1 or 2';sel.appendChild(o);}
}

// Experience
function addExp(){
    experienceCounter++;
    const c=document.getElementById('experienceEntries');
    const d=document.createElement('div');d.className='exp-card';d.id=`experience-${experienceCounter}`;
    const types=STATIC.workplaceTypes||[];
    d.innerHTML=`<div class="exp-header"><h4>Experience #${experienceCounter}</h4>${experienceCounter>1?`<button type="button" onclick="removeExp(${experienceCounter})" class="remove-btn">✕</button>`:''}</div>
    <div class="exp-grid">
        <div><label class="field-label">From *</label><input type="month" name="exp_from_${experienceCounter}" required onchange="calcExp()"></div>
        <div><label class="field-label">To *</label><input type="month" name="exp_to_${experienceCounter}" required onchange="calcExp()"></div>
        <div class="full-width"><label class="field-label">Institution *</label><input type="text" name="exp_workplace_${experienceCounter}" required placeholder="e.g., King Fahd Medical City"></div>
        <div><label class="field-label">Type *</label><select name="exp_type_${experienceCounter}" required onchange="calcExp()"><option value="">Select...</option>${types.map(t=>`<option value="${t.id}">${t.label}</option>`).join('')}</select></div>
        <div><label class="field-label">Country *</label><input type="text" name="exp_country_${experienceCounter}" required placeholder="e.g., Saudi Arabia"></div>
    </div>`;
    c.appendChild(d);calcExp();
}
function removeExp(id){const el=document.getElementById(`experience-${id}`);if(el){el.remove();calcExp();}}
function calcExp(){
    const entries=document.querySelectorAll('[id^="experience-"]');
    let tM=0,qM=0,c3M=0;
    entries.forEach(e=>{
        const f=e.querySelector('[name^="exp_from_"]')?.value;
        const t=e.querySelector('[name^="exp_to_"]')?.value;
        const tp=e.querySelector('[name^="exp_type_"]')?.value;
        if(f&&t){
            const fd=new Date(f),td=new Date(t);
            const m=(td.getFullYear()-fd.getFullYear())*12+(td.getMonth()-fd.getMonth());
            if(m>0){tM+=m;const d=(STATIC.workplaceTypes||[]).find(x=>x.id===tp);if(d?.qualifies)qM+=m;if(d?.cat3_qualifies)c3M+=m;}
        }
    });
    const sd=document.getElementById('experienceSummary'),sc=document.getElementById('summaryContent');
    if(tM>0){sd.classList.remove('hidden');
        sc.innerHTML=`<p><strong>Total:</strong> ${(tM/12).toFixed(1)}yr</p><p><strong>Qualifying:</strong> ${(qM/12).toFixed(1)}yr</p><p><strong>Cat-3 Qualifying (Gov/Training):</strong> ${(c3M/12).toFixed(1)}yr</p>`;
    }else sd.classList.add('hidden');
}

// ============================================================================
// STEP SKIPPING (OPT-01, OPT-02)
// ============================================================================
function shouldSkip(n){
    const scope=gv('practiceScope');
    const cat=gv('qualCategory');
    // Step 4 (Specialty): skip for GP, general_dentist, resident
    if(n===4&&['gp','general_dentist','resident'].includes(scope)) return true;
    // Step 6 (Experience): skip for resident
    if(n===6&&scope==='resident') return true;
    // Step 7 (Break): skip for resident
    if(n===7&&scope==='resident') return true;
    // Step 8 (Exam): skip for cat1/2 specialists, Qatari, resident
    if(n===8){
        if(scope==='resident') return true;
        if(isQatari()) return true;
        if(['specialist','dental_specialist'].includes(scope)&&['cat1','cat2'].includes(cat)) return true;
    }
    return false;
}
function nextVisible(n){while(n<=totalSteps&&shouldSkip(n))n++;return n;}
function prevVisible(n){while(n>=1&&shouldSkip(n))n--;return n;}

// ============================================================================
// NAVIGATION
// ============================================================================
function showStep(n){
    document.querySelectorAll('.step').forEach(s=>s.classList.add('hidden'));
    const t=document.querySelector(`[data-step="${n}"]`);if(t)t.classList.remove('hidden');
    document.getElementById('prevBtn').classList.toggle('hidden',n===1);
    document.getElementById('nextBtn').classList.toggle('hidden',n===totalSteps);
    document.getElementById('submitBtn').classList.toggle('hidden',n!==totalSteps);
    currentStep=n;updateProgress();window.scrollTo({top:0,behavior:'smooth'});
    // Step-specific setup
    if(n===6&&experienceCounter===0)addExp();
    if(n===totalSteps)populateReview();
}
function handleNext(){
    if(!validateStep()){showValMsg();return;}
    const n=nextVisible(currentStep+1);
    if(n<=totalSteps)showStep(n);
}
function handlePrev(){
    const p=prevVisible(currentStep-1);
    if(p>=1)showStep(p);
}
function updateProgress(){
    const pct=Math.round(((currentStep-1)/(totalSteps-1))*100);
    document.getElementById('progress-bar').style.width=`${pct}%`;
    document.getElementById('progress-text').textContent=`Step ${currentStep} of ${totalSteps}`;
    document.getElementById('progress-percentage').textContent=`${pct}%`;
}
function showValMsg(){
    const el=document.querySelector(`[data-step="${currentStep}"]`);
    let m=el.querySelector('.validation-msg');if(m)m.remove();
    m=document.createElement('div');m.className='validation-msg';
    m.textContent='Please complete all required fields.';el.prepend(m);
    setTimeout(()=>m.remove(),4000);
}

// ============================================================================
// VALIDATION
// ============================================================================
function validateStep(){
    const el=document.querySelector(`[data-step="${currentStep}"]`);
    const fields=el.querySelectorAll('[required]');
    let ok=true;const checked=new Set();
    fields.forEach(f=>{
        let p=f.parentElement,hid=false;
        while(p&&p!==el){if(p.classList.contains('hidden')){hid=true;break;}p=p.parentElement;}
        if(hid)return;
        if(f.type==='radio'){if(checked.has(f.name))return;checked.add(f.name);if(!el.querySelector(`input[name="${f.name}"]:checked`))ok=false;}
        else if(f.type==='checkbox'){if(!f.checked)ok=false;}
        else{if(!f.value.trim()){f.classList.add('field-error');ok=false;}else f.classList.remove('field-error');}
    });return ok;
}

// ============================================================================
// ELIGIBILITY ENGINE (All 8 bugs fixed)
// ============================================================================
function calcEligibility(data){
    const r={eligible:false,status:'NEEDS_REVIEW',scope:'',summary:'',dataflowAction:'',examRequired:'TBD',
        supervisionRequired:'No',goodStandingAction:'',notes:[],qualYrs:0,cat3QualYrs:0,totalYrs:0};

    const prof=data.profession, scope=data.practiceScope;
    const visa=data.visaStatus||'none';
    const _isQ=['family_qatari','family_offspring_qw'].includes(visa);
    const _isOff=visa==='family_offspring_resident';
    const _isSp=visa==='family_spouse';
    const _isFam=_isOff||_isSp;
    const _isOv=visa==='none';
    const _isWork=visa==='work';

    // FAIMER check (MISS-04)
    if(data.faimerListed==='no'){
        r.status='INELIGIBLE';r.summary='Not eligible: University must be listed in FAIMER/IMED World Directory (mandatory DHP requirement).';return r;
    }
    if(data.faimerListed==='unsure') r.notes.push('VERIFY: Confirm your university is in the FAIMER/IMED World Directory before applying.');

    // Internship note
    if(data.internshipCompleted==='no') r.notes.push('No internship: Per Circular DHP/2025/24, 1 year of licensed clinical experience may substitute – subject to DHP review.');

    // Experience calc
    const entries=document.querySelectorAll('[id^="experience-"]');
    let tM=0,qM=0,c3M=0;
    entries.forEach(e=>{
        const f=e.querySelector('[name^="exp_from_"]')?.value;
        const t=e.querySelector('[name^="exp_to_"]')?.value;
        const tp=e.querySelector('[name^="exp_type_"]')?.value;
        if(f&&t){const fd=new Date(f),td=new Date(t),m=(td.getFullYear()-fd.getFullYear())*12+(td.getMonth()-fd.getMonth());
            if(m>0){tM+=m;const d=(STATIC.workplaceTypes||[]).find(x=>x.id===tp);if(d?.qualifies)qM+=m;if(d?.cat3_qualifies)c3M+=m;}}
    });
    // BUG-08: Dentist internship as experience
    if(prof==='Dentist'&&parseInt(data.programDuration)>=5&&data.internshipCompleted==='yes'){
        const im=parseInt(data.internshipMonths)||0;tM+=im;qM+=im;
        r.notes.push(`Dentist ≥5yr program: ${im}mo internship counted as experience.`);
    }
    r.qualYrs=qM/12;r.cat3QualYrs=c3M/12;r.totalYrs=tM/12;

    // Break
    const hasBreak=data.breakInPractice==='yes';
    const breakYrs=parseFloat(data.breakDuration)||0;

    // Spouse >2yr break (all scopes)
    if(_isSp&&hasBreak&&breakYrs>2){r.status='INELIGIBLE';r.summary='Not eligible: Spouse on family sponsorship with break >2 years.';return r;}
    // Break ≥5yr (all)
    if(hasBreak&&breakYrs>=5){r.status='INELIGIBLE';r.summary='Not eligible: Break ≥5 years. Must apply for new evaluation.';return r;}

    // DataFlow
    if(data.dataflowStatus==='never') r.dataflowAction='New DataFlow PSV required (mandatory from Jan 2026 – DataFlow Group or QuadraBay).';
    else if(data.dataflowStatus==='in_progress') r.dataflowAction='DataFlow PSV in progress. Must be completed before DHP evaluation.';
    else if(data.dataflowStatus==='yes_done'){
        const d=new Date(data.dataflowDate),yrs=(new Date()-d)/(1000*60*60*24*365.25);
        r.dataflowAction=yrs<=3?`Transfer possible (last: ${data.dataflowDate}).`:`Renewal required (last: ${data.dataflowDate} – >3yr old).`;
    }

    // Good Standing
    if(data.goodStanding==='available') r.goodStandingAction='Available.';
    else if(data.goodStanding==='can_provide') r.goodStandingAction='Needs updated certificate (must cover required experience, verified by PSV).';
    else r.notes.push('Good Standing Certificate is mandatory for licensing.');

    // =========================
    // PHYSICIAN
    // =========================
    if(prof==='Physician'){

        // --- GP ---
        if(scope==='gp'){
            r.scope='General Practitioner';
            r.examRequired='DHP GP Qualifying Exam (Prometric)';
            if(data.gpExamExempt==='yes') r.examRequired=`Exempt (passed: ${data.gpExamExemptName||'equivalent exam'}). Must be verified.`;
            if(_isQ){r.examRequired='Exempt (Qatari/offspring of Qatari woman).';}

            // BUG-03: Overseas + any break = ineligible
            if(_isOv&&hasBreak){r.status='INELIGIBLE';r.summary='Not eligible: Overseas GP with break from practice – DHP policy rejects.';return r;}

            // BUG-01: Correct thresholds per visa type
            if(_isOv){
                if(r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';}
                else{r.status='INELIGIBLE';r.summary=`Not eligible: Overseas GP needs 5yr experience (have ${r.totalYrs.toFixed(1)}yr).`;return r;}
            }else if(_isQ){
                const sec=data.targetSector||'gov';
                if(sec==='gov'){r.eligible=true;r.status='ELIGIBLE';r.notes.push('Qatari joining Gov/Semi-Gov: Experience waived.');}
                else{
                    if(r.totalYrs>=2){r.eligible=true;r.status='ELIGIBLE';}
                    else{r.scope='General Practitioner (Supervised)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';r.notes.push('Qatari private sector: 2yr needed. GP(Supervised) to complete.');}
                }
            }else if(_isOff){
                const sec=data.targetSector||'gov';
                if(sec==='gov'){r.eligible=true;r.status='ELIGIBLE';r.notes.push('Offspring joining Gov/Semi-Gov: Experience waived.');}
                else{
                    if(r.totalYrs>=2){r.eligible=true;r.status='ELIGIBLE';}
                    else{r.scope='General Practitioner (Supervised)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';}
                }
            // BUG-02: Spouse separate logic
            }else if(_isSp){
                if(r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';r.notes.push('Spouse: Only recent experience (last 5yr, 10mo/yr min) accepted.');}
                else if(hasBreak){
                    r.scope='General Practitioner (Supervised)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';
                    r.supervisionRequired='Yes – Break from practice';r.notes.push('Spouse GP(Supervised): Only for break from practice. Recent experience only.');
                }else{r.status='INELIGIBLE';r.summary='Not eligible: Spouse without required experience and without break from practice.';return r;}
            }else{
                // Work visa / other
                if(_isOv||_isWork){
                    if(r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';}
                    else{r.status='INELIGIBLE';r.summary=`Not eligible: 5yr experience required (have ${r.totalYrs.toFixed(1)}yr).`;return r;}
                }
                // Work visa + break
                if((_isWork)&&hasBreak){r.status='INELIGIBLE';r.summary='Not eligible: Work-visa GP with break from practice.';return r;}
            }

        // --- SPECIALIST ---
        }else if(scope==='specialist'){
            let cat=data.qualCategory==='cat1'?1:(data.qualCategory==='cat2'?2:3);
            const spec=data.specialtyName||'Specialty';
            const wn=data.workNature||'permanent';

            // BUG-06: Equivalency downgrade
            if(data.grantedByEquivalency==='yes'&&cat<3){cat=3;r.notes.push('Qualification by equivalency → Category 3 per DHP General Notes.');}

            r.scope=`Specialist – ${spec}`;
            const postSpecNeeded=cat===1?1:(cat===2?2:3);

            // Overseas + any break = ineligible
            if(_isOv&&hasBreak){r.status='INELIGIBLE';r.summary='Not eligible: Overseas specialist with break from practice.';return r;}

            // Trained in Qatar exemption (MISS-03)
            if(data.trainedInQatar==='yes'&&_isQ){
                r.eligible=true;r.status='ELIGIBLE';r.examRequired='Exempt (Qatar-trained Qatari).';
                r.notes.push('Completed training in Qatar + Qatari: Exempt from experience and exam.');
            }else if(data.trainedInQatar==='yes'){
                r.notes.push('Qatar-trained: If completed residency+fellowship in Qatar training hospitals AND passed board exam → may be exempt from experience+exam. Subject to DHP verification.');
            }

            if(cat===1){
                r.examRequired='Not required (Category 1)';
                if(_isQ){r.eligible=true;r.status='ELIGIBLE';r.notes.push('Qatari: Exempt from experience+exam.');}
                else if(r.qualYrs>=postSpecNeeded&&r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';}
                else if(_isFam&&r.qualYrs<postSpecNeeded){r.scope=`Assistant Specialty – ${spec}`;r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';r.notes.push('Assistant Specialty to complete experience (Circular DHP/2024/15).');}
                else if(r.qualYrs>=postSpecNeeded&&r.totalYrs<5){r.status='INELIGIBLE';r.summary=`Need 5yr total experience (have ${r.totalYrs.toFixed(1)}yr).`;return r;}
                else if(_isFam){r.scope=`Assistant Specialty – ${spec}`;r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';}
                else{r.status='INELIGIBLE';r.summary=`Cat-1 needs ${postSpecNeeded}yr post-spec (have ${r.qualYrs.toFixed(1)}yr).`;return r;}
            }else if(cat===2){
                r.examRequired='Not required (Category 2)';
                if(_isQ){r.eligible=true;r.status='ELIGIBLE';}
                else if(r.qualYrs>=postSpecNeeded&&r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';}
                else if(_isFam&&r.qualYrs<postSpecNeeded){r.scope=`Assistant Specialty – ${spec}`;r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';}
                else{r.status='INELIGIBLE';r.summary=`Cat-2 needs ${postSpecNeeded}yr post-spec + 5yr total (have ${r.qualYrs.toFixed(1)}/${r.totalYrs.toFixed(1)}).`;return r;}
            }else{
                r.examRequired='Required – DHP Qualifying Exam';
                if(data.cat3StructuredTraining!=='yes') r.notes.push('WARNING: Cat-3 requires structured training certificate (≥3yr) + exit/board exam.');
                if(_isQ){r.eligible=true;r.status='ELIGIBLE';r.examRequired='Exempt (Qatari).';}
                else if(r.cat3QualYrs>=postSpecNeeded&&r.totalYrs>=5){r.eligible=true;r.status='ELIGIBLE';r.notes.push('Cat-3 experience must be from Gov/Semi-Gov or Training hospitals.');}
                else if(_isFam){r.scope=`Assistant Specialty – ${spec}`;r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';r.notes.push('Cat-3 Asst Specialty: Must have valid passing exam certificate.');}
                else{r.status='INELIGIBLE';r.summary=`Cat-3: Need 3yr from Gov/Training (have ${r.cat3QualYrs.toFixed(1)}yr) + 5yr total (have ${r.totalYrs.toFixed(1)}yr).`;return r;}
            }
            // Non-resident / visitor notes
            if(wn==='non_resident') r.notes.push(`Non-resident: 5yr post-specialty required${cat===3?' from Gov/Training':''}.`);
            if(wn==='visitor') r.notes.push('Visitor: 10yr specialty experience from Gov/Training hospitals required.');
            // Family-sponsored + break → supervision
            if(hasBreak&&(_isFam||_isQ)){r.supervisionRequired='Yes – Break from practice';r.notes.push('Break: Supervised practice per Break from Practice policy.');}

        // --- RESIDENT (BUG-07) ---
        }else if(scope==='resident'){
            r.scope='Resident (Training in Qatar)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';
            r.examRequired='Not required for Resident.';r.supervisionRequired='N/A – under training program.';
            r.notes.push('Requires acceptance letter from residency program in Qatar.');
            r.notes.push('MBBS/equivalent from FAIMER-listed university required.');

        // --- FELLOW (BUG-05 fixed) ---
        }else if(scope==='fellow'){
            r.scope='Fellow (Training in Qatar)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';
            const mainC=data.fellowshipMainCat||data.qualCategory||'cat1';
            const subC=data.fellowshipSubCat||'cat1';
            const mN=mainC==='cat1'?1:(mainC==='cat2'?2:3);
            const sN=subC==='cat1'?1:(subC==='cat2'?2:3);
            // BUG-05: Exam only if BOTH are cat3
            if(mN===3&&sN===3) r.examRequired='Required (both main+fellowship Cat-3).';
            else r.examRequired='Not required.';
            const expN=mN===1?1:(mN===2?2:3);
            r.notes.push(`Post-fellowship experience: ${expN}yr (follows main specialty Cat-${mN}).`);
            r.notes.push('Requires acceptance letter from fellowship program in Qatar. 5yr total experience.');
        }

    // =========================
    // DENTIST
    // =========================
    }else if(prof==='Dentist'){
        if(scope==='general_dentist'){
            r.scope='General Dentist';r.examRequired='DHP Dentist Qualifying Exam (Prometric)';
            if(_isQ){r.examRequired='Exempt (Qatari).';r.eligible=true;r.status='ELIGIBLE';}
            else if(_isOv&&hasBreak){r.status='INELIGIBLE';r.summary='Not eligible: Overseas dentist with break from practice.';return r;}
            else if(r.totalYrs>=2){r.eligible=true;r.status='ELIGIBLE';}
            else if(_isFam){
                if(hasBreak||r.totalYrs<2){r.scope='General Dentist (Supervised)';r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.supervisionRequired='Yes';r.notes.push('GD(Supervised): Requires family sponsorship QID.');}
            }else{r.status='INELIGIBLE';r.summary=`General Dentist needs 2yr experience (have ${r.totalYrs.toFixed(1)}yr).`;return r;}

        }else if(scope==='dental_specialist'){
            let cat=data.qualCategory==='cat1'?1:(data.qualCategory==='cat2'?2:3);
            if(data.grantedByEquivalency==='yes'&&cat<3){cat=3;r.notes.push('Equivalency → Cat-3.');}
            const spec=data.specialtyName||'Dental Specialty';
            r.scope=`Dental Specialist – ${spec}`;

            if(_isOv&&hasBreak){r.status='INELIGIBLE';r.summary='Not eligible: Overseas dental specialist with break.';return r;}

            if(cat===1){
                r.examRequired='Not required (Cat-1).';r.eligible=true;r.status='ELIGIBLE';
            }else if(cat===2){
                r.examRequired='Not required (Cat-2).';
                const qid=data.specificQual||'';const isStar=qid.startsWith('d2s_');
                const needed=isStar?3:2;const famNeeded=isStar?2:0;
                if(_isQ){r.eligible=true;r.status='ELIGIBLE';}
                else if(_isFam&&r.qualYrs>=famNeeded){r.eligible=true;r.status='ELIGIBLE';}
                else if(r.qualYrs>=needed){r.eligible=true;r.status='ELIGIBLE';}
                else{r.scope=`General Dentist (with privileges in ${spec})`;r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';
                    r.examRequired='Prometric required (applying as GD).';r.notes.push(`Need ${needed}yr for Specialist (have ${r.qualYrs.toFixed(1)}yr). Can apply as GD with non-core privileges.`);}
            }else{
                r.scope=`General Dentist (qualification not in approved list)`;r.examRequired='Prometric required.';
                if(r.totalYrs>=2||_isQ){r.eligible=true;r.status='ELIGIBLE_WITH_CONDITIONS';r.notes.push('Degree not in approved list → cannot be Specialist. GD + non-core privileges. No future scope change to Specialist.');}
                else{r.status='INELIGIBLE';r.summary='Not eligible: Qualification not approved + <2yr experience.';return r;}
            }
        }
    }

    // Build summary
    if(r.eligible||r.status==='ELIGIBLE_WITH_CONDITIONS'){
        let l=[`Assessment: ${r.status==='ELIGIBLE'?'LIKELY ELIGIBLE':'POTENTIALLY ELIGIBLE WITH CONDITIONS'}`];
        l.push(`Scope: ${r.scope}`);l.push(`Exam: ${r.examRequired}`);l.push(`Supervision: ${r.supervisionRequired}`);
        l.push(`DataFlow: ${r.dataflowAction||'Required (mandatory for all)'}`);l.push(`Good Standing: ${r.goodStandingAction||'Required for licensing'}`);
        if(r.notes.length)l.push(`Notes: ${r.notes.join(' | ')}`);
        l.push('DISCLAIMER: Preliminary assessment only. Subject to DHP review.');
        r.summary=l.join('\n');
    }else if(!r.summary) r.summary='Unable to determine. Contact MedWindow Qatar.';
    return r;
}

// ============================================================================
// REVIEW & SUBMIT
// ============================================================================
function populateReview(){
    const data=Object.fromEntries(new FormData(document.getElementById('assessment-form')).entries());
    const rev=document.getElementById('reviewContent');if(!rev)return;
    const vl=(STATIC.visa_statuses||[]).find(v=>v.id===data.visaStatus)?.label||data.visaStatus||'-';
    const sl={gp:'General Practitioner',specialist:'Specialist',resident:'Resident',fellow:'Fellow',general_dentist:'General Dentist',dental_specialist:'Dental Specialist'};
    const cl={cat1:'Category 1',cat2:'Category 2',cat3:'Category 3'};
    rev.innerHTML=`
        <div class="review-section"><strong>Name:</strong> ${data.fullName||'-'} | ${data.email||'-'} | ${data.phone||'-'}</div>
        <div class="review-section"><strong>Nationality:</strong> ${data.nationality||'-'} | Home: ${data.homeCountry||'-'} | Residency: ${data.residencyCountry||'-'}</div>
        <div class="review-section"><strong>Qatar Status:</strong> ${vl}</div>
        <div class="review-section"><strong>Profession:</strong> ${data.profession||'-'} | Scope: ${sl[data.practiceScope]||data.practiceScope||'-'}</div>
        <div class="review-section"><strong>University:</strong> ${data.medicalSchool||'-'} (${data.graduationYear||'-'}) | FAIMER: ${data.faimerListed||'-'}</div>
        ${data.specialtyName?`<div class="review-section"><strong>Specialty:</strong> ${data.specialtyName} | ${cl[data.qualCategory]||'-'}</div>`:''}
        <div class="review-section"><strong>Work Nature:</strong> ${data.workNature||'-'}</div>
        <div class="review-section"><strong>Break:</strong> ${data.breakInPractice==='yes'?data.breakDuration+'yr':'None'}</div>
        <div class="review-section"><strong>DataFlow:</strong> ${data.dataflowStatus||'-'} | Good Standing: ${data.goodStanding||'-'}</div>`;
}

async function handleSubmit(){
    if(!validateStep()){
        showValMsg();
        var msg=document.querySelector('[data-step="'+currentStep+'"] .validation-msg');
        if(msg)msg.scrollIntoView({behavior:'smooth',block:'center'});
        return;
    }
    var form=document.getElementById('assessment-form');
    var fd=new FormData(form),data=Object.fromEntries(fd.entries());
    data.healthcareSector=Array.from(form.querySelectorAll('input[name="healthcareSector"]:checked')).map(c=>c.value).join(', ');
    data.assistance=Array.from(form.querySelectorAll('input[name="assistance"]:checked')).map(c=>c.value).join(', ');
    const exps=[];document.querySelectorAll('[id^="experience-"]').forEach(e=>{const id=e.id.split('-')[1];
        exps.push({from:data[`exp_from_${id}`],to:data[`exp_to_${id}`],workplace:data[`exp_workplace_${id}`],type:data[`exp_type_${id}`],country:data[`exp_country_${id}`]});});
    data.experienceEntriesJson=JSON.stringify(exps);
    try{
        const el=calcEligibility(data);
        data.eligibilityStatus=el.status;data.eligibilitySummary=el.summary;data.eligibilityScope=el.scope;
        data.eligibilityExam=el.examRequired;data.eligibilitySupervision=el.supervisionRequired;data.eligibilityDataflow=el.dataflowAction;
    }catch(err){
        console.error('Eligibility calc error:',err);
        data.eligibilityStatus='NEEDS_REVIEW';data.eligibilitySummary='Error in auto-assessment. Manual review required. Error: '+err.message;
    }
    const btn=document.getElementById('submitBtn');btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Submitting...';
    try{await fetch(CONFIG.GOOGLE_SHEETS_URL,{method:'POST',mode:'no-cors',cache:'no-cache',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
        showSuccess(data.fullName);}catch(err){console.error(err);showSuccess(data.fullName);}
}
function showSuccess(name){
    document.getElementById('assessment-container').classList.add('hidden');
    document.querySelector('.progress-wrapper').classList.add('hidden');
    document.querySelector('.sticky-nav').classList.add('hidden');
    const banner=document.getElementById('info-banner');if(banner)banner.classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
    document.getElementById('user-name-display').textContent=name;
    window.scrollTo({top:0,behavior:'smooth'});
}
