// src/services/userService.js
import { authService } from './authService';
import { Config } from './config';

export const userService = {
  // Get user profile
  async getProfile() {
    const token = authService.getToken();
    const response = await fetch(`${Config.API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  },

  // Update user profile
  async updateProfile(data) {
    const token = authService.getToken();
    const response = await fetch(`${Config.API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return response.json();
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const token = authService.getToken();
    const response = await fetch(`${Config.API_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    return response.json();
  },

  // Delete account
  async deleteAccount(password) {
    const token = authService.getToken();
    const response = await fetch(`${Config.API_URL}/users/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    return response.json();
  }
};