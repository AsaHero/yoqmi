// src/services/authService.js
import { Config } from './config';

export const authService = {
  async signup(data) {
    // Create form data for file upload
    const response = await fetch(`${Config.API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        family_name: data.familyName
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    const result = await response.json();
    // Store token
    localStorage.setItem('auth_token', result.access_token);
    return result;
  },

  async login(credentials) {
    const response = await fetch(`${Config.API_URL}/auth/login`, {
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
    localStorage.setItem('auth_token', result.access_token);
    return result;
  },

  async resetPassword(email) {
    const response = await fetch(`${Config.API_URL}/auth/reset-password`, {
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
    const response = await fetch(`${Config.API_URL}/auth/families/join`, {
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
    if (result.access_token) {
      localStorage.setItem('auth_token', result.access_token);
    }

    return result;
  },

  async validateInvite(code) {
    const response = await fetch(`${Config.API_URL}/auth/invites/${code}/validate`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate invite');
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