import { atom } from 'jotai';

export interface UserProfile {
  walletAddress: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  experience: string;
  hourlyRate: number;
  availability: string;
  profileImage?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export const userAtom = atom<UserProfile | null>(null); 