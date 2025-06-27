
import * as React from 'react';
import { Eye, Plus, Filter } from 'lucide-react';
import { Project, formatCurrency } from './index';

interface ProjectListProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
    handleNewProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect, handleNewProject }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
            case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // const formatDate = (dateString: string) => {
    //     return new Date(dateString).toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric'
    //     });
    // };

    // const getCompletedMilestones = (project: Project) => {
    //     const completed = project.milestones.filter(m => m.status === 'completed').length;
    //     const total = project.milestones.length;
    //     return { completed, total };
    // };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contract Projects Overview</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={handleNewProject}>
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4">Project ID</th>
                            <th className="text-left py-3 px-4">Contract ID</th>
                            <th className="text-left py-3 px-4">Project Title</th>
                            <th className="text-left py-3 px-4">Contractor</th>
                            <th className="text-left py-3 px-4">Contract Value</th>
                            {/* <th className="text-left py-3 px-4">Milestones</th> */}
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Progress</th>
                            <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => {
                            // const { completed, total } = getCompletedMilestones(project);
                            return (
                                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-sm">{project.projectId}</td>
                                    <td className="px-4 py-3 font-mono text-sm">{project.contractId}</td>
                                    <td className="px-4 py-3 font-medium">{project.title}</td>
                                    <td className="px-4 py-3">{project.contractor}</td>
                                    <td className="px-4 py-3 font-medium">{formatCurrency(project.contractValue)}</td>
                                    {/* <td className="px-4 py-3">
                                        <span className="text-sm font-medium">
                                            {completed}/{total}
                                        </span>
                                    </td> */}
                                    <td className="px-4 py-3">
                                        <Badge className={getStatusColor(project.status)}>
                                            {project.status.replace('-', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="w-full max-w-[100px]">
                                            <ProgressBar value={project.progress} />
                                            <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <IconButton onClick={() => onProjectSelect(project)}>
                                            <Eye className="h-4 w-4" />
                                        </IconButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Helper Components
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
        {children}
    </span>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${value}%` }}
        />
    </div>
);

const IconButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
    >
        {children}
    </button>
);

export default ProjectList;