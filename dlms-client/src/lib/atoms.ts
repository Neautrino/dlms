import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Project } from '@/types/contract';
import type { FullUserData } from '@/types/user';
import { FullProjectData } from '@/types/project';

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

// Atom for storing all projects data
export const allProjectsAtom = atom<FullProjectData[]>([]);

// Atom for paginated projects
export const paginatedProjectsAtom = atom(
  (get) => {
    const allProjects = get(allProjectsAtom);
    const currentPage = get(currentPageAtom);
    const itemsPerPage = 5;
    
    const startIndex = 0;
    const endIndex = (currentPage + 1) * itemsPerPage;
    
    return allProjects.slice(startIndex, endIndex);
  }
);

// Atom for tracking current page
export const currentPageAtom = atom(0);

// Atom for tracking if there are more projects to load
export const hasMoreProjectsAtom = atom(
  (get) => {
    const allProjects = get(allProjectsAtom);
    const currentPage = get(currentPageAtom);
    const itemsPerPage = 5;
    
    const endIndex = (currentPage + 1) * itemsPerPage;
    return endIndex < allProjects.length;
  }
);

export const userRegistrationStatusAtom = atom<{
  isRegistered: boolean;
  role: 'manager' | 'labour' | null;
}>({
  isRegistered: false,
  role: null
});