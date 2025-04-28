import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Project } from '@/types/contract';
import type { FullUserData } from '@/types/user';

// Authentication atom
export const authAtom = atom<boolean>(false);

// Project atom
export const projectAtom = atom<Project[]>([]);

// User atoms
export type ViewMode = 'grid' | 'list' | 'table';

// View mode atom for users and projects pages
export const viewModeAtom = atom<ViewMode>('list');
export const selectedUserAtom = atom<FullUserData | null>(null);
export const currentUserAtom = atom<FullUserData | null>(null);
export const userFilterAtom = atom({
  search: '',
  role: 'all',
  status: 'all',
  verified: 'all'
});

export const isConnectedAtom = atomWithStorage('isConnected', false);

export const userAtom = atom<FullUserData[] | null>(null);