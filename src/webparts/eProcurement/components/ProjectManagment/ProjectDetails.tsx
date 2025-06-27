
import * as React from 'react';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, FileText, Upload, Plus } from 'lucide-react';
import { Project, Milestone, formatCurrency } from './ProjectMonitoring';
import styles from '../EProcurement.module.scss';

interface ProjectDetailsProps {
    project: Project;
    onBack: () => void;
    onUpdate: (project: Project) => void;
    userRole: 'admin' | 'officer' | 'manager';
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onBack, onUpdate, userRole }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState<Project>(project);
    const [newNote, setNewNote] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'delayed': return 'bg-red-100 text-red-800';
            case 'not-started': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getMilestoneIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
            case 'delayed': return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'not-started': return <Clock className="h-5 w-5 text-gray-400" />;
            default: return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSave = () => {
        // Recalculate progress based on completed milestones
        const completedMilestones = editedProject.milestones.filter(m => m.status === 'completed').length;
        const totalMilestones = editedProject.milestones.length;
        const newProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

        // Update project status based on progress
        let newStatus = editedProject.status;
        if (newProgress === 100) {
            newStatus = 'completed';
        } else if (newProgress > 0) {
            newStatus = 'in-progress';
        }

        const updatedProject = {
            ...editedProject,
            progress: newProgress,
            status: newStatus
        };

        onUpdate(updatedProject);
        setEditedProject(updatedProject);
        setIsEditing(false);
    };

    const handleMilestoneStatusChange = (milestoneId: string, newStatus: Milestone['status']) => {
        const updatedMilestones = editedProject.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
                return {
                    ...milestone,
                    status: newStatus,
                    completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
                };
            }
            return milestone;
        });

        setEditedProject(prev => ({
            ...prev,
            milestones: updatedMilestones
        }));
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            const timestampedNote = `${new Date().toLocaleDateString()} - ${newNote.trim()}`;
            setEditedProject(prev => ({
                ...prev,
                notes: [...prev.notes, timestampedNote]
            }));
            setNewNote('');
            setShowAddNote(false);
        }
    };

    const handleProjectStatusChange = (newStatus: Project['status']) => {
        setEditedProject(prev => ({
            ...prev,
            status: newStatus
        }));
    };

    const canEdit = userRole === 'officer' || userRole === 'manager';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                    <h1 className="text-2xl font-bold">{project.title}</h1>
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                Update Project
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Contract Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Contract Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${styles['no-after']} ${styles['no-before']}`}>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Project ID</label>
                            <p className="font-mono">{project.projectId}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Contract ID</label>
                            <p className="font-mono">{project.contractId}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Contractor</label>
                            <p className="font-medium">{project.contractor}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Contract Value</label>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-green-600">{formatCurrency(project.contractValue)}</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Monitoring Officer</label>
                            <p>{project.assignedOfficer}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Start Date</label>
                            <p>{formatDate(project.startDate)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">End Date</label>
                            <p>{formatDate(project.endDate)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Project Status</label>
                            {isEditing && canEdit ? (
                                <Select value={editedProject.status} onValueChange={handleProjectStatusChange}>
                                    <SelectOption value="not-started">Not Started</SelectOption>
                                    <SelectOption value="in-progress">In Progress</SelectOption>
                                    <SelectOption value="completed">Completed</SelectOption>
                                    <SelectOption value="delayed">Delayed</SelectOption>
                                </Select>
                            ) : (
                                <Badge className={getStatusColor(project.status)}>
                                    {project.status.replace('-', ' ')}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Overall Progress</label>
                        <div className="mt-2">
                            <ProgressBar value={project.progress} />
                            <p className="text-sm text-gray-500 mt-1">{project.progress}% Complete</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contractor Milestones */}
            <Card>
                <CardHeader>
                    <CardTitle>Contractor Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {editedProject.milestones.map((milestone, index) => (
                            <div key={milestone.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                                <div className="flex-shrink-0 mt-1">
                                    {getMilestoneIcon(milestone.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{milestone.title}</h4>
                                        {isEditing && canEdit ? (
                                            <Select
                                                value={milestone.status}
                                                onValueChange={(value: Milestone['status']) => handleMilestoneStatusChange(milestone.id, value)}
                                            >
                                                <SelectOption value="not-started">Not Started</SelectOption>
                                                <SelectOption value="in-progress">In Progress</SelectOption>
                                                <SelectOption value="completed">Completed</SelectOption>
                                                <SelectOption value="delayed">Delayed</SelectOption>
                                            </Select>
                                        ) : (
                                            <Badge className={getStatusColor(milestone.status)}>
                                                {milestone.status.replace('-', ' ')}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                        <span>Expected: {formatDate(milestone.dueDate)}</span>
                                        {milestone.completedDate && (
                                            <span>Completed: {formatDate(milestone.completedDate)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Monitoring Notes */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Monitoring Notes</CardTitle>
                        {canEdit && !showAddNote && (
                            <Button variant="outline" size="sm" onClick={() => setShowAddNote(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Note
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showAddNote && (
                        <div className="space-y-2">
                            <Textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add monitoring notes, contractor communications, or project updates..."
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAddNote}>
                                    Add Note
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setShowAddNote(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {editedProject.notes.map((note, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">{note}</p>
                            </div>
                        ))}
                        {editedProject.notes.length === 0 && !showAddNote && (
                            <p className="text-gray-500 text-sm">No monitoring notes added yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Contract Documents */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Contract Documents</CardTitle>
                        {canEdit && (
                            <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {project.files.map((file, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div className="flex-1">
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-500">Uploaded: {formatDate(file.uploadedDate)}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Download
                                </Button>
                            </div>
                        ))}
                        {project.files.length === 0 && (
                            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Helper Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
        {children}
    </div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-900">
        {children}
    </h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

const Button: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm';
    className?: string;
}> = ({ children, onClick, variant = 'default', size = 'default', className = '' }) => {
    const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center';
    const sizeClasses = {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 text-sm'
    };
    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
        {children}
    </span>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-3">
        <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${value}%` }}
        />
    </div>
);

const Select: React.FC<{
    children: React.ReactNode;
    value: string;
    onValueChange: (value: any) => void;
    className?: string;
}> = ({ children, value, onValueChange, className = '' }) => (
    <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`w-32 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
        {children}
    </select>
);

const SelectOption: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => (
    <option value={value}>{children}</option>
);

const Textarea: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
}> = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
    />
);

export default ProjectDetails;
