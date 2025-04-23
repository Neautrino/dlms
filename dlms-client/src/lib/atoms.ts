import { atom } from 'jotai';
import type { Project } from '@/types/contract';

export const projectAtom = atom<Project[] | null>(null);