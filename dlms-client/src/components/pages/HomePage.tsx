'use client'

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Users } from 'lucide-react';
import { useAtom } from 'jotai';
import { projectAtom } from '@/lib/atoms';
import { useEffect, useState } from 'react';
import type { Project } from '@/types/contract';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function HomePage() {
  const [project, setProject] = useAtom(projectAtom);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          setProject(data[0]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setProject]);

  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recent Projects</h1>
        <Button>Post a Project</Button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {projects.map((project) => (
          <motion.div
            key={project.publicKey}
            variants={item}
            className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground">Manager: {project.manager}</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>

            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>{project.dailyRate} DLT/day</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{project.durationDays} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{project.labourCount}/{project.maxLabourers} labourers</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Status: {typeof project.status === 'object' ? Object.keys(project.status)[0] : project.status}
              </Badge>
              <Badge variant="secondary">
                Index: {project.index}
              </Badge>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}