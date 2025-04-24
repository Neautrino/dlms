import { atom } from 'jotai';
import type { Project } from '@/types/contract';
import type { FullUserData } from '@/types/user';

export const projectAtom = atom<Project | null>(null);

// User atoms
export type ViewMode = 'grid' | 'list' | 'table';

export const viewModeAtom = atom<ViewMode>('grid');
export const selectedUserAtom = atom<FullUserData | null>(null);
export const userFilterAtom = atom({
  role: 'all' as 'all' | 'labor' | 'manager',
  status: 'all' as 'all' | 'active' | 'inactive',
  verified: 'all' as 'all' | 'verified' | 'unverified',
  search: ''
});