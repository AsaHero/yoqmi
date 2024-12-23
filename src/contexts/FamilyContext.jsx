// src/contexts/FamilyContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { familyService } from '../services/familyService';

const FamilyContext = createContext(null);

const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_MEMBERS: 'SET_MEMBERS',
    REMOVE_MEMBER: 'REMOVE_MEMBER',
    UPDATE_MEMBER: 'UPDATE_MEMBER',
};

const initialState = {
    members: [],
    isLoading: true,
    error: null,
};

function familyReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: null,
            };
        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case ACTIONS.SET_MEMBERS:
            return {
                ...state,
                members: action.payload,
                isLoading: false,
                error: null,
            };
        case ACTIONS.REMOVE_MEMBER:
            return {
                ...state,
                members: state.members.filter(m => m.id !== action.payload),
                isLoading: false,
                error: null,
            };
        case ACTIONS.UPDATE_MEMBER:
            return {
                ...state,
                members: state.members.map(member =>
                    member.id === action.payload.id ? { ...member, ...action.payload } : member
                ),
                isLoading: false,
                error: null,
            };
        default:
            return state;
    }
}

export function FamilyProvider({ children }) {
    const [state, dispatch] = useReducer(familyReducer, initialState);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const { members } = await familyService.getMembers();
            dispatch({ type: ACTIONS.SET_MEMBERS, payload: members });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to load family members'
            });
        }
    };

    const createInvite = async () => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const invite = await familyService.createInvite();
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            return invite;
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to create invite'
            });
            throw error;
        }
    };

    const removeMember = async (memberId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await familyService.removeMember(memberId);
            dispatch({ type: ACTIONS.REMOVE_MEMBER, payload: memberId });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to remove member'
            });
            throw error;
        }
    };

    const updateMemberRole = async (memberId, role) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await familyService.updateMemberRole(memberId, role);
            dispatch({
                type: ACTIONS.UPDATE_MEMBER,
                payload: { id: memberId, role }
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to update member role'
            });
            throw error;
        }
    };

    return (
        <FamilyContext.Provider
            value={{
                state,
                createInvite,
                removeMember,
                updateMemberRole,
                retry: loadMembers,
            }}
        >
            {children}
        </FamilyContext.Provider>
    );
}

export function useFamily() {
    const context = useContext(FamilyContext);
    if (!context) {
        throw new Error('useFamily must be used within a FamilyProvider');
    }
    return context;
}