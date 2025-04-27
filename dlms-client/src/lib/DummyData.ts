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
        description: "Complete electrical renovation of a 3000 sq ft residential property. Tasks include rewiring, panel upgrade, and smart home integration.",
        location: "Portland, OR",
        remote: false,
        requiredSkills: ["Electrical wiring", "Panel installation", "Smart home systems", "Blueprint reading"],
        preferredExperience: "Minimum 3 years in residential electrical work",
        projectImage: "/api/placeholder/400/200",
        category: "Electrical",
        documents: [
          {
            name: "Project Specs",
            description: "Detailed electrical specifications and requirements",
            uri: "ipfs://QmDocSpecs123",
            fileType: "pdf"
          },
          {
            name: "House Blueprint",
            description: "Architectural plans of the residence",
            uri: "ipfs://QmBluePrint456",
            fileType: "pdf"
          }
        ],
        managerName: "Sarah Miller",
        managerRating: 4.8,
        startDate: "2025-05-15",
        company: "BuildRight Construction",
        applicationDeadline: "2025-05-05"
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
        description: "Installation of new HVAC system for a three-story office building. Includes ductwork, central air conditioning, and smart climate control system.",
        location: "Seattle, WA",
        remote: false,
        requiredSkills: ["HVAC installation", "Ductwork", "Commercial building experience", "Climate control systems"],
        preferredExperience: "5+ years in commercial HVAC projects",
        projectImage: "/api/placeholder/400/200",
        category: "HVAC",
        documents: [
          {
            name: "HVAC Specifications",
            description: "Technical specifications for the HVAC system",
            uri: "ipfs://QmHVACDocs789",
            fileType: "pdf"
          },
          {
            name: "Building Plans",
            description: "Building layout and duct planning",
            uri: "ipfs://QmBuildingPlan123",
            fileType: "dwg"
          }
        ],
        managerName: "Emily Chen",
        managerRating: 4.9,
        startDate: "2025-05-20",
        company: "GreenScape Design",
        applicationDeadline: "2025-05-10"
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
        description: "Installation of custom hardwood cabinets in a high-end residential kitchen. Work includes cabinet mounting, hardware installation, and finishing.",
        location: "San Francisco, CA",
        remote: false,
        requiredSkills: ["Cabinet installation", "Woodworking", "Finishing", "Precise measurements"],
        preferredExperience: "3+ years in custom cabinetry",
        projectImage: "/api/placeholder/400/200",
        category: "Carpentry",
        documents: [
          {
            name: "Cabinet Designs",
            description: "Detailed designs and dimensions of all cabinets",
            uri: "ipfs://QmCabinetDesigns456",
            fileType: "pdf"
          },
          {
            name: "Kitchen Layout",
            description: "Kitchen floor plan with cabinet placements",
            uri: "ipfs://QmKitchenLayout789",
            fileType: "jpg"
          }
        ],
        managerName: "Michael Torres",
        managerRating: 4.7,
        startDate: "2025-05-12",
        company: "Elite Home Renovations",
        applicationDeadline: "2025-05-01"
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
        description: "Setting up network infrastructure for a new corporate office. Includes cable installation, network equipment setup, and testing.",
        location: "Remote",
        remote: true,
        requiredSkills: ["Network installation", "Cable management", "Network security", "Troubleshooting"],
        preferredExperience: "Minimum 4 years in corporate network setup",
        projectImage: "/api/placeholder/400/200",
        category: "IT Infrastructure",
        documents: [
          {
            name: "Network Diagram",
            description: "Detailed network architecture and topology",
            uri: "ipfs://QmNetworkDiag123",
            fileType: "pdf"
          },
          {
            name: "Equipment List",
            description: "List of all network equipment to be installed",
            uri: "ipfs://QmEquipList456",
            fileType: "xlsx"
          }
        ],
        managerName: "Jennifer Wong",
        managerRating: 4.6,
        startDate: "2025-04-20",
        company: "TechSphere Solutions",
        applicationDeadline: "2025-04-10"
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
        description: "Complete landscaping redesign using sustainable practices for a corporate campus. Includes irrigation systems, native plant installation, and hardscaping.",
        location: "Austin, TX",
        remote: false,
        requiredSkills: ["Sustainable landscaping", "Irrigation systems", "Hardscaping", "Native plant knowledge"],
        preferredExperience: "3+ years in commercial landscaping projects",
        projectImage: "/api/placeholder/400/200",
        category: "Landscaping",
        documents: [
          {
            name: "Landscape Design",
            description: "Comprehensive landscape design plans",
            uri: "ipfs://QmLandDesign789",
            fileType: "pdf"
          },
          {
            name: "Plant Schedule",
            description: "Detailed list of all plants and their locations",
            uri: "ipfs://QmPlantList123",
            fileType: "pdf"
          },
          {
            name: "Irrigation Plan",
            description: "Irrigation system design and components",
            uri: "ipfs://QmIrrigPlan456",
            fileType: "pdf"
          }
        ],
        managerName: "Robert Greenfield",
        managerRating: 4.9,
        company: "EcoScape Designs",
        startDate: "2025-04-10",
        applicationDeadline: "2025-03-25"
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
        description: "Installation of solar panel array on commercial warehouse roof. Project includes mounting hardware, electrical connections, and monitoring systems.",
        location: "Denver, CO",
        remote: false,
        requiredSkills: ["Solar panel installation", "Roofing experience", "Electrical wiring", "Safety protocols"],
        preferredExperience: "Minimum 2 years in commercial solar installation",
        projectImage: "/api/placeholder/400/200",
        category: "Renewable Energy",
        documents: [
          {
            name: "Solar Array Layout",
            description: "Detailed layout of the solar panel array",
            uri: "ipfs://QmSolarLayout567",
            fileType: "pdf"
          },
          {
            name: "Electrical Diagram",
            description: "Electrical connection diagram for the solar system",
            uri: "ipfs://QmElecDiag890",
            fileType: "pdf"
          }
        ],
        managerName: "David Chen",
        managerRating: 4.8,
        company: "SunTech Renewables",
        startDate: "2025-02-15",
        applicationDeadline: "2025-02-01"
      }
    }
  ];

  // Mock data for demonstration
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
      profileImage: "/api/placeholder/80/80",
      gender: "Male",
      dateOfBirth: new Date("1995-05-15"),
      languages: ["English", "Spanish"],
      city: "Portland",
      state: "OR",
      country: "USA",
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
      ]
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
      profileImage: "/api/placeholder/80/80",
      gender: "Female",
      dateOfBirth: new Date("1988-03-20"),
      languages: ["English"],
      city: "Portland",
      state: "OR",
      country: "USA",
      companyDetails: {
        company: "BuildRight Construction",
        industry: "Construction",
        founded: 2012,
        location: "Portland, OR",
        industryFocus: ["Residential", "Commercial", "Sustainable Building"]
      },
      managementExperience: 8
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
      profileImage: "/api/placeholder/80/80",
      gender: "Male",
      dateOfBirth: new Date("1992-08-10"),
      languages: ["English", "Portuguese"],
      city: "San Francisco",
      state: "CA",
      country: "USA",
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
      ]
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
      profileImage: "/api/placeholder/80/80",
      gender: "Female",
      dateOfBirth: new Date("1981-11-05"),
      languages: ["English", "Mandarin"],
      city: "Seattle",
      state: "WA",
      country: "USA",
      companyDetails: {
        company: "GreenScape Design",
        industry: "Landscaping & Architecture",
        founded: 2015,
        location: "Seattle, WA",
        industryFocus: ["Sustainable Landscaping", "Architecture", "Urban Design"]
      },
      managementExperience: 12
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
      profileImage: "/api/placeholder/80/80",
      gender: "Male",
      dateOfBirth: new Date("1984-06-25"),
      languages: ["English"],
      city: "Denver",
      state: "CO",
      country: "USA",
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
      ]
    }
  }
];