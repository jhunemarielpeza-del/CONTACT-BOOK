const API_BASE = 'http://localhost:3000/api';

// Redirect if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'contacts.html';
}

const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
  successMsg.classList.add('hidden');
}

function showSuccess(msg) {
  successMsg.textContent = msg;
  successMsg.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}

function hideAlerts() {
  errorMsg.classList.add('hidden');
  successMsg.classList.add('hidden');
}

loginBtn.addEventListener('click', async () => {
  hideAlerts();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Please enter your email and password.');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || 'Login failed.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = 'contacts.html';
    }, 800);
  } catch (err) {
    showError('Network error. Make sure the server is running: node server.js');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Allow Enter key to submit
[emailInput, passwordInput].forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });
});