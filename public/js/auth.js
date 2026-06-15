// ═══════════════════════════════════════════════════════════
// AUTH CONTROLLER
// Views: login | register | forgot | reset
// ═══════════════════════════════════════════════════════════

const Auth = {
  currentView: 'login', // 'login' | 'register' | 'forgot' | 'reset'

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

    switch (this.currentView) {
      case 'login':    return this._renderLogin(container);
      case 'register': return this._renderRegister(container);
      case 'forgot':   return this._renderForgot(container);
      case 'reset':    return this._renderReset(container);
    }
  },

  // ─── Login ──────────────────────────────────────────────
  _renderLogin(container) {
    container.innerHTML = `
      <div class="auth-header">
        <h2>Welcome Back</h2>
        <p>Login to resume your fitness journey</p>
      </div>
      <form id="login-form">
        <div class="form-group">
          <label class="form-label" for="login-email">Email</label>
          <input class="form-input" type="email" id="login-email" required placeholder="Enter your email">
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

    document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('link-to-register').addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#register';
    });
    document.getElementById('link-forgot-password').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('forgot');
    });
  },

  // ─── Register ───────────────────────────────────────────
  _renderRegister(container) {
    container.innerHTML = `
      <div class="auth-header">
        <h2>Join Fitness Planner AI</h2>
        <p>Get your AI personalized diet &amp; workout plans</p>
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

    document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

    const pwdInput = document.getElementById('register-password');
    pwdInput.addEventListener('input', () => this.checkPasswordStrength(pwdInput.value));

    document.getElementById('link-to-login').addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#login';
    });
  },

  // ─── Forgot Password — Step 1: Enter Email ──────────────
  _renderForgot(container) {
    container.innerHTML = `
      <div class="auth-header">
        <h2>🔑 Forgot Password</h2>
        <p>Enter your email to receive a reset token</p>
      </div>
      <form id="forgot-form">
        <div class="form-group">
          <label class="form-label" for="forgot-email">Email Address</label>
          <input class="form-input" type="email" id="forgot-email" required placeholder="name@domain.com">
          <div class="form-error" id="forgot-email-error">Please enter a valid email.</div>
        </div>
        <button type="submit" class="btn btn-primary" id="btn-forgot-submit">
          <span>Generate Reset Token</span>
        </button>
      </form>

      <!-- Token display box (hidden initially) -->
      <div id="reset-token-box" style="display:none; margin-top:1.2rem; padding:1rem 1.2rem;
           background: rgba(0,255,200,0.06); border:1px solid rgba(0,255,200,0.25);
           border-radius:12px; text-align:center;">
        <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.5rem;">
          ⚠️ In production this token would be <strong>emailed</strong> to you.<br>
          Your 6-digit reset token is:
        </p>
        <div id="token-display" style="font-size:2rem; font-weight:800; letter-spacing:0.3em;
             color:var(--accent-cyan); margin:0.4rem 0;"></div>
        <p style="font-size:0.72rem; color:var(--text-muted);">⏳ Expires in 15 minutes</p>
        <button id="btn-go-reset" class="btn btn-primary" style="margin-top:0.8rem; width:100%;">
          <span>Enter New Password →</span>
        </button>
      </div>

      <div class="auth-switch" style="margin-top:1rem;">
        <a href="#" id="link-back-login">← Back to Login</a>
      </div>
    `;

    document.getElementById('forgot-form').addEventListener('submit', (e) => this.handleForgot(e));
    document.getElementById('link-back-login').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('login');
    });
  },

  // ─── Reset Password — Step 2: Token + New Password ──────
  _renderReset(container, prefillToken = '') {
    container.innerHTML = `
      <div class="auth-header">
        <h2>🔓 Reset Password</h2>
        <p>Enter your token and choose a new password</p>
      </div>
      <form id="reset-form">
        <div class="form-group">
          <label class="form-label" for="reset-token">Reset Token</label>
          <input class="form-input" type="text" id="reset-token" required
            placeholder="e.g. A3F9C2" maxlength="6"
            style="text-transform:uppercase; letter-spacing:0.2em; font-weight:700;"
            value="${prefillToken}">
          <div class="form-error" id="reset-token-error">Token is required.</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="reset-new-password">New Password</label>
          <input class="form-input" type="password" id="reset-new-password" required placeholder="Min. 6 characters">
          <div class="form-error" id="reset-password-error">Password must be at least 6 characters.</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="reset-confirm-password">Confirm Password</label>
          <input class="form-input" type="password" id="reset-confirm-password" required placeholder="Repeat password">
          <div class="form-error" id="reset-confirm-error">Passwords do not match.</div>
        </div>
        <button type="submit" class="btn btn-primary" id="btn-reset-submit">
          <span>Reset Password</span>
        </button>
      </form>
      <div class="auth-switch" style="margin-top:1rem;">
        <a href="#" id="link-back-forgot">← Request new token</a>
      </div>
    `;

    document.getElementById('reset-form').addEventListener('submit', (e) => this.handleReset(e));
    document.getElementById('link-back-forgot').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('forgot');
    });

    // Auto-uppercase the token input
    const tokenInput = document.getElementById('reset-token');
    tokenInput.addEventListener('input', () => {
      const pos = tokenInput.selectionStart;
      tokenInput.value = tokenInput.value.toUpperCase();
      tokenInput.setSelectionRange(pos, pos);
    });
  },

  // ─── Handlers ───────────────────────────────────────────

  async handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('btn-login-submit');

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
    const name     = document.getElementById('register-name').value.trim();
    const email    = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const btn      = document.getElementById('btn-register-submit');

    if (!name || !email || !password) return;

    if (password.length < 6) {
      const pwdError = document.getElementById('register-password-error');
      if (pwdError) pwdError.classList.add('show');
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

  async handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const btn   = document.getElementById('btn-forgot-submit');

    if (!email) return;

    this.setLoading(btn, true);
    try {
      const data = await API.forgotPassword(email);

      // Show the token box
      const tokenBox = document.getElementById('reset-token-box');
      const tokenDisplay = document.getElementById('token-display');
      if (tokenBox && tokenDisplay) {
        tokenDisplay.textContent = data.token;
        tokenBox.style.display = 'block';
      }

      // Wire the "proceed" button
      const goBtn = document.getElementById('btn-go-reset');
      if (goBtn) {
        goBtn.addEventListener('click', () => {
          this._renderReset(document.getElementById('auth-card'), data.token);
        });
      }

      App.showToast('Reset token generated! See it below.', 'success');
    } catch (err) {
      App.showToast(err.message, 'error');
      const emailError = document.getElementById('forgot-email-error');
      if (emailError) {
        emailError.innerText = err.message;
        emailError.classList.add('show');
      }
    } finally {
      this.setLoading(btn, false);
    }
  },

  async handleReset(e) {
    e.preventDefault();
    const token           = document.getElementById('reset-token').value.trim();
    const newPassword     = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;
    const btn             = document.getElementById('btn-reset-submit');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      const err = document.getElementById('reset-confirm-error');
      if (err) { err.innerText = 'Passwords do not match.'; err.classList.add('show'); }
      return;
    }
    if (newPassword.length < 6) {
      const err = document.getElementById('reset-password-error');
      if (err) err.classList.add('show');
      return;
    }

    this.setLoading(btn, true);
    try {
      await API.resetPassword(token, newPassword);
      App.showToast('Password reset! Please log in with your new password.', 'success');
      setTimeout(() => this.switchView('login'), 1500);
    } catch (err) {
      App.showToast(err.message, 'error');
      const tokenError = document.getElementById('reset-token-error');
      if (tokenError) {
        tokenError.innerText = err.message;
        tokenError.classList.add('show');
      }
    } finally {
      this.setLoading(btn, false);
    }
  },

  // ─── Utilities ──────────────────────────────────────────

  checkPasswordStrength(password) {
    const bar1 = document.getElementById('bar-1');
    const bar2 = document.getElementById('bar-2');
    const bar3 = document.getElementById('bar-3');

    if (!bar1 || !bar2 || !bar3) return;

    bar1.className = 'strength-bar';
    bar2.className = 'strength-bar';
    bar3.className = 'strength-bar';

    if (!password) return;

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score++;

    if (score >= 1) bar1.classList.add('weak');
    if (score >= 2) bar2.classList.add('medium');
    if (score >= 3) bar3.classList.add('strong');
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
