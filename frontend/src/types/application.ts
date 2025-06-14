// File: types/application.ts
export interface Application {
    description: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    expectedRate?: number;
    additionalInfo?: string;
    submittedAt: string;
  }
  
  // Update your types/project.ts file to include this if not already there
  export enum ApplicationStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Withdrawn = 3
  }