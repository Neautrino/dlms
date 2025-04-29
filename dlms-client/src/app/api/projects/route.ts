import { NextResponse } from 'next/server';
import { program } from '@/utils/program';
import { FullProjectData, Project, ProjectMetadata, ProjectStatus } from '@/types/project';

// Default metadata for projects with missing metadata
const getDefaultMetadata = (project: Project): ProjectMetadata => {
  return {
    title: project.title || "Untitled Project",
    description: "No description available for this project.",
    location: "Location not specified",
    requiredSkills: ["General Labor"],
    company: "Company not specified",
    companyDetails: {
      name: "Company not specified",
      description: "No company details available",
      industryFocus: ["General"],
      verifiedDocument: ""
    },
    category: "Uncategorized",
    managerName: "Manager not specified",
    managerWalletAddress: project.manager,
    managerRating: 0,
    required_labourer_count: project.max_labourers,
    relevant_documents: {
      description: "No documents available",
      uri: ""
    }
  };
};

// Helper function to fetch project metadata
async function fetchProjectMetadata(metadataUri: string, project: Project): Promise<ProjectMetadata> {
  try {
    if (!metadataUri) {
      return getDefaultMetadata(project);
    }

    // In production, this would fetch from the URI
    const response = await fetch(metadataUri);
    if (!response.ok) {
      console.warn(`Failed to fetch metadata from ${metadataUri}, using default metadata`);
      return getDefaultMetadata(project);
    }

    const metadata = await response.json();
    
    // Ensure all required fields are present
    return {
      title: metadata.title || project.title || "Untitled Project",
      description: metadata.description || "No description available for this project.",
      location: metadata.location || "Location not specified",
      requiredSkills: metadata.requiredSkills || ["General Labor"],
      projectImage: metadata.projectImage,
      company: metadata.company || "Company not specified",
      companyDetails: {
        name: metadata.companyDetails?.name || "Company not specified",
        description: metadata.companyDetails?.description || "No company details available",
        industryFocus: metadata.companyDetails?.industryFocus || ["General"],
        verifiedDocument: metadata.companyDetails?.verifiedDocument || ""
      },
      category: metadata.category || "Uncategorized",
      managerName: metadata.managerName || "Manager not specified",
      managerWalletAddress: project.manager,
      managerRating: metadata.managerRating || 0,
      startDate: metadata.startDate,
      required_labourer_count: project.max_labourers,
      application_deadline: metadata.application_deadline,
      relevant_documents: {
        description: metadata.relevant_documents?.description || "No documents available",
        uri: metadata.relevant_documents?.uri || ""
      }
    };
  } catch (error) {
    console.error(`Error fetching metadata from ${metadataUri}:`, error);
    return getDefaultMetadata(project);
  }
}

export async function GET() {
  try {
    // Fetch projects from Solana program
    const projects = await program.account.project.all();
    
    // Transform the data to match our frontend type
    const transformedProjects = await Promise.all(projects.map(async (project) => {
      // Ensure all required fields are present with defaults
      const projectData: Project = {
        manager: project.account.manager.toString() || "",
        title: project.account.title || `Project ${project.publicKey.toString().slice(0, 8)}`,
        metadata_uri: project.account.metadataUri || "",
        daily_rate: Number(project.account.dailyRate) || 0,
        duration_days: project.account.durationDays || 0,
        max_labourers: project.account.maxLabourers || 0,
        labour_count: project.account.labourCount || 0,
        status: project.account.status || ProjectStatus.Open,
        escrow_account: project.account.escrowAccount.toString() || "",
        timestamp: Number(project.account.timestamp) || Date.now(),
        index: project.account.index || 0,
        publicKey: project.publicKey.toString()
      };

      // Fetch metadata
      const metadata = await fetchProjectMetadata(projectData.metadata_uri, projectData);

      return {
        project: projectData,
        metadata
      };
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 