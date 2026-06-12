// ═══════════════════════════════════════════════════════════
// AUTH CONTROLLER
// Handles login, registration, password strength, and UI views
// ═══════════════════════════════════════════════════════════

const Auth = {
  currentView: 'login', // 'login' or 'register'

  init() {
    this.render();
  },

  switchView(view) {
    this.currentView = view;
    this.render();
  },

  render() {
    const container = document.getElementById('auth-card');
    if (!container) return;

    if (this.currentView === 'login') {
      container.innerHTML = `
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to resume your fitness journey</p>
        </div>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Username</label>
            <input class="form-input" type="email" id="login-email" required placeholder="Enter your username">
            <div class="form-error" id="login-email-error">Please enter a valid email.</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" required placeholder="Enter your password">
            <div class="form-error" id="login-password-error">Password is required.</div>
          </div>
          <button type="submit" class="btn btn-primary" id="btn-login-submit">
            <span>Login</span>
          </button>
          <div class="form-footer">
            <a href="#" id="link-forgot-password">Forgot Password?</a>
          </div>
        </form>
        <div class="auth-switch">
          Don't have an account? <a href="#register" id="link-to-register">Create Account</a>
        </div>
      `;

      // Event listener for login form submit
      document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
      document.getElementById('link-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#register';
      });
      document.getElementById('link-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        App.showToast('Password reset coming soon!', 'info');
      });

    } else {
      container.innerHTML = `
        <div class="auth-header">
          <h2>Join Fitness Planner</h2>
          <p>Get your AI personalized diet & workout plans</p>
        </div>
        <form id="register-form">
          <div class="form-group">
            <label class="form-label" for="register-name">Full Name</label>
            <input class="form-input" type="text" id="register-name" required placeholder="John Doe">
            <div class="form-error" id="register-name-error">Name is required.</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-email">Email Address</label>
            <input class="form-input" type="email" id="register-email" required placeholder="name@domain.com">
            <div class="form-error" id="register-email-error">Please enter a valid email.</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-password">Password</label>
            <input class="form-input" type="password" id="register-password" required placeholder="••••••••">
            <div class="password-strength" id="password-strength-bars">
              <div class="strength-bar" id="bar-1"></div>
              <div class="strength-bar" id="bar-2"></div>
              <div class="strength-bar" id="bar-3"></div>
            </div>
            <div class="form-error" id="register-password-error">Password must be at least 6 characters.</div>
          </div>
          <button type="submit" class="btn btn-primary" id="btn-register-submit">
            <span>Create Account</span>
          </button>
        </form>
        <div class="auth-switch">
          Already have an account? <a href="#login" id="link-to-login">Login here</a>
        </div>
      `;

      // Event listeners for register
      document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
      
      const pwdInput = document.getElementById('register-password');
      pwdInput.addEventListener('input', () => this.checkPasswordStrength(pwdInput.value));

      document.getElementById('link-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#login';
      });
    }
  },

  checkPasswordStrength(password) {
    const bar1 = document.getElementById('bar-1');
    const bar2 = document.getElementById('bar-2');
    const bar3 = document.getElementById('bar-3');

    if (!bar1 || !bar2 || !bar3) return;

    // Reset
    bar1.className = 'strength-bar';
    bar2.className = 'strength-bar';
    bar3.className = 'strength-bar';

    if (!password) return;

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score++;

    if (score >= 1) {
      bar1.classList.add('weak');
    }
    if (score >= 2) {
      bar2.classList.add('medium');
    }
    if (score >= 3) {
      bar3.classList.add('strong');
    }
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login-submit');

    if (!email || !password) return;

    this.setLoading(btn, true);
    try {
      await API.login(email, password);
      App.showToast('Login successful! Welcome back.', 'success');
      App.checkAuthState();
    } catch (err) {
      App.showToast(err.message, 'error');
      const pwdError = document.getElementById('login-password-error');
      if (pwdError) {
        pwdError.innerText = err.message;
        pwdError.classList.add('show');
      }
    } finally {
      this.setLoading(btn, false);
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const btn = document.getElementById('btn-register-submit');

    if (!name || !email || !password) return;

    if (password.length < 6) {
      const pwdError = document.getElementById('register-password-error');
      if (pwdError) {
        pwdError.classList.add('show');
      }
      return;
    }

    this.setLoading(btn, true);
    try {
      await API.register(email, password, name);
      App.showToast('Registration successful! Welcome!', 'success');
      App.checkAuthState();
    } catch (err) {
      App.showToast(err.message, 'error');
    } finally {
      this.setLoading(btn, false);
    }
  },

  setLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
      button.classList.add('btn-loading');
      button.disabled = true;
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
    }
  }
};
