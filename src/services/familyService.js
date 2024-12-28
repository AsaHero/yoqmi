// src/services/familyService.js
import { authService } from './authService';
import { Config } from './config';

export const familyService = {
    // Get all family members
    async getMembers() {
        const token = authService.getToken();
        const response = await fetch(`${Config.API_URL}/family/members`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch family members');
        }
        return response.json();
    },

    // Create new invite
    async createInvite() {
        const token = authService.getToken();
        const response = await fetch(`${Config.API_URL}/family/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to create invite');
        }
        return response.json();
    },

    // Remove member
    async removeMember(memberId) {
        const token = authService.getToken();
        const response = await fetch(`${Config.API_URL}/family/members/${memberId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to remove member');
        }
    },

    // Update member role
    async updateMemberRole(memberId, role) {
        const token = authService.getToken();
        const response = await fetch(`${Config.API_URL}/family/members/${memberId}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role }),
        });
        if (!response.ok) {
            throw new Error('Failed to update member role');
        }
    },
};