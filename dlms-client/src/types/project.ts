// Enum from Solana program
export enum ProjectStatus {
    Open = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3,
}

// Interfaces
export interface Project {
    manager: string;
    title: string;
    metadata_uri: string;
    daily_rate: number;
    duration_days: number;
    max_labourers: number;
    labour_count: number;
    status: ProjectStatus;
    escrow_account: string;
    timestamp: number;
    index: number;
}

export interface ProjectMetadata {
    description: string;
    location: string;
    remote: boolean;
    requiredSkills: string[];
    preferredExperience: string;
    projectImage?: string;
    category: string;
    documents: {
        name: string;
        description: string;
        uri: string;
        fileType: string;
    }[];
    managerName: string;
    managerRating: number;
    startDate?: string;
    company?: string;
    applicationDeadline?: string;
}

export interface FullProjectData {
    project: Project;
    metadata: ProjectMetadata;
}