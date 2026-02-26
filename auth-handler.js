const API = "http://127.0.0.1:8001";

document.addEventListener('DOMContentLoaded', () => {
  const formSignin = document.getElementById('form-signin');
  const formSignup = document.getElementById('form-signup');

  // Handle Sign In
  formSignin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();
    const messageDiv = document.getElementById('signin-message');

    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store email in session/localStorage
        localStorage.setItem('userEmail', email);
        // Redirect to workspace with email param
        window.location.href = `workspace.html?email=${encodeURIComponent(email)}`;
      } else {
        messageDiv.textContent = data.detail || 'Login failed';
        messageDiv.style.display = 'block';
      }
    } catch (error) {
      messageDiv.textContent = 'Error: ' + error.message;
      messageDiv.style.display = 'block';
      console.error('Login error:', error);
    }
  });

  // Handle Sign Up
  formSignup.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const messageDiv = document.getElementById('signup-message');

    try {
      const response = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store email in session/localStorage
        localStorage.setItem('userEmail', email);
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Account created! Redirecting...';
        messageDiv.style.display = 'block';
        
        // Redirect to workspace with email param after short delay
        setTimeout(() => {
          window.location.href = `workspace.html?email=${encodeURIComponent(email)}`;
        }, 1500);
      } else {
        messageDiv.textContent = data.detail || 'Signup failed';
        messageDiv.style.display = 'block';
      }
    } catch (error) {
      messageDiv.textContent = 'Error: ' + error.message;
      messageDiv.style.display = 'block';
      console.error('Signup error:', error);
    }
  });
});
