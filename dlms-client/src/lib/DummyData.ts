const mockProjects = [
    {
      manager: "manager1",
      title: "DeFi Platform Development",
      metadataUri: "https://example.com/metadata/1",
      dailyRate: BigInt(5000),
      durationDays: 90,
      maxLabourers: 5,
      labourCount: 3,
      status: "open" as const,
      escrowAccount: "escrow1",
      timestamp: BigInt(Date.now()),
      index: 1
    },
    {
      manager: "manager2",
      title: "Smart Contract Audit",
      metadataUri: "https://example.com/metadata/2",
      dailyRate: BigInt(3000),
      durationDays: 14,
      maxLabourers: 3,
      labourCount: 2,
      status: "open" as const,
      escrowAccount: "escrow2",
      timestamp: BigInt(Date.now()),
      index: 2
    },
    {
      manager: "manager3",
      title: "NFT Marketplace UI/UX",
      metadataUri: "https://example.com/metadata/3",
      dailyRate: BigInt(4000),
      durationDays: 30,
      maxLabourers: 4,
      labourCount: 1,
      status: "open" as const,
      escrowAccount: "escrow3",
      timestamp: BigInt(Date.now()),
      index: 3
    }
  ];