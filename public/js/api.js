// ═══════════════════════════════════════════════════════════
// API CLIENT
// Handles all HTTP requests with JWT auth
// ═══════════════════════════════════════════════════════════

const API = {
  BASE_URL: '/api',

  getToken() {
    return localStorage.getItem('fitplanner_token');
  },

  setToken(token) {
    localStorage.setItem('fitplanner_token', token);
  },

  removeToken() {
    localStorage.removeItem('fitplanner_token');
  },

  getUser() {
    const data = localStorage.getItem('fitplanner_user');
    return data ? JSON.parse(data) : null;
  },

  setUser(user) {
    localStorage.setItem('fitplanner_user', JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem('fitplanner_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          this.removeUser();
          window.location.hash = '#login';
        }
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  // ─── Auth ───────────────────────────────────────────────
  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: { email, password, name }
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  logout() {
    this.removeToken();
    this.removeUser();
  },

  // ─── Profile ────────────────────────────────────────────
  async getProfile() {
    return this.request('/user/profile');
  },

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: profileData
    });
  },

  // ─── Workout ────────────────────────────────────────────
  async generateWorkout() {
    return this.request('/workout/generate', { method: 'POST' });
  },

  async getCurrentWorkout() {
    return this.request('/workout/current');
  },

  async getAnalysis() {
    return this.request('/workout/analysis');
  },

  // ─── Diet ───────────────────────────────────────────────
  async generateDiet() {
    return this.request('/diet/generate', { method: 'POST' });
  },

  async getCurrentDiet() {
    return this.request('/diet/current');
  },

  // ─── Progress ───────────────────────────────────────────
  async logProgress(progressData) {
    return this.request('/user/progress', {
      method: 'POST',
      body: progressData
    });
  },

  async getProgress() {
    return this.request('/user/progress');
  }
};
