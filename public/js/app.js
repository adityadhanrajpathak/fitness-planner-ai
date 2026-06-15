// ═══════════════════════════════════════════════════════════
// FITPLANNER AI APP ROUTER & APP SHELL
// Binds all pages, handles active views, toast alerts, loading states, and progress logging
// ═══════════════════════════════════════════════════════════

const App = {
  activePage: 'dashboard',

  async init() {
    this.attachGlobalListeners();
    this.checkAuthState();
    window.addEventListener('hashchange', () => this.handleRouting());
  },

  checkAuthState() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }

    setTimeout(async () => {
      try {
        const isLoggedIn = API.isLoggedIn();
        const authContainer = document.getElementById('auth-container');
        const appShell = document.getElementById('app');

        if (!isLoggedIn) {
          // Clear templates
          authContainer.style.display = 'flex';
          appShell.style.display = 'none';

          // Check if hash is #register, otherwise default to #login
          const hash = window.location.hash;
          if (hash === '#register') {
            Auth.switchView('register');
          } else {
            window.location.hash = '#login';
            Auth.switchView('login');
          }
        } else {
          authContainer.style.display = 'none';
          appShell.style.display = 'flex';

          // Setup User details on Sidebar & Mobile drawer
          const user = API.getUser();
          if (user) {
            const firstChar = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            const userAvatar   = document.getElementById('user-avatar');
            const mobileAvatar = document.getElementById('mobile-avatar');
            const userName     = document.getElementById('user-name');
            const userEmail    = document.getElementById('user-email');

            if (userAvatar)   userAvatar.innerText   = firstChar;
            if (mobileAvatar) mobileAvatar.innerText = firstChar;
            if (userName)     userName.innerText     = user.name;
            if (userEmail)    userEmail.innerText    = user.email;

            // Show Admin nav link only for admins
            const adminNavItem = document.getElementById('nav-admin-item');
            if (adminNavItem) {
              adminNavItem.style.display = user.is_admin === 1 ? 'block' : 'none';
            }
          }

          // Initialize routing
          this.handleRouting();
        }
      } catch (err) {
        console.error('Error during checkAuthState:', err);
        this.showToast('Initialization error: ' + err.message, 'error');
      } finally {
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
        }
      }
    }, 500);
  },

  handleRouting() {
    try {
      const hash = window.location.hash || '#dashboard';
      
      if (hash === '#login' || hash === '#register') {
        if (API.isLoggedIn()) {
          window.location.hash = '#dashboard';
          return;
        }
        const authContainer = document.getElementById('auth-container');
        const appShell = document.getElementById('app');
        if (authContainer) authContainer.style.display = 'flex';
        if (appShell) appShell.style.display = 'none';
        Auth.switchView(hash === '#register' ? 'register' : 'login');
        return;
      }

      if (!API.isLoggedIn()) {
        window.location.hash = '#login';
        return;
      }

      const page = hash.replace('#', '');
      this.activePage = page;

      // Highlight navigation link
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === page) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Mobile overlay close on navigation
      const overlay = document.getElementById('sidebar-overlay');
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }

      // Call sub page inits
      switch (page) {
        case 'dashboard':
          Dashboard.init();
          break;
        case 'workout':
          Workout.init();
          break;
        case 'diet':
          Diet.init();
          break;
        case 'profile':
          Profile.init();
          break;
        case 'progress':
          this.initProgressView();
          break;
        case 'admin': {
          const user = API.getUser();
          if (!user || user.is_admin !== 1) {
            this.showToast('Access denied. Admin only.', 'error');
            window.location.hash = '#dashboard';
            return;
          }
          Admin.init();
          break;
        }
        default:
          window.location.hash = '#dashboard';
      }
    } catch (err) {
      console.error('Routing error:', err);
      this.showToast('Routing error: ' + err.message, 'error');
    }
  },

  attachGlobalListeners() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn && sidebar && overlay) {
      const toggle = () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
      };
      menuBtn.addEventListener('click', toggle);
      overlay.addEventListener('click', toggle);
    }

    // Sidebar collapse toggle
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        API.logout();
        this.showToast('Logged out successfully.', 'info');
        this.checkAuthState();
      });
    }

    // Lamp interaction — click lamp to reveal login form
    document.addEventListener('click', (e) => {
      const lampScene = e.target.closest('.lamp-scene');
      if (!lampScene) return;

      const beam = document.querySelector('.lamp-light-beam');
      const card = document.querySelector('.auth-card');
      const frame = document.querySelector('.lamp-login-frame');

      // Toggle light beam pull animation
      const pull = document.querySelector('.lamp-cord-pull');
      if (pull) {
        pull.style.transform = 'translateY(8px)';
        setTimeout(() => { pull.style.transform = ''; }, 200);
      }

      // If card is already revealed, do nothing (just cord pull animation)
      if (frame && frame.classList.contains('revealed')) return;

      // Turn on the light
      if (beam) {
        beam.classList.remove('off');
        beam.classList.add('on');
      }

      // Reveal the login card
      if (frame) {
        frame.classList.add('revealed');
      }
    });
  },

  // ─── Toast Notifications ─────────────────────────────────
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  },

  // ─── Progress Logging SPA View ───────────────────────────
  async initProgressView() {
    const container = document.getElementById('page-container');
    if (!container) return;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="text-pink">📈 Progress Tracker & Weight Log</h1>
        <p class="subtitle">Stay consistent. Log metrics regularly to fine-tune your fitness AI algorithms.</p>
      </div>

      <div class="content-grid-3">
        <!-- Log Metrics Form -->
        <div class="glass-card full-width">
          <h3 class="section-title">✍️ Daily Metrics Tracker</h3>
          <form id="progress-log-form" style="display:flex; flex-direction:column; gap:1rem;">
            <div class="progress-form">
              <div class="form-group">
                <label class="form-label" for="prog-date">Date</label>
                <input class="form-input" type="date" id="prog-date" required value="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="form-group">
                <label class="form-label" for="prog-weight">Weight (kg)</label>
                <input class="form-input" type="number" step="0.1" id="prog-weight" placeholder="e.g. 70.4">
              </div>
              <div class="form-group">
                <label class="form-label" for="prog-calories">Calories Consumed</label>
                <input class="form-input" type="number" id="prog-calories" placeholder="e.g. 2100">
              </div>
              <div class="form-group">
                <label class="form-label" for="prog-water">Water Intake (L)</label>
                <input class="form-input" type="number" step="0.1" id="prog-water" placeholder="e.g. 3.2">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="prog-notes">Training Notes / Energy levels</label>
              <input class="form-input" type="text" id="prog-notes" placeholder="e.g. Felt highly energetic, completed full squat sets.">
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <input type="checkbox" id="prog-workout-completed" style="width:18px; height:18px; cursor:pointer;">
              <label for="prog-workout-completed" style="font-size:0.85rem; font-weight:600; cursor:pointer;">I completed today's scheduled workout!</label>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-progress">Save Today's Progress</button>
          </form>
        </div>
      </div>

      <div class="content-grid">
        <!-- History Table -->
        <div class="glass-card" style="grid-column: 1 / -1;">
          <h3 class="section-title">📊 Progress History logs</h3>
          <div style="overflow-x:auto;">
            <table class="progress-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Workout Done</th>
                  <th>Calories (kcal)</th>
                  <th>Water (L)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody id="progress-history-tbody">
                <tr><td colspan="6" class="text-center">Loading progress data...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Fetch and populate history
    await this.fetchProgressHistory();

    // Attach submit listener
    const form = document.getElementById('progress-log-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-save-progress');
      btn.disabled = true;
      btn.classList.add('btn-loading');

      try {
        const payload = {
          date: document.getElementById('prog-date').value,
          weight: parseFloat(document.getElementById('prog-weight').value) || null,
          workout_completed: document.getElementById('prog-workout-completed').checked,
          calories_consumed: parseInt(document.getElementById('prog-calories').value) || null,
          water_intake: parseFloat(document.getElementById('prog-water').value) || null,
          notes: document.getElementById('prog-notes').value.trim() || null
        };

        await API.logProgress(payload);
        this.showToast('Daily progress logged successfully!', 'success');
        
        // Clear or refresh profile in local cache if weight was updated
        if (payload.weight) {
          const profData = await API.getProfile();
          if (profData && profData.profile) {
            // Update cached weight
            profData.profile.weight = payload.weight;
          }
        }

        await this.fetchProgressHistory();
        form.reset();
        document.getElementById('prog-date').value = new Date().toISOString().split('T')[0];
      } catch (err) {
        this.showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.classList.remove('btn-loading');
      }
    };
  },

  async fetchProgressHistory() {
    const tbody = document.getElementById('progress-history-tbody');
    if (!tbody) return;

    try {
      const data = await API.getProgress();
      const logs = data && data.progress ? data.progress : [];

      if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No logs recorded yet. Start tracking above!</td></tr>`;
        return;
      }

      // Sort logs by date descending
      const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

      tbody.innerHTML = sortedLogs.map(log => {
        const d = new Date(log.date).toLocaleDateString('en-US', { dateStyle: 'medium' });
        const workoutBadge = log.workout_completed 
          ? `<span class="muscle-badge legs" style="padding:0.1rem 0.4rem; font-size:0.65rem;">COMPLETED</span>` 
          : `<span class="text-muted">No</span>`;
        return `
          <tr>
            <td><strong>${d}</strong></td>
            <td>${log.weight ? `${log.weight} kg` : '—'}</td>
            <td>${workoutBadge}</td>
            <td>${log.calories_consumed ? `${log.calories_consumed} kcal` : '—'}</td>
            <td>${log.water_intake ? `${log.water_intake} L` : '—'}</td>
            <td style="max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${log.notes || ''}">${log.notes || '—'}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red">Failed to load history: ${err.message}</td></tr>`;
    }
  }
};

// Initialize App on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => App.init());
