import * as React from 'react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Project, Milestone } from '.';
import styles from '../EProcurement.module.scss';

interface ProjectFormProps {
    onBack: () => void;
    onSubmit: (project: Omit<Project, 'id'>) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onBack, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        projectId: '',
        contractId: '',
        contractor: '',
        startDate: '',
        endDate: '',
        assignedOfficer: '',
        contractValue: '',
    });

    const [milestones, setMilestones] = useState<Omit<Milestone, 'id'>[]>([
        {
            title: '',
            description: '',
            dueDate: '',
            status: 'not-started' as const
        }
    ]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMilestoneChange = (index: number, field: string, value: string) => {
        setMilestones(prev => prev.map((milestone, i) =>
            i === index ? { ...milestone, [field]: value } : milestone
        ));
    };

    const addMilestone = () => {
        setMilestones(prev => [...prev, {
            title: '',
            description: '',
            dueDate: '',
            status: 'not-started'
        }]);
    };

    const removeMilestone = (index: number) => {
        if (milestones.length > 1) {
            setMilestones(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const projectMilestones: Milestone[] = milestones.map((milestone, index) => ({
            ...milestone,
            id: (index + 1).toString()
        }));

        const newProject: Omit<Project, 'id'> = {
            ...formData,
            contractValue: parseFloat(formData.contractValue) || 0,
            status: 'not-started',
            milestones: projectMilestones,
            notes: [],
            files: [],
            progress: 0,
        };

        onSubmit(newProject);
    };

    const isFormValid = formData.title && formData.projectId && formData.contractId && formData.contractor &&
        formData.startDate && formData.endDate && formData.assignedOfficer &&
        formData.contractValue && milestones.every(m => m.title && m.description && m.dueDate);

    return (
        // <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button2 variant="ghost" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button2>
                    <h1 className="text-2xl font-bold">Register New Contract Project</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Contract Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${styles['no-after']} ${styles['no-before']}`}>
                            <FormField>
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter project title"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="projectId">Project ID *</Label>
                                <Input
                                    id="projectId"
                                    value={formData.projectId}
                                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                                    placeholder="e.g., PROJ-2024-001"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="contractId">Contract ID *</Label>
                                <Input
                                    id="contractId"
                                    value={formData.contractId}
                                    onChange={(e) => handleInputChange('contractId', e.target.value)}
                                    placeholder="e.g., CONT-2024-001"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="contractor">Contractor Name *</Label>
                                <Input
                                    id="contractor"
                                    value={formData.contractor}
                                    onChange={(e) => handleInputChange('contractor', e.target.value)}
                                    placeholder="Enter contractor/company name"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="contractValue">Contract Value (₦) *</Label>
                                <Input
                                    id="contractValue"
                                    type="number"
                                    value={formData.contractValue}
                                    onChange={(e) => handleInputChange('contractValue', e.target.value)}
                                    placeholder="Enter contract value"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="assignedOfficer">Assigned Monitoring Officer *</Label>
                                <Input
                                    id="assignedOfficer"
                                    value={formData.assignedOfficer}
                                    onChange={(e) => handleInputChange('assignedOfficer', e.target.value)}
                                    placeholder="Enter government officer name"
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="startDate">Contract Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField>
                                <Label htmlFor="endDate">Contract End Date *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    required
                                />
                            </FormField>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Project Milestones</CardTitle>
                            <Button2 variant="outline" onClick={addMilestone}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Milestone
                            </Button2>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Milestone {index + 1}</h4>
                                    {milestones.length > 1 && (
                                        <IconButton onClick={() => removeMilestone(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </IconButton>
                                    )}
                                </div>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${styles['no-after']} ${styles['no-before']}`}>
                                    <FormField>
                                        <Label>Milestone Title *</Label>
                                        <Input
                                            value={milestone.title}
                                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                            placeholder="Enter milestone title"
                                            required
                                        />
                                    </FormField>

                                    <FormField>
                                        <Label>Expected Completion Date *</Label>
                                        <Input
                                            type="date"
                                            value={milestone.dueDate}
                                            onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                            required
                                        />
                                    </FormField>
                                </div>

                                <FormField>
                                    <Label>Description *</Label>
                                    <Textarea
                                        value={milestone.description}
                                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                        placeholder="Describe what the contractor needs to deliver"
                                        rows={2}
                                        required
                                    />
                                </FormField>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isFormValid} className="flex-1">
                        Register Project
                    </Button>
                </div>
            </form>
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
    type?: 'button' | 'submit';
    variant?: 'default' | 'outline' | 'ghost';
    disabled?: boolean;
    className?: string;
}> = ({ children, onClick, type = 'button', variant = 'default', disabled = false, className = '' }) => {
    const baseClasses = 'px-4 py-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};


const Button2: React.FC<{
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

const Input: React.FC<{
    id?: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}> = ({ id, type = 'text', value, onChange, placeholder, required }) => (
    <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
);

const Textarea: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
}> = ({ value, onChange, placeholder, rows = 3, required }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
    />
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {children}
    </label>
);

const FormField: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="space-y-2">
        {children}
    </div>
);

const IconButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors inline-flex items-center justify-center"
    >
        {children}
    </button>
);

export default ProjectForm;