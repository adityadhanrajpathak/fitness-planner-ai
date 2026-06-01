// ═══════════════════════════════════════════════════════════
// DASHBOARD CONTROLLER
// Handles active plan overview, stats, BMI calculation, and canvas chart
// ═══════════════════════════════════════════════════════════

const Dashboard = {
  quotes: [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Success isn't always about greatness. It's about consistency.",
    "Good things come to those who sweat.",
    "Action is the foundational key to all success."
  ],

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
        <div class="skeleton-text skeleton short"></div>
      </div>
      <div class="stats-grid">
        <div class="skeleton-card skeleton"></div>
        <div class="skeleton-card skeleton"></div>
        <div class="skeleton-card skeleton"></div>
        <div class="skeleton-card skeleton"></div>
      </div>
      <div class="content-grid">
        <div class="skeleton-card skeleton" style="height:250px;"></div>
        <div class="skeleton-card skeleton" style="height:250px;"></div>
      </div>
    `;
  },

  async fetchAndRender() {
    const container = document.getElementById('page-container');
    if (!container) return;

    try {
      // 1. Fetch Profile, Analysis, current Workout, and Diet plans
      const profileData = await API.getProfile();
      if (!profileData || !profileData.profile) {
        // Redirect to profile setup
        window.location.hash = '#profile';
        return;
      }

      let analysisData = { analysis: null };
      let workoutData = { plan: null };
      let dietData = { plan: null };
      let progressData = { progress: [] };

      try { analysisData = await API.getAnalysis(); } catch (e) { console.warn('Analysis fetch failed:', e); }
      try { workoutData = await API.getCurrentWorkout(); } catch (e) { console.warn('Workout fetch failed:', e); }
      try { dietData = await API.getCurrentDiet(); } catch (e) { console.warn('Diet fetch failed:', e); }
      try { progressData = await API.getProgress(); } catch (e) { console.warn('Progress fetch failed:', e); }

      const user = API.getUser();
      const name = user ? user.name : 'Athlete';
      const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

      const profile = profileData.profile;
      const analysis = analysisData.analysis || {
        bmi: '—', bmiCategory: 'N/A', bmr: '—', tdee: '—',
        caloricTarget: '—', macros: { protein: 0, carbs: 0, fat: 0 }
      };

      // Determine today's workout details
      let todayWorkoutText = 'Rest Day';
      if (workoutData && workoutData.plan && workoutData.plan.plan) {
        // Workout days are labeled 'Day 1' through 'Day 7'; map today's weekday to an index
        const dayOfWeek = new Date().getDay(); // 0=Sunday, 1=Monday...
        // Map so Monday=0 (Day 1) through Sunday=6 (Day 7)
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const dayPlan = workoutData.plan.plan[dayIndex];
        if (dayPlan && !dayPlan.isRest) {
          todayWorkoutText = `${dayPlan.focus} (${dayPlan.exercises.length} Exercises)`;
        }
      }

      // Determine today's meal summaries
      let mealSummaryText = 'No active meal plan';
      if (dietData && dietData.plan) {
        const dailyCal = (dietData.plan.targets && dietData.plan.targets.dailyCalories) ||
                         (dietData.plan.weeklyAverages && dietData.plan.weeklyAverages.calories) || '—';
        const mealsCount = (dietData.plan.metadata && dietData.plan.metadata.mealsPerDay) || profile.meals_per_day || 3;
        mealSummaryText = `${dailyCal} kcal • ${mealsCount} meals generated`;
      }

      container.innerHTML = `
        <!-- Page Header -->
        <div class="page-header">
          <h1><span class="greeting-emoji">👋</span>Welcome back, ${name}!</h1>
          <p class="subtitle">Here's your progress overview and routine for today.</p>
        </div>

        <!-- Quote Card -->
        <div class="quote-card">
          <p class="quote-text">"${quote}"</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <!-- Stat 1: Weight -->
          <div class="stat-card">
            <div class="stat-icon cyan">⚖️</div>
            <div>
              <div class="stat-value">${profile.weight} kg</div>
              <div class="stat-label">Current Weight</div>
            </div>
          </div>
          <!-- Stat 2: BMI -->
          <div class="stat-card">
            <div class="stat-icon purple">📊</div>
            <div>
              <div class="stat-value">${analysis.bmi || '—'}</div>
              <div class="stat-label">BMI (${analysis.bmiCategory || 'N/A'})</div>
            </div>
          </div>
          <!-- Stat 3: Target Calories -->
          <div class="stat-card">
            <div class="stat-icon green">⚡</div>
            <div>
              <div class="stat-value">${analysis.caloricTarget || analysis.targetCalories || '—'} kcal</div>
              <div class="stat-label">Calorie Goal</div>
            </div>
          </div>
          <!-- Stat 4: Water Goal -->
          <div class="stat-card">
            <div class="stat-icon pink">💧</div>
            <div>
              <div class="stat-value">3.0 Liters</div>
              <div class="stat-label">Daily Water Target</div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          
          <!-- BMI & Calorie Distribution -->
          <div class="glass-card">
            <h3 class="section-title">📊 Health Profile</h3>
            
            <p class="mb-1"><strong>BMI Status:</strong> ${analysis.bmiCategory}</p>
            <div class="bmi-gauge">
              <div class="bmi-gauge-fill" id="bmi-gauge-fill" style="width: 0%; background: var(--gradient-primary);"></div>
            </div>
            <div class="bmi-indicator">
              <span>Underweight (<18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25+)</span>
            </div>

            <div class="mt-3">
              <p class="mb-1"><strong>Caloric Budgets:</strong></p>
              <ul class="nav-links" style="padding:0; gap:0.25rem;">
                <li style="font-size:0.85rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass);">
                  <span>Basal Metabolic Rate (BMR):</span> 
                  <strong class="text-cyan" style="float:right;">${analysis.bmr || '—'} kcal</strong>
                </li>
                <li style="font-size:0.85rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass);">
                  <span>Daily Expenditure (TDEE):</span> 
                  <strong class="text-purple" style="float:right;">${analysis.tdee || '—'} kcal</strong>
                </li>
                <li style="font-size:0.85rem; padding: 0.5rem 0;">
                  <span>Goal Calorie Budget:</span> 
                  <strong class="text-green" style="float:right;">${analysis.caloricTarget || analysis.targetCalories || '—'} kcal</strong>
                </li>
              </ul>
            </div>
          </div>

          <!-- Macros Distribution -->
          <div class="glass-card">
            <h3 class="section-title">🥗 Daily Macros Distribution</h3>
            <div style="display:flex; justify-content:space-around; align-items:center; height:100%; min-height:180px;">
              <div class="progress-ring-container">
                <svg class="progress-ring" width="120" height="120">
                  <circle class="progress-ring-bg" cx="60" cy="60" r="50" stroke-width="8"></circle>
                  <circle class="progress-ring-fill" id="macro-ring-protein" cx="60" cy="60" r="50" stroke-width="8" stroke="var(--accent-red)" stroke-dasharray="314.15" stroke-dashoffset="314.15"></circle>
                </svg>
                <div class="progress-ring-text">
                  <span class="progress-ring-value">${analysis.macros.protein}g</span>
                  <span class="progress-ring-label">Protein</span>
                </div>
              </div>

              <div class="progress-ring-container">
                <svg class="progress-ring" width="120" height="120">
                  <circle class="progress-ring-bg" cx="60" cy="60" r="50" stroke-width="8"></circle>
                  <circle class="progress-ring-fill" id="macro-ring-carbs" cx="60" cy="60" r="50" stroke-width="8" stroke="var(--accent-cyan)" stroke-dasharray="314.15" stroke-dashoffset="314.15"></circle>
                </svg>
                <div class="progress-ring-text">
                  <span class="progress-ring-value">${analysis.macros.carbs}g</span>
                  <span class="progress-ring-label">Carbs</span>
                </div>
              </div>

              <div class="progress-ring-container">
                <svg class="progress-ring" width="120" height="120">
                  <circle class="progress-ring-bg" cx="60" cy="60" r="50" stroke-width="8"></circle>
                  <circle class="progress-ring-fill" id="macro-ring-fats" cx="60" cy="60" r="50" stroke-width="8" stroke="var(--accent-orange)" stroke-dasharray="314.15" stroke-dashoffset="314.15"></circle>
                </svg>
                <div class="progress-ring-text">
                  <span class="progress-ring-value">${analysis.macros.fat}g</span>
                  <span class="progress-ring-label">Fats</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Row Content Grid -->
        <div class="content-grid">
          <!-- Today's Schedule Overview -->
          <div class="glass-card">
            <h3 class="section-title">📅 Today's Plan</h3>
            <ul style="display:flex; flex-direction:column; gap:0.75rem;">
              <li class="exercise-card warmup" style="margin:0; padding:1rem; cursor:pointer;" onclick="window.location.hash='#workout'">
                <div class="exercise-num">💪</div>
                <div class="exercise-info">
                  <div class="exercise-name">Today's Workout</div>
                  <div class="exercise-instructions">${todayWorkoutText}</div>
                </div>
                <div class="text-cyan">View Plan →</div>
              </li>
              <li class="exercise-card cooldown" style="margin:0; padding:1rem; cursor:pointer;" onclick="window.location.hash='#diet'">
                <div class="exercise-num">🥗</div>
                <div class="exercise-info">
                  <div class="exercise-name">Today's Meals</div>
                  <div class="exercise-instructions">${mealSummaryText}</div>
                </div>
                <div class="text-green">View Diet →</div>
              </li>
            </ul>

            <div class="mt-3">
              <h4 style="font-size:0.9rem; font-weight:600; margin-bottom:0.5rem;">⚡ Quick Actions</h4>
              <div class="quick-actions">
                <button class="quick-action-btn" onclick="window.location.hash='#progress'">📈 Log Weight Progress</button>
                <button class="quick-action-btn" onclick="Dashboard.regenerateAllPlans()">🔄 Full Regeneration</button>
              </div>
            </div>
          </div>

          <!-- Canvas weight chart -->
          <div class="glass-card">
            <h3 class="section-title">📈 Weight Log Trend</h3>
            <div class="progress-chart">
              <canvas class="chart-canvas" id="dashboard-weight-canvas"></canvas>
            </div>
          </div>
        </div>
      `;

      // Trigger animations
      this.animateBmiGauge(analysis.bmi);
      this.animateMacroRings();
      this.drawWeightChart(progressData ? progressData.progress : []);

    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  animateBmiGauge(bmi) {
    const fill = document.getElementById('bmi-gauge-fill');
    if (!fill) return;

    // Normal range is roughly 15 to 35 on gauge
    let pct = ((bmi - 15) / (35 - 15)) * 100;
    if (pct < 5) pct = 5;
    if (pct > 100) pct = 100;

    setTimeout(() => {
      fill.style.width = `${pct}%`;
    }, 100);
  },

  animateMacroRings() {
    // Show smooth progress animation for protein, carbs, fat rings
    // In this MVP, we animate them to standard full circles (100%) or predefined offsets
    const pRing = document.getElementById('macro-ring-protein');
    const cRing = document.getElementById('macro-ring-carbs');
    const fRing = document.getElementById('macro-ring-fats');

    const totalCircum = 2 * Math.PI * 50; // 314.15

    setTimeout(() => {
      if (pRing) pRing.style.strokeDashoffset = totalCircum * (1 - 0.7); // protein to 70%
      if (cRing) cRing.style.strokeDashoffset = totalCircum * (1 - 0.85); // carbs to 85%
      if (fRing) fRing.style.strokeDashoffset = totalCircum * (1 - 0.55); // fats to 55%
    }, 200);
  },

  drawWeightChart(logs) {
    const canvas = document.getElementById('dashboard-weight-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    canvas.width = width;
    canvas.height = height;

    // Filter logs that have weight
    const weightLogs = (logs || [])
      .filter(l => l.weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 weights

    if (weightLogs.length === 0) {
      // Draw empty message
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No weight log data available. Click "Log Weight" to start.', width / 2, height / 2);
      return;
    }

    const weights = weightLogs.map(l => l.weight);
    const labels = weightLogs.map(l => {
      const d = new Date(l.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const maxW = Math.max(...weights) + 2;
    const minW = Math.min(...weights) - 2;
    const range = maxW - minW || 10;

    const paddingX = 40;
    const paddingY = 30;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = paddingY + ((height - 2 * paddingY) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingX, y);
      ctx.lineTo(width - paddingX, y);
      ctx.stroke();

      // Weight label on left
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      const val = maxW - (range / 4) * i;
      ctx.fillText(`${val.toFixed(1)}kg`, paddingX - 6, y + 3);
    }

    // Plot data points
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const points = [];
    const stepX = (width - 2 * paddingX) / (weightLogs.length - 1 || 1);

    weightLogs.forEach((log, index) => {
      const x = paddingX + index * stepX;
      const y = height - paddingY - ((log.weight - minW) / range) * (height - 2 * paddingY);
      points.push({ x, y, weight: log.weight, label: labels[index] });

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw gradient area below line
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = grad;
    ctx.lineTo(points[points.length - 1].x, height - paddingY);
    ctx.lineTo(points[0].x, height - paddingY);
    ctx.closePath();
    ctx.fill();

    // Draw data circles and labels
    points.forEach((pt) => {
      ctx.fillStyle = '#7b2dff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
      ctx.stroke();

      // Value label
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.weight}k`, pt.x, pt.y - 10);

      // Date labels at bottom
      ctx.fillStyle = '#64748b';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(pt.label, pt.x, height - paddingY + 15);
    });
  },

  async regenerateAllPlans() {
    if (!confirm('Are you sure you want to regenerate both workout and diet plans? This will overwrite active plans.')) return;

    App.showToast('Regenerating workout plan...', 'info');
    try {
      await API.generateWorkout();
      App.showToast('Regenerating diet plan...', 'info');
      await API.generateDiet();
      App.showToast('Plans regenerated successfully!', 'success');
      await this.fetchAndRender();
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  }
};
