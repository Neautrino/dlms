'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CreateProjectForm from '@/components/CreateProjectForm';

export default function CreateProjectPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </button>
      </div>

      <div className=" rounded-2xl shadow-lg p-8">
        <CreateProjectForm onClose={() => router.push('/projects')} />
      </div>
    </div>
  );
} 