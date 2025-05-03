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

// Labor-specific metadata
export interface LaborMetadata {
  name: string;
  bio: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: Date;
  languages?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  verificationDocuments?: string;
  experience?: string[];
  skillsets?: string[];
  certifications?: string[];
  workHistory?: {
    title: string;
    description: string;
    duration: string;
  }[];
  relevantDocuments?: string;
}

// Manager-specific metadata
export interface ManagerMetadata {
  name: string;
  bio: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: Date;
  languages?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  verificationDocuments?: string;
  companyDetails?: {
    companyName?: string;
    companyDescription?: string;
    industry?: string;
    founded?: number;
    location?: string;
    industryFocus?: string[];
  };
  managementExperience?: number;
  relevantDocuments?: string;
}

// Type for user metadata that can be either Labor or Manager
export type UserMetadata = LaborMetadata | ManagerMetadata;

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