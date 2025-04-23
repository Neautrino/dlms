import { NextResponse } from 'next/server';
import { program } from '@/lib/program';

export async function GET() {
  try {
    const projects = await program.account.project.all();
    
    // Transform the data to match our frontend type
    const transformedProjects = projects.map(project => ({
      manager: project.account.manager.toString(),
      title: project.account.title,
      metadataUri: project.account.metadataUri,
      dailyRate: Number(project.account.dailyRate),
      durationDays: project.account.durationDays,
      maxLabourers: project.account.maxLabourers,
      labourCount: project.account.labourCount,
      status: project.account.status,
      escrowAccount: project.account.escrowAccount.toString(),
      timestamp: Number(project.account.timestamp),
      index: project.account.index,
      publicKey: project.publicKey.toString()
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