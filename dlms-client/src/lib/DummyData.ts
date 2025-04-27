import { FullUserData, UserRole } from "@/types/user";
import { FullProjectData, ProjectStatus } from "@/types/project";

export const MOCK_PROJECTS: FullProjectData[] = [
    {
      project: {
        manager: "BvzKvn5RwARA3nkYf1FB6xfRxd8NUBc3HjvVqXAjgZ2M",
        title: "Residential Electrical Renovation",
        metadata_uri: "ipfs://Qmabcd123456",
        daily_rate: 350,
        duration_days: 14,
        max_labourers: 3,
        labour_count: 1,
        status: ProjectStatus.Open,
        escrow_account: "7LkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYHF",
        timestamp: Date.now() - 3600000 * 24 * 3,
        index: 1
      },
      metadata: {
        title: "Residential Electrical Renovation",
        description: "Complete electrical renovation of a 3000 sq ft residential property. Tasks include rewiring, panel upgrade, and smart home integration.",
        location: "Portland, OR",
        requiredSkills: ["Electrical wiring", "Panel installation", "Smart home systems", "Blueprint reading"],
        projectImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60",
        category: "Electrical",
        company: "BuildRight Construction",
        companyDetails: {
          name: "BuildRight Construction",
          description: "Leading construction company specializing in residential and commercial projects",
          industryFocus: ["Residential", "Commercial", "Sustainable Building"],
          verifiedDocument: "ipfs://QmVerifiedDoc123"
        },
        managerName: "Sarah Miller",
        managerWalletAddress: "BvzKvn5RwARA3nkYf1FB6xfRxd8NUBc3HjvVqXAjgZ2M",
        managerRating: 4.8,
        startDate: "2025-05-15",
        required_labourer_count: 3,
        application_deadline: "2025-05-05",
        relevant_documents: {
          description: "Project specifications and requirements",
          uri: "ipfs://QmDocSpecs123"
        }
      }
    },
    {
      project: {
        manager: "Hj2KmxRwCvE3nkXOe4cYgjvn8FGd9WzBc1GtpFqZDngA",
        title: "Commercial HVAC System Installation",
        metadata_uri: "ipfs://Qmefgh789012",
        daily_rate: 450,
        duration_days: 30,
        max_labourers: 5,
        labour_count: 2,
        status: ProjectStatus.Open,
        escrow_account: "9PkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYTD",
        timestamp: Date.now() - 3600000 * 24 * 1,
        index: 2
      },
      metadata: {
        title: "Commercial HVAC System Installation",
        description: "Installation of new HVAC system for a three-story office building. Includes ductwork, central air conditioning, and smart climate control system.",
        location: "Seattle, WA",
        requiredSkills: ["HVAC installation", "Ductwork", "Commercial building experience", "Climate control systems"],
        projectImage: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=800&auto=format&fit=crop&q=60",
        category: "HVAC",
        company: "GreenScape Design",
        companyDetails: {
          name: "GreenScape Design",
          description: "Innovative design and construction company focusing on sustainable solutions",
          industryFocus: ["Sustainable Design", "Commercial Construction", "Green Technology"],
          verifiedDocument: "ipfs://QmVerifiedDoc456"
        },
        managerName: "Emily Chen",
        managerWalletAddress: "Hj2KmxRwCvE3nkXOe4cYgjvn8FGd9WzBc1GtpFqZDngA",
        managerRating: 4.9,
        startDate: "2025-05-20",
        required_labourer_count: 5,
        application_deadline: "2025-05-10",
        relevant_documents: {
          description: "HVAC system specifications and building plans",
          uri: "ipfs://QmHVACDocs789"
        }
      }
    },
    {
      project: {
        manager: "Pqr5TuvWxYz7AbC8DeFgH1IjKlM9Bc1HbvPqXNopq2R",
        title: "Custom Kitchen Cabinet Installation",
        metadata_uri: "ipfs://Qmnopq901234",
        daily_rate: 300,
        duration_days: 10,
        max_labourers: 2,
        labour_count: 0,
        status: ProjectStatus.Open,
        escrow_account: "5RkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYQC",
        timestamp: Date.now() - 3600000 * 24 * 5,
        index: 3
      },
      metadata: {
        title: "Custom Kitchen Cabinet Installation",
        description: "Installation of custom hardwood cabinets in a high-end residential kitchen. Work includes cabinet mounting, hardware installation, and finishing.",
        location: "San Francisco, CA",
        requiredSkills: ["Cabinet installation", "Woodworking", "Finishing", "Precise measurements"],
        projectImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60",
        category: "Carpentry",
        company: "Elite Home Renovations",
        companyDetails: {
          name: "Elite Home Renovations",
          description: "Premium home renovation and custom carpentry services",
          industryFocus: ["Custom Carpentry", "Home Renovation", "Interior Design"],
          verifiedDocument: "ipfs://QmVerifiedDoc789"
        },
        managerName: "Michael Torres",
        managerWalletAddress: "Pqr5TuvWxYz7AbC8DeFgH1IjKlM9Bc1HbvPqXNopq2R",
        managerRating: 4.7,
        startDate: "2025-05-12",
        required_labourer_count: 2,
        application_deadline: "2025-05-01",
        relevant_documents: {
          description: "Cabinet designs and kitchen layout",
          uri: "ipfs://QmCabinetDesigns456"
        }
      }
    },
    {
      project: {
        manager: "Stu6VwxYzAb1CdEfGh2IjKl3MnOp7Bc1HbvQrStuv4W",
        title: "Office Building Network Infrastructure",
        metadata_uri: "ipfs://Qmrstu567890",
        daily_rate: 500,
        duration_days: 21,
        max_labourers: 4,
        labour_count: 3,
        status: ProjectStatus.InProgress,
        escrow_account: "3WkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYRT",
        timestamp: Date.now() - 3600000 * 24 * 10,
        index: 4
      },
      metadata: {
        title: "Office Building Network Infrastructure",
        description: "Setting up network infrastructure for a new corporate office. Includes cable installation, network equipment setup, and testing.",
        location: "Remote",
        requiredSkills: ["Network installation", "Cable management", "Network security", "Troubleshooting"],
        projectImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60",
        category: "IT Infrastructure",
        company: "TechSphere Solutions",
        companyDetails: {
          name: "TechSphere Solutions",
          description: "Leading IT infrastructure and network solutions provider",
          industryFocus: ["IT Infrastructure", "Network Solutions", "Digital Transformation"],
          verifiedDocument: "ipfs://QmVerifiedDoc012"
        },
        managerName: "Jennifer Wong",
        managerWalletAddress: "Stu6VwxYzAb1CdEfGh2IjKl3MnOp7Bc1HbvQrStuv4W",
        managerRating: 4.6,
        startDate: "2025-04-20",
        required_labourer_count: 4,
        application_deadline: "2025-04-10",
        relevant_documents: {
          description: "Network architecture and equipment specifications",
          uri: "ipfs://QmNetworkDiag123"
        }
      }
    },
    {
      project: {
        manager: "Xyz9AbCdEf2GhIjKl4MnOp8QrSt7UvWx6YzAbCdEfGh",
        title: "Sustainable Landscaping Project",
        metadata_uri: "ipfs://Qmwxyz345678",
        daily_rate: 280,
        duration_days: 45,
        max_labourers: 6,
        labour_count: 4,
        status: ProjectStatus.InProgress,
        escrow_account: "2LkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYDF",
        timestamp: Date.now() - 3600000 * 24 * 15,
        index: 5
      },
      metadata: {
        title: "Sustainable Landscaping Project",
        description: "Complete landscaping redesign using sustainable practices for a corporate campus. Includes irrigation systems, native plant installation, and hardscaping.",
        location: "Austin, TX",
        requiredSkills: ["Sustainable landscaping", "Irrigation systems", "Hardscaping", "Native plant knowledge"],
        projectImage: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&auto=format&fit=crop&q=60",
        category: "Landscaping",
        company: "EcoScape Designs",
        companyDetails: {
          name: "EcoScape Designs",
          description: "Sustainable landscaping and environmental design specialists",
          industryFocus: ["Sustainable Landscaping", "Environmental Design", "Green Spaces"],
          verifiedDocument: "ipfs://QmVerifiedDoc345"
        },
        managerName: "Robert Greenfield",
        managerWalletAddress: "Xyz9AbCdEf2GhIjKl4MnOp8QrSt7UvWx6YzAbCdEfGh",
        managerRating: 4.9,
        startDate: "2025-04-10",
        required_labourer_count: 6,
        application_deadline: "2025-03-25",
        relevant_documents: {
          description: "Landscape design and plant schedule",
          uri: "ipfs://QmLandDesign789"
        }
      }
    },
    {
      project: {
        manager: "Lmn3OpQrSt5UvWxYz7AbCd9EfGh2IjKl4MnOp6QrStU",
        title: "Commercial Solar Panel Installation",
        metadata_uri: "ipfs://Qmlmno901234",
        daily_rate: 420,
        duration_days: 25,
        max_labourers: 8,
        labour_count: 8,
        status: ProjectStatus.Completed,
        escrow_account: "4FkVFQkQEnBvCNYJvKbLqwEQHcnKPMWCEdQNnYS5hYGH",
        timestamp: Date.now() - 3600000 * 24 * 60,
        index: 6
      },
      metadata: {
        title: "Commercial Solar Panel Installation",
        description: "Installation of solar panel array on commercial warehouse roof. Project includes mounting hardware, electrical connections, and monitoring systems.",
        location: "Denver, CO",
        requiredSkills: ["Solar panel installation", "Roofing experience", "Electrical wiring", "Safety protocols"],
        projectImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60",
        category: "Renewable Energy",
        company: "SunTech Renewables",
        companyDetails: {
          name: "SunTech Renewables",
          description: "Leading provider of solar energy solutions",
          industryFocus: ["Solar Energy", "Renewable Energy", "Sustainable Technology"],
          verifiedDocument: "ipfs://QmVerifiedDoc678"
        },
        managerName: "David Chen",
        managerWalletAddress: "Lmn3OpQrSt5UvWxYz7AbCd9EfGh2IjKl4MnOp6QrStU",
        managerRating: 4.8,
        startDate: "2025-02-15",
        required_labourer_count: 8,
        application_deadline: "2025-02-01",
        relevant_documents: {
          description: "Solar array layout and electrical diagrams",
          uri: "ipfs://QmSolarLayout567"
        }
      }
    }
  ];

