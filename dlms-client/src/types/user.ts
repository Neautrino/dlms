// File: types/user.ts
export enum UserRole {
  Labour = 'labour',
  Manager = 'manager'
}

export interface UserAccount {
  publicKey: string;
  authority: string;
  name: string;
  metadata_uri: string;
  active: boolean;
  verified: boolean;
  rating: number;
  rating_count: number;
  timestamp: number;
  index: number;
  role: UserRole;
  spam: boolean;
}

// Base metadata fields that both roles share
export interface BaseUserMetadata {
  name: string;
  bio: string;
  profileImage?: string;
  languages?: string[];
  location?: string;
  dateOfBirth?: Date;
}

// Labor-specific metadata
export interface LaborMetadata extends BaseUserMetadata {
  experience?: string[];
  skillsets?: string[];
  certifications?: string[];
  availability?: string;
  hourlyRate?: number;
  workHistory?: {
    title: string;
    description: string;
    duration: string;
  }[];
  relevantDocuments?: string[];
}

// Manager-specific metadata
export interface ManagerMetadata extends BaseUserMetadata {
  company?: string;
  companyDetails?: {
    industry?: string;
    size?: string;
    founded?: number;
    location?: string;
    website?: string;
  };
  hiringFrequency?: string;
  managementExperience?: number;
  teamSize?: number;
  industryFocus?: string[];
  projectBudgetRange?: {
    min: number;
    max: number;
    currency: string;
  };
  previousHires?: {
    role: string;
    duration: string;
    projectOutcome?: string;
  }[];
  relevantDocuments?: string[];
}

// Type for user metadata that can be either Labor or Manager
export type UserMetadata = LaborMetadata | ManagerMetadata;

// Helper function to determine if metadata is for Labor
export function isLaborMetadata(metadata: UserMetadata): metadata is LaborMetadata {
  return 'hourlyRate' in metadata || 'skillsets' in metadata || 'experience' in metadata;
}

// Helper function to determine if metadata is for Manager
export function isManagerMetadata(metadata: UserMetadata): metadata is ManagerMetadata {
  return 'company' in metadata || 'hiringFrequency' in metadata || 'teamSize' in metadata;
}

export interface FullUserData {
  account: UserAccount;
  metadata: UserMetadata;
}

// Type guard to get correctly typed metadata based on account role
export function getTypedUserData(userData: FullUserData): 
  | { account: UserAccount; metadata: LaborMetadata }
  | { account: UserAccount; metadata: ManagerMetadata } {
  
  if (userData.account.role === UserRole.Labour) {
    return { account: userData.account, metadata: userData.metadata as LaborMetadata };
  } else {
    return { account: userData.account, metadata: userData.metadata as ManagerMetadata };
  }
}