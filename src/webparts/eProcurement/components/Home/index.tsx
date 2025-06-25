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
      { id: "REQ-2023-001", title: "Office Furniture Procurement", department: "Admin", status: "In Progress", stage: "Tender Evaluation", priority: "Medium", amount: "₦2,500,000" },
      { id: "REQ-2023-002", title: "IT Equipment Upgrade", department: "ICT", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦15,000,000" },
      { id: "REQ-2023-003", title: "Vehicle Maintenance Services", department: "Transport", status: "Completed", stage: "Payment Processing", priority: "Low", amount: "₦800,000" },
      { id: "REQ-2024-004", title: "Generator Replacement", department: "Facilities", status: "Rejected", stage: "Initial Screening", priority: "High", amount: "₦6,750,000" },
      { id: "REQ-2024-005", title: "Training for New Recruits", department: "HR", status: "Approved", stage: "Budget Allocation", priority: "Medium", amount: "₦1,200,000" },
      { id: "REQ-2024-006", title: "Cloud Storage Subscription", department: "ICT", status: "Pending Approval", stage: "HOD Review", priority: "High", amount: "₦3,000,000" },
      { id: "REQ-2024-007", title: "Conference Room Upgrade", department: "Admin", status: "In Progress", stage: "Vendor Engagement", priority: "Medium", amount: "₦5,500,000" },
      { id: "REQ-2024-008", title: "Fleet Expansion", department: "Transport", status: "Completed", stage: "Final Audit", priority: "High", amount: "₦22,000,000" },
      { id: "REQ-2025-009", title: "ERP License Renewal", department: "ICT", status: "In Progress", stage: "Procurement Approval", priority: "High", amount: "₦9,000,000" },
      { id: "REQ-2025-010", title: "Medical Supplies Procurement", department: "Health", status: "Pending Approval", stage: "Internal Review", priority: "High", amount: "₦4,300,000" },
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
        { id: 'pending', name: 'Pending Review' },
        { id: 'approved', name: 'Approved' },
        { id: 'rejected', name: 'Rejected' }
      ]
    };
  
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
      case 'new-requisition':
        return <Requisition sampleRequests={sampleRequests} />;
      case 'approvals':
        return <Approvals sampleRequests={sampleRequests} />;
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