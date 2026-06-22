import * as React from 'react';
import { useState } from 'react';
// import { BarChart3, Plus } from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectDetails from './ProjectDetails';
import ProjectForm from './ProjectForm';

export interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
    completedDate?: string;
}

export interface Project {
    id: string;
    title: string;
    projectId: string;
    contractId: string;
    contractor: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
    startDate: string;
    endDate: string;
    assignedOfficer: string;
    milestones: Milestone[];
    notes: string[];
    files: { name: string; url: string; uploadedDate: string }[];
    progress: number;
    contractValue: number;  // Value of the contract awarded
}

interface IProjectManagement {
    sampleProjects: Project[];  // Optional initial projects data, can be fetched from an API or passed as props
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const ProjectManagement: React.FC<IProjectManagement> = ({sampleProjects}) => {
    const [activeView, setActiveView] = useState<'list' | 'details' | 'form'>('list');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [userRole] = useState<'admin' | 'officer' | 'manager'>('officer');

    // Mock projects data - representing projects awarded to external contractors
    const [projects, setProjects] = useState<Project[]>(sampleProjects);

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project);
        setActiveView('details');
    };

    const handleProjectUpdate = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);
    };

    const handleNewProject = () => {
        setSelectedProject(null);
        setActiveView('form');
    };

    const handleProjectCreate = (newProject: Omit<Project, 'id'>) => {
        const project: Project = {
            ...newProject,
            id: Date.now().toString()
        };
        setProjects(prev => [...prev, project]);
        setActiveView('list');
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
                {activeView === 'list' && (
                    <>
                        <ProjectList
                            projects={projects}
                            onProjectSelect={handleProjectSelect}
                            handleNewProject={handleNewProject}
                        />
                    </>
                )}

                {activeView === 'details' && selectedProject && (
                    <ProjectDetails
                        project={selectedProject}
                        onBack={() => setActiveView('list')}
                        onUpdate={handleProjectUpdate}
                        userRole={userRole}
                    />
                )}

                {activeView === 'form' && (
                    <ProjectForm
                        onBack={() => setActiveView('list')}
                        onSubmit={handleProjectCreate}
                    />
                )}
            </div>
        </main>
    );
};

export default ProjectManagement;
