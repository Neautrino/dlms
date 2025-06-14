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
    publicKey: string;
}

export interface ProjectMetadata {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
    projectImage?: string;
    company: string;
    category: string;
    managerWalletAddress: string;
    startDate?: string;
    required_labourer_count: number;
    application_deadline?: string;
    relevant_documents: {
        description: string;
        uri: string;
    };
}

export interface FullProjectData {
    project: Project;
    metadata: ProjectMetadata;
}