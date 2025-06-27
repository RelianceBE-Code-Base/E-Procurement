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

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const ProjectManagement: React.FC = () => {
    const [activeView, setActiveView] = useState<'list' | 'details' | 'form'>('list');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [userRole] = useState<'admin' | 'officer' | 'manager'>('officer');

    // Mock projects data - representing projects awarded to external contractors
    const [projects, setProjects] = useState<Project[]>([
        {
            id: '1',
            title: 'Government Office Building Renovation',
            projectId: 'PROJ-2024-001',
            contractId: 'CONT-2024-004',
            contractor: 'ABC Construction Ltd',
            status: 'in-progress',
            startDate: '2024-01-15',
            endDate: '2024-06-15',
            assignedOfficer: 'John Smith',
            progress: 40,
            contractValue: 2500000,
            milestones: [
                { id: '1', title: 'Project Mobilization', description: 'Contractor team setup and site preparation', dueDate: '2024-01-30', status: 'completed', completedDate: '2024-01-28' },
                { id: '2', title: 'Demolition Phase', description: 'Removal of old fixtures and structures', dueDate: '2024-02-15', status: 'completed', completedDate: '2024-02-12' },
                { id: '3', title: 'Structural Work', description: 'Foundation and structural improvements', dueDate: '2024-03-30', status: 'in-progress' },
                { id: '4', title: 'Electrical & Plumbing', description: 'Installation of utilities', dueDate: '2024-05-15', status: 'not-started' },
                { id: '5', title: 'Final Inspection & Handover', description: 'Quality check and project completion', dueDate: '2024-06-15', status: 'not-started' }
            ],
            notes: [
                'Contractor requested extension due to material delays - approved for 2 weeks',
                'Monthly progress meeting scheduled for first Friday of each month',
                'Environmental compliance verified by site inspector'
            ],
            files: [
                { name: 'Signed_Contract.pdf', url: '#', uploadedDate: '2024-01-15' },
                { name: 'Progress_Report_Feb.pdf', url: '#', uploadedDate: '2024-02-28' },
                { name: 'Environmental_Clearance.pdf', url: '#', uploadedDate: '2024-01-20' }
            ]
        },
        {
            id: '2',
            title: 'IT Infrastructure Modernization',
            projectId: 'PROJ-2024-002',
            contractId: 'CONT-2024-005',
            contractor: 'TechCorp Solutions Inc',
            status: 'delayed',
            startDate: '2024-02-01',
            endDate: '2024-05-31',
            assignedOfficer: 'Sarah Johnson',
            progress: 25,
            contractValue: 1800000,
            milestones: [
                { id: '1', title: 'Network Assessment', description: 'Current infrastructure evaluation', dueDate: '2024-02-15', status: 'completed', completedDate: '2024-02-10' },
                { id: '2', title: 'Equipment Procurement', description: 'Hardware and software acquisition', dueDate: '2024-03-01', status: 'delayed' },
                { id: '3', title: 'System Installation', description: 'Network setup and configuration', dueDate: '2024-04-15', status: 'not-started' },
                { id: '4', title: 'Testing & Validation', description: 'System testing and user acceptance', dueDate: '2024-05-15', status: 'not-started' }
            ],
            notes: [
                'Contractor experiencing supply chain delays for specialized equipment',
                'Weekly status calls established to monitor progress',
                'Penalty clause activated due to milestone delays'
            ],
            files: [
                { name: 'Contract_Amendment_1.pdf', url: '#', uploadedDate: '2024-03-15' },
                { name: 'Network_Assessment_Report.pdf', url: '#', uploadedDate: '2024-02-12' }
            ]
        },
        {
            id: '3',
            title: 'Office Furniture Procurement',
            projectId: 'PROJ-2023-003',
            contractId: 'CONT-2023-006',
            contractor: 'Elegance Interiors Ltd.',
            status: 'completed',
            startDate: '2023-03-20',
            endDate: '2023-05-25',
            assignedOfficer: 'Sarah Williams',
            progress: 100,
            contractValue: 2500000,
            milestones: [
                { id: '1', title: 'Furniture Design Approval', description: 'Designs submitted and approved', dueDate: '2023-04-01', status: 'completed', completedDate: '2023-03-28' },
                { id: '2', title: 'Delivery', description: 'Furniture delivered to office', dueDate: '2023-05-10', status: 'completed', completedDate: '2023-05-08' },
                { id: '3', title: 'Installation & Setup', description: 'Furniture setup across departments', dueDate: '2023-05-20', status: 'completed', completedDate: '2023-05-18' }
            ],
            notes: [
                'Procurement completed without incident',
                'Final inspection signed off by Admin department'
            ],
            files: [
                { name: 'Furniture_Delivery_Slip.pdf', url: '#', uploadedDate: '2023-05-08' },
                { name: 'Final_Inspection_Report.pdf', url: '#', uploadedDate: '2023-05-20' }
            ]
        },
        {
            id: '4',
            title: 'Generator Replacement',
            projectId: 'PROJ-2024-004',
            contractId: 'CONT-2024-008',
            contractor: 'PowerHub Engineering',
            status: 'in-progress',
            startDate: '2024-01-10',
            endDate: '2024-03-10',
            assignedOfficer: 'James Wilson',
            progress: 85,
            contractValue: 6750000,
            milestones: [
                { id: '1', title: 'Old Generator Removal', description: 'Dismantling and clearing', dueDate: '2024-01-20', status: 'completed', completedDate: '2024-01-19' },
                { id: '2', title: 'New Generator Installation', description: 'Installation of 150KVA unit', dueDate: '2024-02-15', status: 'completed', completedDate: '2024-02-12' },
                { id: '3', title: 'Testing & Certification', description: 'Operational testing and safety checks', dueDate: '2024-03-10', status: 'in-progress' }
            ],
            notes: [
                'Certification stage pending external inspection',
                'Power capacity increased to meet peak demands'
            ],
            files: [
                { name: 'Installation_Report.pdf', url: '#', uploadedDate: '2024-02-12' }
            ]
        },
        {
            id: '5',
            title: 'Training for New Recruits',
            projectId: 'PROJ-2024-005',
            contractId: 'CONT-2024-009',
            contractor: 'GrowthEdge Academy',
            status: 'completed',
            startDate: '2024-01-15',
            endDate: '2024-02-28',
            assignedOfficer: 'Emily Davis',
            progress: 100,
            contractValue: 1200000,
            milestones: [
                { id: '1', title: 'Curriculum Development', description: 'Customize training modules', dueDate: '2024-01-25', status: 'completed', completedDate: '2024-01-24' },
                { id: '2', title: 'Training Sessions', description: 'Week-long onboarding program', dueDate: '2024-02-20', status: 'completed', completedDate: '2024-02-19' }
            ],
            notes: [
                'Sessions held across two locations',
                'Feedback from trainees overwhelmingly positive'
            ],
            files: [
                { name: 'Training_Certificates.pdf', url: '#', uploadedDate: '2024-02-28' }
            ]
        },
        {
            id: '6',
            title: 'Cloud Storage Subscription',
            projectId: 'PROJ-2024-006',
            contractId: 'CONT-2024-010',
            contractor: 'CloudByte Ltd.',
            status: 'delayed',
            startDate: '2024-01-20',
            endDate: '2024-03-01',
            assignedOfficer: 'Daniel Miller',
            progress: 90,
            contractValue: 3000000,
            milestones: [
                { id: '1', title: 'Vendor Setup', description: 'Cloud environment provisioned', dueDate: '2024-02-01', status: 'completed', completedDate: '2024-01-30' },
                { id: '2', title: 'Migration & Testing', description: 'Move of critical documents to cloud', dueDate: '2024-02-20', status: 'completed', completedDate: '2024-02-18' },
                { id: '3', title: 'Access Rollout', description: 'Assign roles and monitor access', dueDate: '2024-03-01', status: 'in-progress' }
            ],
            notes: [
                'System security reviewed by ICT team',
                'Onboarding training held for all users'
            ],
            files: [
                { name: 'Cloud_Usage_Policy.pdf', url: '#', uploadedDate: '2024-01-25' }
            ]
        },
        {
            id: '8',
            title: 'Fleet Expansion',
            projectId: 'PROJ-2024-008',
            contractId: 'CONT-2024-012',
            contractor: 'AutoEdge Motors',
            status: 'completed',
            startDate: '2024-01-28',
            endDate: '2024-03-10',
            assignedOfficer: 'Michael Anderson',
            progress: 100,
            contractValue: 22000000,
            milestones: [
                { id: '1', title: 'Vehicle Procurement', description: 'Order and receive vehicles', dueDate: '2024-02-15', status: 'completed', completedDate: '2024-02-14' },
                { id: '2', title: 'Inspection & Registration', description: 'Verify and register with FRSC', dueDate: '2024-03-01', status: 'completed', completedDate: '2024-02-28' }
            ],
            notes: [
                'Vehicles already deployed for field use',
                'Insurance certificates uploaded to fleet portal'
            ],
            files: [
                { name: 'Vehicle_Inspection_Report.pdf', url: '#', uploadedDate: '2024-03-01' }
            ]
        },
        {
            id: '9',
            title: 'ERP License Renewal',
            projectId: 'PROJ-2025-009',
            contractId: 'CONT-2025-001',
            contractor: 'Enterprise Systems NG',
            status: 'in-progress',
            startDate: '2025-01-10',
            endDate: '2025-02-25',
            assignedOfficer: 'Jennifer Thomas',
            progress: 50,
            contractValue: 9000000,
            milestones: [
                { id: '1', title: 'License Validation', description: 'Renew keys and support agreement', dueDate: '2025-01-25', status: 'completed', completedDate: '2025-01-23' },
                { id: '2', title: 'System Integration', description: 'Apply license to core systems', dueDate: '2025-02-15', status: 'in-progress' }
            ],
            notes: [
                'Renewal includes SLA extension for 3 years'
            ],
            files: [
                { name: 'ERP_Renewal_Agreement.pdf', url: '#', uploadedDate: '2025-01-20' }
            ]
        },
        {
            id: '10',
            title: 'Medical Supplies Procurement',
            projectId: 'PROJ-2025-010',
            contractId: 'CONT-2025-002',
            contractor: 'HealthMart Logistics',
            status: 'completed',
            startDate: '2025-01-10',
            endDate: '2025-02-15',
            assignedOfficer: 'Christopher Martinez',
            progress: 100,
            contractValue: 4300000,
            milestones: [
                { id: '1', title: 'Supply Chain Finalization', description: 'Confirm suppliers and delivery dates', dueDate: '2025-01-20', status: 'completed', completedDate: '2025-01-18' },
                { id: '2', title: 'Distribution to Units', description: 'Distribute to all clinics', dueDate: '2025-02-10', status: 'completed', completedDate: '2025-02-08' }
            ],
            notes: [
                'Project closed with zero discrepancy',
                'All items logged in asset management system'
            ],
            files: [
                { name: 'Delivery_Receipts.pdf', url: '#', uploadedDate: '2025-02-08' }
            ]
        }
    ]);

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
