// src/services/authService.js
const API_URL = 'http://localhost:8080/api';

export const authService = {
  async signup(data) {
    // Create form data for file upload
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    const result = await response.json();
    // Store token
    localStorage.setItem('auth_token', result.token);
    return result;
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    return result;
  },

  async resetPassword(email) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
  },

  async joinFamily(data) {
    const response = await fetch(`${API_URL}/auth/families/join`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join family');
    }

    const result = await response.json();
    console.log(result);

    // If this was a new user registration (we got a token back)
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  },

  async validateInvite(code) {
    const response = await fetch(`${API_URL}/auth/invites/${code}/validate`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate invite');
    }

    return response.json();
  },

  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        return null;
      }
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  async logout() {
    localStorage.removeItem('auth_token');
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }
};