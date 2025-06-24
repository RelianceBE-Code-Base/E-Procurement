import * as React from 'react';
import  { useState } from 'react';
import { 
  ChevronRight, FileText, Users, CheckCircle, Clock, AlertCircle, Search, Plus, Filter, 
  Download, Eye, Home, Settings, Bell, User, Menu, X, BarChart3, ShoppingCart, 
  ClipboardList, DollarSign, Archive, HelpCircle, LogOut 
} from 'lucide-react';
import SideNav from '../SideNavigation';
import TopNavigation from '../TopNavigation'
import SubNavigation from '../SubNavigation';


// Main Component
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
      { id: "REQ-2025-001", title: "Office Furniture Procurement", department: "Admin", status: "In Progress", stage: "Tender Evaluation", priority: "Medium", amount: "₦2,500,000" },
      { id: "REQ-2025-002", title: "IT Equipment Upgrade", department: "ICT", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦15,000,000" },
      { id: "REQ-2025-003", title: "Vehicle Maintenance Services", department: "Transport", status: "Completed", stage: "Payment Processing", priority: "Low", amount: "₦800,000" }
    ];
  
    const sidenavItems = [
      { id: 'dashboard', name: 'Dashboard', icon: Home, active: true },
      { id: 'requests', name: 'All Requests', icon: FileText },
      { id: 'new-request', name: 'New Request', icon: Plus },
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
      requests: [
        { id: 'all', name: 'All Requests' },
        { id: 'active', name: 'Active' },
        { id: 'completed', name: 'Completed' },
        { id: 'draft', name: 'Drafts' }
      ],
      'new-request': [
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
      switch(activeTab) {
        case 'dashboard':
          //return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
        case 'new-request':
          //return <NewRequestForm />;
        case 'approvals':
          //return <Approvals sampleRequests={sampleRequests} />;
        default:
          //return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
      }
    };
  
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