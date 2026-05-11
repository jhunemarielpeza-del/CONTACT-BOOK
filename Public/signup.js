const API_BASE = 'http://localhost:3000/api';

// Redirect if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'contacts.html';
}

const registerBtn = document.getElementById('register-btn');
const usernameInput = document.getElementById('username');
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

registerBtn.addEventListener('click', async () => {
  hideAlerts();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !email || !password) {
    showError('All fields are required.');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters.');
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = 'Registering...';

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || 'Registration failed.');
      return;
    }

    showSuccess('Registration successful! Redirecting to login...');
    setTimeout(() => {
      window.location.href = 'Index.html';
    }, 1200);
  } catch (err) {
    showError('Network error. Make sure the server is running: node server.js');
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register';
  }
});

// Allow Enter key to submit
[usernameInput, emailInput, passwordInput].forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') registerBtn.click();
  });
});