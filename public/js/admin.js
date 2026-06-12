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

    try {
      const { users } = await API.getAdminUsers();

      if (!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>`;
        return;
      }

      tbody.innerHTML = users.map(user => {
        const joined = new Date(user.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' });
        const roleBadge = user.is_admin 
          ? `<span class="muscle-badge chest" style="padding:0.1rem 0.4rem; font-size:0.65rem; background: var(--accent-pink); color: white;">ADMIN</span>`
          : `<span class="muscle-badge" style="padding:0.1rem 0.4rem; font-size:0.65rem;">USER</span>`;
          
        return `
          <tr>
            <td>#${user.id}</td>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${roleBadge}</td>
            <td>${joined}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red">Failed to load users: ${err.message}</td></tr>`;
    }
  }
};

window.Admin = Admin;
