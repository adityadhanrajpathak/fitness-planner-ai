// ═══════════════════════════════════════════════════════════
// WORKOUT CONTROLLER
// Handles workout schedule display, tabs, rest timers, and completion
// ═══════════════════════════════════════════════════════════

const Workout = {
  activeDay: '',
  timerInterval: null,

  async init() {
    this.renderSkeleton();
    await this.fetchAndRender();
  },

  renderSkeleton() {
    const container = document.getElementById('page-container');
    if (!container) return;

    container.innerHTML = `
      <div class="page-header">
        <div class="skeleton-title skeleton"></div>
      </div>
      <div class="day-tabs">
        <div class="skeleton" style="width:70px; height:35px; border-radius:8px;"></div>
        <div class="skeleton" style="width:70px; height:35px; border-radius:8px;"></div>
        <div class="skeleton" style="width:70px; height:35px; border-radius:8px;"></div>
        <div class="skeleton" style="width:70px; height:35px; border-radius:8px;"></div>
      </div>
      <div class="skeleton-card skeleton"></div>
      <div class="skeleton-card skeleton"></div>
      <div class="skeleton-card skeleton"></div>
    `;
  },

  async fetchAndRender() {
    const container = document.getElementById('page-container');
    if (!container) return;

    try {
      const data = await API.getCurrentWorkout();
      if (!data || !data.plan) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🏋️</div>
            <h2 class="empty-title">No Workout Plan Active</h2>
            <p class="empty-description">You haven't generated a workout plan yet. Complete your profile to generate a customized routine!</p>
            <button class="btn btn-primary" onclick="window.location.hash='#profile'">Setup Profile & Plans</button>
          </div>
        `;
        return;
      }

      const plan = data.plan;

      // Map today's weekday to a Day index (Monday=Day 1 ... Sunday=Day 7)
      const dayOfWeek = new Date().getDay(); // 0=Sunday
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday=0
      const todayDayName = `Day ${dayIndex + 1}`;

      // Default active day to today, or first day in schedule
      if (!this.activeDay) {
        const hasToday = plan.plan.some(s => s.day === todayDayName);
        this.activeDay = hasToday ? todayDayName : plan.plan[0].day;
      }

      const currentDayPlan = plan.plan.find(s => s.day === this.activeDay);

      container.innerHTML = `
        <!-- Header -->
        <div class="plan-header">
          <div>
            <h1 class="text-cyan">💪 Custom Workout Plan</h1>
            <div class="plan-meta mt-1">
              <span class="meta-tag">🎯 Goal: ${plan.metadata.goal.replace('_', ' ')}</span>
              <span class="meta-tag">⚡ Level: ${plan.metadata.fitnessLevel}</span>
              <span class="meta-tag">⏱️ Duration: ${plan.metadata.targetDuration}m / Session</span>
            </div>
          </div>
          <button class="btn btn-secondary" id="btn-regenerate-workout">🔄 Regenerate Plan</button>
        </div>

        <!-- Day Navigation Tabs -->
        <div class="day-tabs">
          ${plan.plan.map(s => {
            const isActive = s.day === this.activeDay ? 'active' : '';
            const isRest = s.isRest ? 'rest' : '';
            return `
              <div class="day-tab ${isActive} ${isRest}" data-day="${s.day}">
                ${s.day.slice(0, 3)} ${s.isRest ? '💤' : '🏋️'}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Selected Day Plan -->
        <div id="day-plan-content">
          ${this.renderDayPlan(currentDayPlan)}
        </div>

        <!-- Timer Overlay Modal -->
        <div id="timer-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; align-items:center; justify-content:center;">
          <div class="glass-card text-center" style="max-width:320px; width:100%; padding:2.5rem;">
            <h2 style="font-family:var(--font-display); margin-bottom:1rem;">⏱️ Rest Period</h2>
            <div style="font-size:4rem; font-weight:800; font-family:var(--font-display); background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:1.5rem;" id="timer-countdown">60</div>
            <p class="text-muted mb-3">Catch your breath. Next set is about to start!</p>
            <button class="btn btn-danger" style="width:100%;" id="btn-skip-timer">Skip Rest</button>
          </div>
        </div>
      `;

      this.attachEventListeners(plan);

    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  renderDayPlan(dayPlan) {
    if (!dayPlan) return '<p>No details found for this day.</p>';

    if (dayPlan.isRest) {
      return `
        <div class="rest-day-card">
          <div class="rest-day-icon">💤</div>
          <h2 class="rest-day-title">Rest Day — Recovery is Key</h2>
          <p class="text-muted">No strenuous activities scheduled. Focus on hydration, stretch, and light movement.</p>
          <ul class="rest-tips">
            <li>Drink at least 3 liters of water today</li>
            <li>Get 8 hours of quality sleep tonight</li>
            <li>Do 10-15 minutes of light static stretching</li>
            <li>Eat balanced nutrient-rich foods to fuel muscle recovery</li>
          </ul>
        </div>
      `;
    }

    return `
      <div class="day-summary">
        <div class="day-summary-item">Routine: <strong>${dayPlan.focus}</strong></div>
        <div class="day-summary-item">Exercises: <strong>${dayPlan.exercises.length} total</strong></div>
      </div>

      <div class="exercise-list">
        ${dayPlan.exercises.map((ex, index) => {
          // Dynamic category badging
          const cat = (ex.muscleGroup || 'cardio').toLowerCase();
          return `
            <div class="exercise-card" id="ex-card-${index}">
              <div class="exercise-num">${index + 1}</div>
              <div class="exercise-info">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="exercise-name">${ex.name}</span>
                  <span class="muscle-badge ${cat}">${ex.muscleGroup || 'Cardio'}</span>
                </div>
                <div class="exercise-instructions" title="${ex.instructions}">${ex.instructions}</div>
              </div>
              <div class="exercise-stats">
                <div class="exercise-stat" style="margin-right:1rem;">
                  <span class="exercise-stat-value">${ex.sets}</span>
                  <span class="exercise-stat-label">Sets</span>
                </div>
                <div class="exercise-stat" style="margin-right:1rem;">
                  <span class="exercise-stat-value">${ex.reps}</span>
                  <span class="exercise-stat-label">Reps</span>
                </div>
                ${ex.rest ? `
                  <button class="btn btn-icon btn-timer" data-rest="${ex.rest}" title="Start Rest Timer">
                    ⏱️
                  </button>
                ` : ''}
              </div>
              <input type="checkbox" class="ex-check" data-idx="${index}" style="width:20px; height:20px; cursor:pointer; accent-color:var(--accent-cyan);">
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  attachEventListeners(plan) {
    // Tab switching
    document.querySelectorAll('.day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const day = tab.dataset.day;
        this.activeDay = day;
        this.fetchAndRender();
      });
    });

    // Checkbox exercise completes
    document.querySelectorAll('.ex-check').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = chk.dataset.idx;
        const card = document.getElementById(`ex-card-${idx}`);
        if (chk.checked) {
          card.style.opacity = '0.5';
          card.style.textDecoration = 'line-through';
          App.showToast('Exercise marked completed!', 'success');
        } else {
          card.style.opacity = '1';
          card.style.textDecoration = 'none';
        }
      });
    });

    // Rest timer buttons
    document.querySelectorAll('.btn-timer').forEach(btn => {
      btn.addEventListener('click', () => {
        const seconds = parseInt(btn.dataset.rest) || 60;
        this.startRestTimer(seconds);
      });
    });

    // Plan regeneration
    const regenBtn = document.getElementById('btn-regenerate-workout');
    if (regenBtn) {
      regenBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to regenerate your workout routine?')) return;
        
        regenBtn.disabled = true;
        regenBtn.classList.add('btn-loading');
        try {
          await API.generateWorkout();
          App.showToast('New AI Workout Plan Generated!', 'success');
          await this.fetchAndRender();
        } catch (err) {
          App.showToast(err.message, 'error');
        } finally {
          regenBtn.disabled = false;
          regenBtn.classList.remove('btn-loading');
        }
      });
    }
  },

  startRestTimer(seconds) {
    const modal = document.getElementById('timer-modal');
    const countdown = document.getElementById('timer-countdown');
    const skipBtn = document.getElementById('btn-skip-timer');

    if (!modal || !countdown || !skipBtn) return;

    modal.style.display = 'flex';
    countdown.innerText = seconds;

    let remaining = seconds;
    clearInterval(this.timerInterval);

    const closeTimer = () => {
      clearInterval(this.timerInterval);
      modal.style.display = 'none';
    };

    this.timerInterval = setInterval(() => {
      remaining--;
      countdown.innerText = remaining;

      if (remaining <= 0) {
        closeTimer();
        App.showToast("Rest time's up! Back to training! 🏋️", 'info');
      }
    }, 1000);

    skipBtn.onclick = () => {
      closeTimer();
    };
  }
};