export const MOCK_USERS: FullUserData[] = [
  {
    account: {
      publicKey: "BvzKvn5RwARA3nkYf1FB6xfRxd8NUBc3HjvVqXAjgZ2M",
      authority: "BvzKvn5RwARA3nkYf1FB6xfRxd8NUBc3HjvVqXAjgZ2M",
      name: "Alex Johnson",
      metadata_uri: "ipfs://Qmabcd123456",
      active: true,
      verified: true,
      rating: 48,
      rating_count: 12,
      timestamp: Date.now() - 3600000 * 24 * 30,
      index: 1,
      role: UserRole.Labour,
      spam: false
    },
    metadata: {
      name: "Alex Johnson",
      bio: "Experienced electrician with a focus on residential and commercial installations.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
      gender: "Male",
      dateOfBirth: new Date("1995-05-15"),
      languages: ["English", "Spanish"],
      city: "Portland",
      state: "OR",
      country: "USA",
      verificationDocuments: "ipfs://QmVerificationDoc123",
      experience: ["5 years at City Electric", "3 years independent contracting"],
      skillsets: ["Electrical installation", "Circuit diagnosis", "Smart home setup", "Solar panel installation"],
      certifications: ["Licensed Electrician", "Solar Installation Certificate"],
      workHistory: [
        {
          title: "Senior Electrician",
          description: "Led residential and commercial electrical installations",
          duration: "3 years"
        },
        {
          title: "Independent Contractor",
          description: "Specialized in smart home installations",
          duration: "2 years"
        }
      ],
      relevantDocuments: "ipfs://QmRelevantDoc123"
    }
  },
  {
    account: {
      publicKey: "Fj2KmxRwCvE3nkXOeQcYgjvn8FGd9WzBc1HbvFqZDngH",
      authority: "Fj2KmxRwCvE3nkXOeQcYgjvn8FGd9WzBc1HbvFqZDngH",
      name: "Sarah Miller",
      metadata_uri: "ipfs://Qmefgh789012",
      active: true,
      verified: true,
      rating: 50,
      rating_count: 24,
      timestamp: Date.now() - 3600000 * 24 * 45,
      index: 2,
      role: UserRole.Manager,
      spam: false
    },
    metadata: {
      name: "Sarah Miller",
      bio: "Project manager at BuildRight Construction, focusing on sustainable building practices.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60",
      gender: "Female",
      dateOfBirth: new Date("1988-03-20"),
      languages: ["English"],
      city: "Portland",
      state: "OR",
      country: "USA",
      verificationDocuments: "ipfs://QmVerificationDoc456",
      companyDetails: {
        company: "BuildRight Construction",
        industry: "Construction",
        founded: 2012,
        location: "Portland, OR",
        industryFocus: ["Residential", "Commercial", "Sustainable Building"]
      },
      managementExperience: 8,
      relevantDocuments: "ipfs://QmRelevantDoc456"
    }
  },
  {
    account: {
      publicKey: "Hjk8LmnPqAs3ZjvD2dGhT7rFkY9Bc1HwbvPqXKlm5N",
      authority: "Hjk8LmnPqAs3ZjvD2dGhT7rFkY9Bc1HwbvPqXKlm5N",
      name: "Miguel Santos",
      metadata_uri: "ipfs://Qmijkl345678",
      active: true,
      verified: false,
      rating: 42,
      rating_count: 8,
      timestamp: Date.now() - 3600000 * 24 * 10,
      index: 3,
      role: UserRole.Labour,
      spam: false
    },
    metadata: {
      name: "Miguel Santos",
      bio: "Skilled carpenter with expertise in custom cabinetry and furniture.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60",
      gender: "Male",
      dateOfBirth: new Date("1992-08-10"),
      languages: ["English", "Portuguese"],
      city: "San Francisco",
      state: "CA",
      country: "USA",
      verificationDocuments: "ipfs://QmVerificationDoc789",
      experience: ["7 years in fine woodworking", "3 years as lead carpenter"],
      skillsets: ["Cabinetry", "Furniture making", "Finishing", "Restoration"],
      certifications: ["Master Carpenter"],
      workHistory: [
        {
          title: "Lead Carpenter",
          description: "Specialized in custom cabinetry and furniture",
          duration: "3 years"
        },
        {
          title: "Fine Woodworker",
          description: "Created custom furniture pieces",
          duration: "4 years"
        }
      ],
      relevantDocuments: "ipfs://QmRelevantDoc789"
    }
  },
  {
    account: {
      publicKey: "Pqr5TuvWxYz7AbC8DeFgH1IjKlM9Bc1HbvPqXNopq2R",
      authority: "Pqr5TuvWxYz7AbC8DeFgH1IjKlM9Bc1HbvPqXNopq2R",
      name: "Emily Chen",
      metadata_uri: "ipfs://Qmnopq901234",
      active: true,
      verified: true,
      rating: 49,
      rating_count: 31,
      timestamp: Date.now() - 3600000 * 24 * 60,
      index: 4,
      role: UserRole.Manager,
      spam: false
    },
    metadata: {
      name: "Emily Chen",
      bio: "Director of operations at GreenScape, specializing in sustainable landscaping projects.",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60",
      gender: "Female",
      dateOfBirth: new Date("1981-11-05"),
      languages: ["English", "Mandarin"],
      city: "Seattle",
      state: "WA",
      country: "USA",
      verificationDocuments: "ipfs://QmVerificationDoc012",
      companyDetails: {
        company: "GreenScape Design",
        industry: "Landscaping & Architecture",
        founded: 2015,
        location: "Seattle, WA",
        industryFocus: ["Sustainable Landscaping", "Architecture", "Urban Design"]
      },
      managementExperience: 12,
      relevantDocuments: "ipfs://QmRelevantDoc012"
    }
  },
  {
    account: {
      publicKey: "Stu6VwxYzAb1CdEfGh2IjKl3MnOp7Bc1HbvQrStuv4W",
      authority: "Stu6VwxYzAb1CdEfGh2IjKl3MnOp7Bc1HbvQrStuv4W",
      name: "David Wilson",
      metadata_uri: "ipfs://Qmrstu567890",
      active: false,
      verified: true,
      rating: 47,
      rating_count: 19,
      timestamp: Date.now() - 3600000 * 24 * 90,
      index: 5,
      role: UserRole.Labour,
      spam: false
    },
    metadata: {
      name: "David Wilson",
      bio: "HVAC technician with 15+ years of experience in residential and commercial systems.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60",
      gender: "Male",
      dateOfBirth: new Date("1984-06-25"),
      languages: ["English"],
      city: "Denver",
      state: "CO",
      country: "USA",
      verificationDocuments: "ipfs://QmVerificationDoc345",
      experience: ["10 years at Cool Air Systems", "5 years at Home Comfort HVAC"],
      skillsets: ["HVAC installation", "System maintenance", "Energy efficiency consulting", "Refrigeration"],
      certifications: ["HVAC Certified Technician", "EPA 608 Certification"],
      workHistory: [
        {
          title: "Senior HVAC Technician",
          description: "Led commercial HVAC installations and maintenance",
          duration: "5 years"
        },
        {
          title: "HVAC Specialist",
          description: "Specialized in residential systems",
          duration: "10 years"
        }
      ],
      relevantDocuments: "ipfs://QmRelevantDoc345"
    }
  }
];