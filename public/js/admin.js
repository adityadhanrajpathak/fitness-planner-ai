const Admin = {
  async init() {
    const container = document.getElementById('page-container');
    if (!container) return;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="text-pink">🛡️ Administrator Dashboard</h1>
        <p class="subtitle">Platform overview and user management.</p>
      </div>

      <!-- Stats Overview -->
      <div class="content-grid-3" id="admin-stats-container">
        <div class="glass-card text-center" style="padding: 2rem;">Loading stats...</div>
      </div>

      <!-- Users Table -->
      <div class="content-grid">
        <div class="glass-card" style="grid-column: 1 / -1;">
          <h3 class="section-title">👥 Registered Users</h3>
          <div style="overflow-x:auto;">
            <table class="progress-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="admin-users-tbody">
                <tr><td colspan="5" class="text-center">Loading users...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    await this.loadStats();
    await this.loadUsers();
  },

  async loadStats() {
    const container = document.getElementById('admin-stats-container');
    if (!container) return;

    try {
      const { stats } = await API.getAdminStats();
      
      container.innerHTML = `
        <div class="glass-card text-center stat-card">
          <div class="stat-icon" style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: var(--accent-cyan);">${stats.totalUsers}</div>
          <div class="stat-label text-muted">Total Users</div>
        </div>
        <div class="glass-card text-center stat-card">
          <div class="stat-icon" style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔥</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: var(--accent-pink);">${stats.activeWorkoutPlans}</div>
          <div class="stat-label text-muted">Active Workout Plans</div>
        </div>
        <div class="glass-card text-center stat-card">
          <div class="stat-icon" style="font-size: 2.5rem; margin-bottom: 0.5rem;">📈</div>
          <div class="stat-value" style="font-size: 2rem; font-weight: bold; color: var(--accent-green);">${stats.totalProgressLogs}</div>
          <div class="stat-label text-muted">Total Progress Logs</div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="glass-card text-center text-red" style="padding: 2rem;">Failed to load stats: ${err.message}</div>`;
    }
  },

  async loadUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    const currentUser = API.getUser();

    try {
      const { users } = await API.getAdminUsers();

      if (!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No users found.</td></tr>`;
        return;
      }

      tbody.innerHTML = users.map(user => {
        const joined = new Date(user.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' });
        const isAdmin = user.is_admin === 1;
        const isSelf  = currentUser && user.id === currentUser.id;

        const roleBadge = isAdmin
          ? `<span style="padding:0.15rem 0.5rem; font-size:0.65rem; border-radius:6px; background:var(--accent-pink); color:#fff; font-weight:700;">ADMIN</span>`
          : `<span style="padding:0.15rem 0.5rem; font-size:0.65rem; border-radius:6px; background:rgba(255,255,255,0.1); color:var(--text-muted); font-weight:600;">USER</span>`;

        const actionBtn = isSelf
          ? `<span style="font-size:0.7rem; color:var(--text-muted);">— you —</span>`
          : isAdmin
            ? `<button onclick="Admin.demote(${user.id})" style="padding:0.25rem 0.7rem; font-size:0.7rem; border-radius:6px; background:rgba(248,113,113,0.15); border:1px solid rgba(248,113,113,0.4); color:#f87171; cursor:pointer;">Demote</button>`
            : `<button onclick="Admin.promote(${user.id})" style="padding:0.25rem 0.7rem; font-size:0.7rem; border-radius:6px; background:rgba(52,211,153,0.15); border:1px solid rgba(52,211,153,0.4); color:#34d399; cursor:pointer;">Make Admin</button>`;

        return `
          <tr>
            <td>#${user.id}</td>
            <td><strong>${user.name}</strong></td>
            <td style="color:var(--text-muted); font-size:0.85rem;">${user.email}</td>
            <td>${roleBadge}</td>
            <td style="color:var(--text-muted); font-size:0.8rem;">${joined}</td>
            <td>${actionBtn}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red">Failed to load users: ${err.message}</td></tr>`;
    }
  },

  async promote(userId) {
    try {
      await API.promoteUser(userId);
      App.showToast('User promoted to admin!', 'success');
      await this.loadUsers();
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  async demote(userId) {
    try {
      await API.demoteUser(userId);
      App.showToast('User demoted to regular user.', 'info');
      await this.loadUsers();
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  }
};

window.Admin = Admin;

