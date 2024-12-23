export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
  }

  export interface SignupData {
    name: string;
    email: string;
    password: string;
    familyName: string;
    avatar?: File;
  }

  export interface JoinFamilyData {
    name: string;
    email: string;
    password: string;
    inviteCode: string;
    avatar?: File;
  }

  export interface AuthResponse {
    user: User;
    token: string;
    familyId: string;
  }