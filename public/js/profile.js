// ═══════════════════════════════════════════════════════════
// PROFILE WIZARD CONTROLLER
// Handles the multi-step profile builder and updates
// ═══════════════════════════════════════════════════════════

const Profile = {
  currentStep: 1,
  totalSteps: 4,
  formData: {
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activity_level: 'moderate',
    fitness_goal: 'maintain',
    dietary_restrictions: [],
    cultural_preference: 'mixed',
    budget: 'moderate',
    equipment: [],
    meals_per_day: 3,
    workout_days: 4,
    workout_duration: 45
  },

  async init() {
    this.currentStep = 1;
    await this.fetchExistingProfile();
    this.render();
  },

  async fetchExistingProfile() {
    try {
      const data = await API.getProfile();
      if (data && data.profile) {
        const profile = data.profile;
        
        // Defensive array parsing
        if (profile.dietary_restrictions) {
          if (typeof profile.dietary_restrictions === 'string') {
            try { profile.dietary_restrictions = JSON.parse(profile.dietary_restrictions); } catch (e) { profile.dietary_restrictions = []; }
          }
        }
        if (!Array.isArray(profile.dietary_restrictions)) {
          profile.dietary_restrictions = [];
        }

        if (profile.equipment) {
          if (typeof profile.equipment === 'string') {
            try { profile.equipment = JSON.parse(profile.equipment); } catch (e) { profile.equipment = []; }
          }
        }
        if (!Array.isArray(profile.equipment)) {
          profile.equipment = [];
        }

        // Merge existing profile into formData
        this.formData = {
          ...this.formData,
          ...profile
        };
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  },

  render() {
    const container = document.getElementById('page-container');
    if (!container) return;

    container.innerHTML = `
      <div class="wizard-container">
        <!-- Wizard Progress Steps -->
        <div class="wizard-progress">
          ${this.renderProgressDots()}
        </div>

        <div class="glass-card">
          <form id="profile-wizard-form" onsubmit="event.preventDefault();">
            
            <!-- STEP 1: BASIC METRICS -->
            <div class="wizard-step ${this.currentStep === 1 ? 'active' : ''}" id="step-1">
              <div class="wizard-step-header">
                <h2>Physical Metrics</h2>
                <p>Let's start with your baseline physical characteristics</p>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="profile-age">Age (years)</label>
                  <input class="form-input" type="number" id="profile-age" min="10" max="100" required value="${this.formData.age || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="profile-gender">Gender</label>
                  <select class="form-select" id="profile-gender">
                    <option value="male" ${this.formData.gender === 'male' ? 'selected' : ''}>Male</option>
                    <option value="female" ${this.formData.gender === 'female' ? 'selected' : ''}>Female</option>
                    <option value="other" ${this.formData.gender === 'other' ? 'selected' : ''}>Other</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="profile-height">Height (cm)</label>
                  <input class="form-input" type="number" id="profile-height" min="100" max="250" required placeholder="e.g. 175" value="${this.formData.height || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="profile-weight">Weight (kg)</label>
                  <input class="form-input" type="number" id="profile-weight" min="30" max="300" required placeholder="e.g. 70" value="${this.formData.weight || ''}">
                </div>
              </div>
            </div>

            <!-- STEP 2: FITNESS GOALS -->
            <div class="wizard-step ${this.currentStep === 2 ? 'active' : ''}" id="step-2">
              <div class="wizard-step-header">
                <h2>Goals & Activity</h2>
                <p>Define your primary targets and weekly active routines</p>
              </div>

              <div class="form-group">
                <label class="form-label">Fitness Goal</label>
                <div class="option-cards">
                  <div class="option-card ${this.formData.fitness_goal === 'lose_weight' ? 'selected' : ''}" data-type="fitness_goal" data-value="lose_weight">
                    <span class="option-card-icon">🔥</span>
                    <span class="option-card-label">Lose Weight</span>
                  </div>
                  <div class="option-card ${this.formData.fitness_goal === 'maintain' ? 'selected' : ''}" data-type="fitness_goal" data-value="maintain">
                    <span class="option-card-icon">⚖️</span>
                    <span class="option-card-label">Maintain Fit</span>
                  </div>
                  <div class="option-card ${this.formData.fitness_goal === 'build_muscle' ? 'selected' : ''}" data-type="fitness_goal" data-value="build_muscle">
                    <span class="option-card-icon">💪</span>
                    <span class="option-card-label">Build Muscle</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-activity">Daily Activity Level</label>
                <select class="form-select" id="profile-activity">
                  <option value="sedentary" ${this.formData.activity_level === 'sedentary' ? 'selected' : ''}>Sedentary (Little to no exercise)</option>
                  <option value="light" ${this.formData.activity_level === 'light' ? 'selected' : ''}>Lightly Active (Light exercise 1-3 days/wk)</option>
                  <option value="moderate" ${this.formData.activity_level === 'moderate' ? 'selected' : ''}>Moderately Active (Moderate exercise 3-5 days/wk)</option>
                  <option value="active" ${this.formData.activity_level === 'active' ? 'selected' : ''}>Very Active (Hard exercise 6-7 days/wk)</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="profile-workout-days">Workouts per Week</label>
                  <select class="form-select" id="profile-workout-days">
                    ${[2,3,4,5,6,7].map(d => `<option value="${d}" ${this.formData.workout_days == d ? 'selected' : ''}>${d} Days</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="profile-workout-duration">Duration per Session</label>
                  <select class="form-select" id="profile-workout-duration">
                    <option value="15" ${this.formData.workout_duration == 15 ? 'selected' : ''}>15 min (Express)</option>
                    <option value="30" ${this.formData.workout_duration == 30 ? 'selected' : ''}>30 min</option>
                    <option value="45" ${this.formData.workout_duration == 45 ? 'selected' : ''}>45 min</option>
                    <option value="60" ${this.formData.workout_duration == 60 ? 'selected' : ''}>60 min</option>
                    <option value="90" ${this.formData.workout_duration == 90 ? 'selected' : ''}>90 min</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- STEP 3: NUTRITION & PREFERENCES -->
            <div class="wizard-step ${this.currentStep === 3 ? 'active' : ''}" id="step-3">
              <div class="wizard-step-header">
                <h2>Dietary Preferences</h2>
                <p>Help us customize a delicious and compliant meal plan</p>
              </div>

              <div class="form-group">
                <label class="form-label">Cultural Preference</label>
                <div class="option-cards">
                  <div class="option-card ${this.formData.cultural_preference === 'indian' ? 'selected' : ''}" data-type="cultural_preference" data-value="indian">
                    <span class="option-card-icon">🍛</span>
                    <span class="option-card-label">Indian</span>
                  </div>
                  <div class="option-card ${this.formData.cultural_preference === 'western' ? 'selected' : ''}" data-type="cultural_preference" data-value="western">
                    <span class="option-card-icon">🍔</span>
                    <span class="option-card-label">Western</span>
                  </div>
                  <div class="option-card ${this.formData.cultural_preference === 'asian' ? 'selected' : ''}" data-type="cultural_preference" data-value="asian">
                    <span class="option-card-icon">🥢</span>
                    <span class="option-card-label">Asian</span>
                  </div>
                  <div class="option-card ${this.formData.cultural_preference === 'mediterranean' ? 'selected' : ''}" data-type="cultural_preference" data-value="mediterranean">
                    <span class="option-card-icon">🥙</span>
                    <span class="option-card-label">Mediterranean</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Dietary Restrictions</label>
                <div class="checkbox-cards">
                  ${['vegetarian', 'vegan', 'gluten-free', 'lactose-free'].map(restriction => {
                    const isChecked = this.formData.dietary_restrictions.includes(restriction);
                    return `
                      <div class="checkbox-card ${isChecked ? 'checked' : ''}" data-restriction="${restriction}">
                        <div class="check-icon">${isChecked ? '✓' : ''}</div>
                        <span>${restriction.replace('-', ' ')}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="profile-meals-per-day">Meals per Day</label>
                <select class="form-select" id="profile-meals-per-day">
                  <option value="3" ${this.formData.meals_per_day == 3 ? 'selected' : ''}>3 Meals (Breakfast, Lunch, Dinner)</option>
                  <option value="4" ${this.formData.meals_per_day == 4 ? 'selected' : ''}>4 Meals (Add Snacking)</option>
                  <option value="5" ${this.formData.meals_per_day == 5 ? 'selected' : ''}>5 Meals (Bodybuilder split)</option>
                </select>
              </div>
            </div>

            <!-- STEP 4: BUDGET & EQUIPMENT -->
            <div class="wizard-step ${this.currentStep === 4 ? 'active' : ''}" id="step-4">
              <div class="wizard-step-header">
                <h2>Budget & Resources</h2>
                <p>We tailor workouts & ingredients to your available means</p>
              </div>

              <div class="form-group">
                <label class="form-label">Budget Level</label>
                <div class="option-cards">
                  <div class="option-card ${this.formData.budget === 'tight' ? 'selected' : ''}" data-type="budget" data-value="tight">
                    <span class="option-card-icon">💸</span>
                    <span class="option-card-label">Tight / Student</span>
                  </div>
                  <div class="option-card ${this.formData.budget === 'moderate' ? 'selected' : ''}" data-type="budget" data-value="moderate">
                    <span class="option-card-icon">💵</span>
                    <span class="option-card-label">Moderate</span>
                  </div>
                  <div class="option-card ${this.formData.budget === 'flexible' ? 'selected' : ''}" data-type="budget" data-value="flexible">
                    <span class="option-card-icon">💳</span>
                    <span class="option-card-label">Flexible</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Equipment Available</label>
                <div class="checkbox-cards">
                  ${[
                    { id: 'bodyweight', name: 'Bodyweight Only', icon: '🤸' },
                    { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️' },
                    { id: 'resistance_bands', name: 'Bands', icon: '🎗️' },
                    { id: 'full_gym', name: 'Full Gym Access', icon: '🏬' }
                  ].map(equip => {
                    const isChecked = this.formData.equipment.includes(equip.id);
                    return `
                      <div class="checkbox-card ${isChecked ? 'checked' : ''}" data-equipment="${equip.id}">
                        <div class="check-icon">${isChecked ? '✓' : ''}</div>
                        <span>${equip.icon} ${equip.name}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="wizard-actions">
              ${this.currentStep > 1 ? '<button type="button" class="btn btn-secondary" id="btn-wizard-prev">Back</button>' : ''}
              ${this.currentStep < this.totalSteps 
                ? '<button type="button" class="btn btn-primary" id="btn-wizard-next">Next Step</button>' 
                : '<button type="button" class="btn btn-primary" id="btn-wizard-submit">Complete Profile & Generate Plans</button>'}
            </div>

          </form>
        </div>
      </div>
    `;

    this.attachEventListeners();
  },

  renderProgressDots() {
    let html = '';
    for (let i = 1; i <= this.totalSteps; i++) {
      let status = '';
      if (i === this.currentStep) status = 'active';
      else if (i < this.currentStep) status = 'completed';

      html += `<div class="wizard-step-dot ${status}"></div>`;
      if (i < this.totalSteps) {
        let lineStatus = i < this.currentStep ? 'completed' : '';
        html += `<div class="wizard-step-line ${lineStatus}"></div>`;
      }
    }
    return html;
  },

  attachEventListeners() {
    // Collect step data helper
    const saveStepData = () => {
      if (this.currentStep === 1) {
        this.formData.age = parseInt(document.getElementById('profile-age').value) || '';
        this.formData.gender = document.getElementById('profile-gender').value;
        this.formData.height = parseFloat(document.getElementById('profile-height').value) || '';
        this.formData.weight = parseFloat(document.getElementById('profile-weight').value) || '';
      } else if (this.currentStep === 2) {
        this.formData.activity_level = document.getElementById('profile-activity').value;
        this.formData.workout_days = parseInt(document.getElementById('profile-workout-days').value);
        this.formData.workout_duration = parseInt(document.getElementById('profile-workout-duration').value);
      } else if (this.currentStep === 3) {
        this.formData.meals_per_day = parseInt(document.getElementById('profile-meals-per-day').value);
      }
    };

    // Option cards selection click handler
    document.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const val = card.dataset.value;
        
        // Remove active selection in sibling cards
        card.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        this.formData[type] = val;
      });
    });

    // Checkbox cards for dietary restrictions
    document.querySelectorAll('[data-restriction]').forEach(card => {
      card.addEventListener('click', () => {
        const restriction = card.dataset.restriction;
        const index = this.formData.dietary_restrictions.indexOf(restriction);
        if (index > -1) {
          this.formData.dietary_restrictions.splice(index, 1);
          card.classList.remove('checked');
          card.querySelector('.check-icon').innerText = '';
        } else {
          this.formData.dietary_restrictions.push(restriction);
          card.classList.add('checked');
          card.querySelector('.check-icon').innerText = '✓';
        }
      });
    });

    // Checkbox cards for equipment
    document.querySelectorAll('[data-equipment]').forEach(card => {
      card.addEventListener('click', () => {
        const equip = card.dataset.equipment;
        const index = this.formData.equipment.indexOf(equip);
        if (index > -1) {
          this.formData.equipment.splice(index, 1);
          card.classList.remove('checked');
          card.querySelector('.check-icon').innerText = '';
        } else {
          this.formData.equipment.push(equip);
          card.classList.add('checked');
          card.querySelector('.check-icon').innerText = '✓';
        }
      });
    });

    // Navigation buttons
    const prevBtn = document.getElementById('btn-wizard-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        saveStepData();
        this.currentStep--;
        this.render();
      });
    }

    const nextBtn = document.getElementById('btn-wizard-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Validation check for active inputs
        if (this.currentStep === 1) {
          const form = document.getElementById('profile-wizard-form');
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }
        }
        
        saveStepData();
        this.currentStep++;
        this.render();
      });
    }

    const submitBtn = document.getElementById('btn-wizard-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        saveStepData();
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');

        try {
          // 1. Save Profile to server
          await API.updateProfile(this.formData);

          // 2. Generate Workout Plan
          try {
            App.showToast('Profile updated! Generating AI workout...', 'info');
            await API.generateWorkout();
          } catch (workoutErr) {
            console.error('Workout generation failed:', workoutErr);
            App.showToast('Workout plan generation failed, but profile was saved.', 'warning');
          }

          // 3. Generate Diet Plan
          try {
            App.showToast('Creating AI diet plan...', 'info');
            await API.generateDiet();
          } catch (dietErr) {
            console.error('Diet generation failed:', dietErr);
            App.showToast('Diet plan generation failed, but profile was saved.', 'warning');
          }

          App.showToast('All setup complete! Welcome aboard.', 'success');

          // Refresh user cache
          try {
            const me = await API.getMe();
            if (me && me.user) {
              API.setUser(me.user);
            }
          } catch (meErr) {
            console.error('Failed to refresh user cache:', meErr);
          }

          // 4. Go to Dashboard
          window.location.hash = '#dashboard';
        } catch (err) {
          App.showToast(err.message || 'Failed to save profile. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-loading');
        }
      });
    }
  }
};
