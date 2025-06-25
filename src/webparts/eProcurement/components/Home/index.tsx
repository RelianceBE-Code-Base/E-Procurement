import * as React from 'react';
import { useState } from 'react';
//import styles from '../EProcurement.module.scss';
import { FileText, CheckCircle, Plus, Home, BarChart3, ShoppingCart, ClipboardList, DollarSign, Archive,Milestone, Building } from 'lucide-react';
import SideNav from '../SideNavigation';
import TopNavigation from '../TopNavigation';
import SubNavigation from '../SubNavigation';
import AnnualPlan from '../AnnualPlan'
import Footer from '../Footer'
import Dashboard from '../Dashboard';
import Requisition from '../Requisition';
import Approvals from '../Approvals'
import TenderManagement from '../TenderManagement';
import ContractManagement from '../ContrctManagement';
import AllRequisitions from '../Requisition/allRequisitions';
import DepartmentalNeeds from '../DepartmentalNeeds';


const FIRSProcurementSystem = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedStage, setSelectedStage] = useState(null);
    const [sidenavOpen, setSidenavOpen] = useState(true);
    const [activeSubtab, setActiveSubtab] = useState('overview');
  
    const stages = [
      { id: 0, name: "Annual Procurement Preparation", status: "completed", color: "bg-green-500" },
      { id: 1, name: "Requisition Initiation", status: "active", color: "bg-blue-500" },
      { id: 2, name: "EC Approval & Routing", status: "pending", color: "bg-yellow-500" },
      { id: 3, name: "Procurement Plan Validation", status: "pending", color: "bg-gray-400" },
      { id: 4, name: "Tendering Process Initiation", status: "pending", color: "bg-gray-400" },
      { id: 5, name: "Tender Planning & Execution", status: "pending", color: "bg-gray-400" },
      { id: 6, name: "Evaluation & Approval", status: "pending", color: "bg-gray-400" },
      { id: 7, name: "Contract Award", status: "pending", color: "bg-gray-400" },
      { id: 8, name: "Project Monitoring", status: "pending", color: "bg-gray-400" },
      { id: 9, name: "Completion & Payment", status: "pending", color: "bg-gray-400" }
    ];
  
    const sampleRequests = [
      { id: "REQ-2023-001", title: "Office Furniture Procurement", department: "Admin", status: "In Progress", stage: "Tender Evaluation", priority: "Medium", amount: "₦2,500,000", tenderStatus: "Validated" },
      { id: "REQ-2023-002", title: "IT Equipment Upgrade", department: "ICT", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦15,000,000", tenderStatus: "Validated" },
      { id: "REQ-2023-003", title: "Vehicle Maintenance Services", department: "Transport", status: "Completed", stage: "Payment Processing", priority: "Low", amount: "₦800,000", tenderStatus: "Validated" },
      { id: "REQ-2024-004", title: "Generator Replacement", department: "Facilities", status: "Rejected", stage: "Initial Screening", priority: "High", amount: "₦6,750,000", tenderStatus: "Assigned" },
      { id: "REQ-2024-005", title: "Training for New Recruits", department: "HR", status: "Approved", stage: "Budget Allocation", priority: "Medium", amount: "₦1,200,000", tenderStatus: "Assigned" },
      { id: "REQ-2024-006", title: "Cloud Storage Subscription", department: "ICT", status: "Pending Approval", stage: "HOD Review", priority: "High", amount: "₦3,000,000", tenderStatus: "SBD Prepared" },
      { id: "REQ-2024-007", title: "Conference Room Upgrade", department: "Admin", status: "In Progress", stage: "Vendor Engagement", priority: "Medium", amount: "₦5,500,000", tenderStatus: "SBD Prepared" },
      { id: "REQ-2024-008", title: "Fleet Expansion", department: "Transport", status: "Completed", stage: "Final Audit", priority: "High", amount: "₦22,000,000", tenderStatus: "Awaiting Approval" },
      { id: "REQ-2025-009", title: "ERP License Renewal", department: "ICT", status: "In Progress", stage: "Procurement Approval", priority: "High", amount: "₦9,000,000", tenderStatus: "Approved" },
      { id: "REQ-2025-010", title: "Medical Supplies Procurement", department: "Health", status: "Pending Approval", stage: "Internal Review", priority: "High", amount: "₦4,300,000", tenderStatus: "Validated" },
    ];


    const sampleApprovalRequests = [
      {
        id: "REQ-2023-001", title: "Office Furniture Procurement", description: "Ergonomic chairs and desks for new hires", requester: "Sarah Williams", department: "Admin", date: "2023-03-15", amount: "₦2,500,000", status: "In Progress", category: "Furniture", priority: "Medium", neededBy: "2023-05-20", quantity: "25", stage: "Tender Evaluation"
      },
      {
        id: "REQ-2023-002", title: "IT Equipment Upgrade", description: "New laptops and monitors for development team", requester: "David Brown", department: "ICT", date: "2023-04-02", amount: "₦15,000,000", status: "pending Approval", category: "Hardware", priority: "High", neededBy: "2023-06-30", quantity: "30", stage: "EC Review"
      },
      {
        id: "REQ-2023-003", title: "Vehicle Maintenance Services", description: "Routine servicing for company fleet", requester: "Robert Johnson", department: "Transport", date: "2023-05-10", amount: "₦800,000", status: "Completed", category: "Maintenance", priority: "Low", neededBy: "2023-05-25", quantity: "12", stage: "Payment Processing"
      },
      {
        id: "REQ-2024-004", title: "Generator Replacement", description: "150KVA industrial generator for HQ", requester: "James Wilson", department: "Facilities", date: "2024-01-05", amount: "₦6,750,000", status: "rejected", category: "Equipment", priority: "High", neededBy: "2024-03-15", quantity: "1", stage: "Initial Screening"
      },
      {
        id: "REQ-2024-005", title: "Training for New Recruits", description: "Onboarding program for Q1 hires", requester: "Emily Davis", department: "HR", date: "2024-01-12", amount: "₦1,200,000", status: "approved", category: "Training", priority: "Medium", neededBy: "2024-02-28", quantity: "15", stage: "Budget Allocation"
      },
      {
        id: "REQ-2024-006", title: "Cloud Storage Subscription", description: "Enterprise cloud storage for 3 years", requester: "Daniel Miller", department: "ICT", date: "2024-01-18", amount: "₦3,000,000", status: "pending Approval", category: "Software", priority: "High", neededBy: "2024-02-15", quantity: "1", stage: "HOD Review"
      },
      {
        id: "REQ-2024-007", title: "Conference Room Upgrade", description: "AV equipment and furniture for main conference room", requester: "Jessica Taylor", department: "Admin", date: "2024-01-22", amount: "₦5,500,000", status: "In Progress", category: "Facilities", priority: "Medium", neededBy: "2024-03-10", quantity: "1", stage: "Vendor Engagement"
      },
      {
        id: "REQ-2024-008", title: "Fleet Expansion", description: "2 new Toyota Hilux for field operations", requester: "Michael Anderson", department: "Transport", date: "2024-01-25", amount: "₦22,000,000", status: "Completed", category: "Vehicles", priority: "High", neededBy: "2024-03-01", quantity: "2", stage: "Final Audit"
      },
      {
        id: "REQ-2025-009", title: "ERP License Renewal", description: "3-year renewal for enterprise ERP system", requester: "Jennifer Thomas", department: "ICT", date: "2025-01-05", amount: "₦9,000,000", status: "In Progress", category: "Software", priority: "High", neededBy: "2025-02-28", quantity: "1", stage: "Procurement Approval"
      },
      {
        id: "REQ-2025-010", title: "Medical Supplies Procurement", description: "First aid kits and emergency medical supplies", requester: "Christopher Martinez", department: "Health", date: "2025-01-08", amount: "₦4,300,000", status: "pending Approval", category: "Medical", priority: "High", neededBy: "2025-02-15", quantity: "50", stage: "Internal Review"
      },
      {
        id: "REQ-2025-011", title: "Workstation Chairs Purchase", description: "Ergonomic chairs for all staff", requester: "Amanda Garcia", department: "Admin", date: "2025-01-12", amount: "₦1,100,000", status: "Completed", category: "Furniture", priority: "Low", neededBy: "2025-02-01", quantity: "100", stage: "Reconciliation"
      },
      {
        id: "REQ-2025-012", title: "Annual Staff Retreat", description: "3-day retreat for all employees", requester: "Matthew Robinson", department: "HR", date: "2025-01-15", amount: "₦7,800,000", status: "approved", category: "Events", priority: "Medium", neededBy: "2025-03-20", quantity: "150", stage: "Vendor Selection"
      },
      {
        id: "REQ-2025-013", title: "Network Infrastructure Upgrade", description: "New switches and routers for all offices", requester: "Elizabeth Clark", department: "ICT", date: "2025-01-18", amount: "₦11,200,000", status: "In Progress", category: "Hardware", priority: "High", neededBy: "2025-04-30", quantity: "15", stage: "Implementation"
      },
      {
        id: "REQ-2025-014", title: "Document Archiving System", description: "Digital archiving solution for records department", requester: "Andrew Rodriguez", department: "Records", date: "2025-01-20", amount: "₦3,400,000", status: "rejected", category: "Software", priority: "Medium", neededBy: "2025-03-01", quantity: "1", stage: "HOD Review"
      },
      {
        id: "REQ-2025-015", title: "CCTV Installation", description: "Security cameras for all office entrances", requester: "Nicole Lewis", department: "Security", date: "2025-01-22", amount: "₦6,000,000", status: "approved", category: "Security", priority: "High", neededBy: "2025-03-15", quantity: "20", stage: "Tender Evaluation"
      },
      {
        id: "REQ-2024-001", title: "Office Laptops for Development Team", description: "10 high-performance laptops for the development team", requester: "John Doe", department: "IT Department", date: "2024-01-15", amount: "₦25,000", status: "pending", category: "Hardware", priority: "high", neededBy: "2024-02-15", quantity: "10", stage: "Initial Review"
      },
      {
        id: "REQ-2024-002", title: "Office Supplies - Q1", description: "Quarterly office supplies including paper, pens, folders", requester: "Jane Smith", department: "Administration", date: "2024-01-10", amount: "₦1,500", status: "approved", category: "Supplies", priority: "medium", neededBy: "2024-02-01", quantity: "1", stage: "Completed"
      },
      {
        id: "REQ-2024-003", title: "Generator Replacement", description: "New 50KVA generator for head office", requester: "Michael Johnson", department: "Facilities", date: "2024-01-18", amount: "₦6,750", status: "pending", category: "Equipment", priority: "high", neededBy: "2024-03-01", quantity: "1", stage: "Evaluation"
      }
      ];
    
  
    const sidenavItems = [
      { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
      { id: 'annual', name: 'Annual Planning', icon: Milestone },
      { id: 'dept', name: 'Departmental Needs', icon: Building },
      { id: 'new-requisition', name: 'New Requistion Request', icon: Plus },
      { id: 'requisitions', name: 'All Requistion Requests', icon: FileText },
      { id: 'approvals', name: 'Approvals', icon: CheckCircle },
      { id: 'tenders', name: 'Tender Management', icon: ShoppingCart },
      { id: 'contracts', name: 'Contract Management', icon: ClipboardList },
      { id: 'payments', name: 'Payment Processing', icon: DollarSign },
      { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
      { id: 'archive', name: 'Archive', icon: Archive }
    ];
  
    const subtabsByMainTab = {
      dashboard: [
        { id: 'overview', name: 'Overview' },
        { id: 'workflow', name: 'Process Workflow' },
        { id: 'analytics', name: 'Analytics' }
      ],
      annual: [
        { id: 'overview', name: 'Overview' },
        { id: 'workflow', name: 'Process Workflow' },
        { id: 'analytics', name: 'Analytics' }
      ],
      requisition: [
        { id: 'all', name: 'All Requests' },
        { id: 'active', name: 'Active' },
        { id: 'completed', name: 'Completed' },
        { id: 'draft', name: 'Drafts' }
      ],
      'new-requisition': [
        { id: 'goods', name: 'Goods' },
        { id: 'works', name: 'Works' },
        { id: 'services', name: 'Services' }
      ],
      approvals: [
        { id: 'pending', name: 'pending Review' },
        { id: 'approved', name: 'approved' },
        { id: 'rejected', name: 'rejected' }
      ]
    };
  
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
      case 'new-requisition':
        return <Requisition />;
      case 'dept':
        return <DepartmentalNeeds />;
      case 'approvals':
        return <Approvals sampleRequests={sampleApprovalRequests} />;
      case 'annual':
        return <AnnualPlan activeTab={activeTab} sampleRequests={sampleRequests} />;
      case 'tenders':
        return <TenderManagement sampleRequests={sampleRequests} />;
      case 'requisitions':
        return <AllRequisitions sampleRequests={sampleRequests} />;
      case 'contracts':
        return <ContractManagement sampleRequests={sampleRequests} />;
      case 'dept':
        return <ContractManagement sampleRequests={sampleRequests} />;
      default:
        return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
    }
  };
  console.log(selectedStage)
    return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Side Navigation */}
        <SideNav 
          sidenavOpen={sidenavOpen}
          setSidenavOpen={setSidenavOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidenavItems={sidenavItems}
        />
  
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <TopNavigation sidenavOpen={sidenavOpen} setSidenavOpen={setSidenavOpen} />
  
          {/* Sub Top Navigation */}
          <SubNavigation 
            subtabsByMainTab={subtabsByMainTab}
            activeTab={activeTab}
            activeSubTab={activeSubtab}
            setActiveSubTab={setActiveSubtab}
          />
  
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderMainContent()}
          </main>
  
          {/* Footer */}
          <Footer />
        </div>
  
        {/* Stage Detail Modal */}
        {/* <StageDetailModal selectedStage={selectedStage} setSelectedStage={setSelectedStage} /> */}
      </div>
    );
  };
  
  export default FIRSProcurementSystem;