export enum UserRole {
  Labor = 'labor',
  Manager = 'manager'
}

export interface UserAccount {
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

export interface UserMetadata {
    name: string;
  bio: string;
  profileImage?: string;
  age?: number;
  experience?: string[];
  skillsets?: string[];
  company?: string;
  companyDetails?: {
    industry?: string;
    size?: string;
    founded?: number;
    location?: string;
    website?: string;
  };
  availability?: string;
  hourlyRate?: number;
  preferredLocation?: string;
  languages?: string[];
  certifications?: string[];
  hiringFrequency?: string;
  projectHistory?: {
    title: string;
    description: string;
    duration: string;
  }[];
}

export interface FullUserData {
  account: UserAccount;
  metadata: UserMetadata;
} 