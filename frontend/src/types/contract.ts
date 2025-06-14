// Application Types
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type Application = {
  labour: string;
  project: string;
  description: string;
  status: ApplicationStatus;
  timestamp: bigint;
};

// Project Types
export type ProjectStatus = "open" | "inProgress" | "completed" | "cancelled";

export type Project = {
  manager: string;
  title: string;
  metadataUri: string;
  dailyRate: number;
  durationDays: number;
  maxLabourers: number;
  labourCount: number;
  status: ProjectStatus;
  escrowAccount: string;
  timestamp: number;
  index: number;
  publicKey: string;
};

// Assignment Types
export type Assignment = {
  labour: string;
  project: string;
  daysWorked: number;
  daysPaid: number;
  active: boolean;
  timestamp: bigint;
};

// Review Types
export type ReviewType = "labourReview" | "managerReview";

export type Review = {
  reviewer: string;
  reviewee: string;
  rating: number;
  context: string;
  timestamp: bigint;
  reviewType: ReviewType;
};

// System State Types
export type SystemState = {
  authority: string;
  mint: string;
  labourCount: number;
  managerCount: number;
  projectCount: number;
  admins: string[];
};

// User Account Types
export type UserRole = "labour" | "manager";

export type UserAccount = {
  authority: string;
  name: string;
  metadataUri: string;
  active: boolean;
  verified: boolean;
  rating: number;
  ratingCount: number;
  timestamp: bigint;
  index: number;
  role: UserRole;
  spam: boolean;
};

// Work Verification Types
export type WorkVerification = {
  project: string;
  labour: string;
  dayNumber: number;
  managerVerified: boolean;
  labourVerified: boolean;
  metadataUri: string;
  timestamp: bigint;
  paymentProcessed: boolean;
};