import * as React from 'react';
import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Plus, Home, ShoppingCart, ClipboardList, DollarSign, Archive, Milestone, Building, Projector, BarChart3, Users } from 'lucide-react';
import SideNav from '../SideNavigation';
import TopNavigation from '../TopNavigation';
import SubNavigation from '../SubNavigation';
import AnnualPlan from '../AnnualPlan'
import Footer from '../Footer'
import Dashboard from '../Dashboard';
import Requisition from '../Requisition';
import Approvals from '../Approvals'
import TenderManagement from '../TenderManagement';
import ContractManagement from '../ContractManagement';
import AllRequisitions from '../Requisition/allRequisitions';
import DepartmentalNeeds, { IDetailsListItem } from '../DepartmentalNeeds';
import PaymentProcessing from '../PaymentProcessing';
import Archived from '../Archived';
import StageDetailModal from '../../Modals/stageDetailModal';
import ProjectManagement, { Project } from '../ProjectManagment';
import Reports from '../Reports';
import { useLocation } from 'react-router-dom';
import VendorManagement, { Vendor } from '../VendorManagement';
import FIRSAIFeatures from '../NRSAI/index';
//import NotificationsPanel from '../NRSAI/index2';


const FIRSProcurementSystem = () => {
  const [activeTab, setActiveTab] = useState('');
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
    { id: "REQ-2023-001", category: "Services", title: "Office Furniture Procurement", department: "Admin", status: "In Progress", stage: "Tender Evaluation", priority: "Medium", amount: "₦2,500,000", approvedAmount: "₦130,000,000", tenderStatus: "Validated" },
    { id: "REQ-2023-002", category: "Works", title: "IT Equipment Upgrade", department: "ICT", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦15,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Project Created" },
    { id: "REQ-2023-003", category: "Goods", title: "Vehicle Maintenance Services", department: "Transport", status: "Completed", stage: "Payment Processing", priority: "Low", amount: "₦800,000", approvedAmount: "₦130,000,000", tenderStatus: "SBD Distributed" },
    { id: "REQ-2024-004", category: "Works", title: "Generator Replacement", department: "Facilities", status: "Rejected", stage: "Initial Screening", priority: "High", amount: "₦6,750,000", approvedAmount: "₦130,000,000", tenderStatus: "Assigned" },
    { id: "REQ-2024-007", category: "Goods", title: "Conference Room Upgrade", department: "Admin", status: "In Progress", stage: "Vendor Engagement", priority: "Medium", amount: "₦5,500,000", approvedAmount: "₦130,000,000", tenderStatus: "SBD Prepared" },
    { id: "REQ-2024-008", category: "Services", title: "Fleet Expansion", department: "Transport", status: "Completed", stage: "Final Audit", priority: "High", amount: "₦22,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Tender Assigned" },
    { id: "REQ-2025-009", category: "Works", title: "ERP License Renewal", department: "ICT", status: "In Progress", stage: "Procurement Approval", priority: "High", amount: "₦9,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Awaiting Review" },
    { id: "REQ-2025-011", category: "Goods", title: "Security System Installation", department: "Security", status: "In Progress", stage: "Tender Evaluation", priority: "High", amount: "₦11,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Evaluation Completed" },
    { id: "REQ-2025-012", category: "Works", title: "Public Awareness Campaign", department: "PR", status: "Pending Approval", stage: "EC Review", priority: "Medium", amount: "₦7,800,000", approvedAmount: "₦130,000,000", tenderStatus: "Memo Prepared" },
    { id: "REQ-2025-013", category: "Services", title: "IT Security Audit", department: "ICT", status: "Pending Approval", stage: "Approval Routing", priority: "High", amount: "₦13,500,000", approvedAmount: "₦130,000,000", tenderStatus: "Executive Chairman Approval" },
    { id: "REQ-2025-014", category: "Works", title: "Renovation of Office Block A", department: "Facilities", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦25,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Tenders Board Approval" },
    { id: "REQ-2025-015", category: "Works", title: "Nationwide Survey Project", department: "Research", status: "Pending Approval", stage: "Approval Routing", priority: "High", amount: "₦120,000,000", approvedAmount: "₦130,000,000", tenderStatus: "FEC Approval" },
    { id: "REQ-2025-020", category: "Goods", title: "Public Sector Policy Consultancy", department: "Planning", status: "Pending Approval", stage: "Procurement Approval", priority: "Medium", amount: "₦32,000,000", approvedAmount: "₦130,000,000", tenderStatus: "BPP Approval" },
    { id: "REQ-2025-021", category: "Services", title: "Rural Electrification Project", department: "Energy", status: "In Progress", stage: "Final Routing", priority: "High", amount: "₦88,000,000", approvedAmount: "₦130,000,000", tenderStatus: "Approved" },
  ];

  const sampleContractRequests = [
    { id: "REQ-2023-001", title: "Office Furniture Procurement", department: "Admin", status: "Pending", stage: "Ready for Award Letter", finalApproval: "17-07-2025", amount: "₦2,500,000", tenderStatus: "Validated" },
    { id: "REQ-2023-002", title: "IT Equipment Upgrade", department: "ICT", status: "Pending", stage: "Ready for Award Letter", finalApproval: "17-07-2025", amount: "₦15,000,000", tenderStatus: "Project Created" },
    { id: "REQ-2023-003", title: "Vehicle Maintenance Services", department: "Transport", status: "Pending", stage: "Ready for Award Letter", finalApproval: "17-07-2025", amount: "₦800,000", tenderStatus: "SBD Distributed" },
    { id: "REQ-2024-004", title: "Generator Replacement", department: "Facilities", status: "In Progress", stage: "Ready for PO Issuance", finalApproval: "17-07-2025", amount: "₦6,750,000", tenderStatus: "Assigned" },
    { id: "REQ-2024-007", title: "Conference Room Upgrade", department: "Admin", status: "Completed", stage: "Contract Awaderd", finalApproval: "07-06-2025", amount: "₦5,500,000", tenderStatus: "SBD Prepared" },
    { id: "REQ-2024-008", title: "Fleet Expansion", department: "Transport", status: "Completed", stage: "Contract Awaderd", finalApproval: "07-03-2025", amount: "₦22,000,000", tenderStatus: "Tender Assigned" },
    { id: "REQ-2025-009", title: "ERP License Renewal", department: "ICT", status: "In Progress", stage: "Ready for PO Issuance", finalApproval: "07-06-2025", amount: "₦9,000,000", tenderStatus: "Awaiting Review" },
    { id: "REQ-2025-011", title: "Security System Installation", department: "Security", status: "In Progress", stage: "Ready for PO Issuance", finalApproval: "07-03-2025", amount: "₦11,000,000", tenderStatus: "Evaluation Completed" },
    { id: "REQ-2025-012", title: "Public Awareness Campaign", department: "PR", status: "Completed", stage: "Contract Awaderd", finalApproval: "07-03-2025", amount: "₦7,800,000", tenderStatus: "Memo Prepared" },
    { id: "REQ-2025-013", title: "IT Security Audit", department: "ICT", status: "Pending", stage: "Ready for Award Letter", finalApproval: "07-06-2025", amount: "₦13,500,000", tenderStatus: "Executive Chairman Approval" },
    { id: "REQ-2025-014", title: "Renovation of Office Block A", department: "Facilities", status: "Completed", stage: "Contract Awaderd", finalApproval: "07-03-2025", amount: "₦25,000,000", tenderStatus: "Tenders Board Approval" },
    { id: "REQ-2025-015", title: "Nationwide Survey Project", department: "Research", status: "Pending", stage: "Ready for Award Letter", finalApproval: "07-06-2025", amount: "₦120,000,000", tenderStatus: "FEC Approval" },
    { id: "REQ-2025-020", title: "Public Sector Policy Consultancy", department: "Planning", status: "Completed", stage: "Contract Awaderd", finalApproval: "07-03-2025", amount: "₦32,000,000", tenderStatus: "BPP Approval" },
    { id: "REQ-2025-021", title: "Rural Electrification Project", department: "Energy", status: "In Progress", stage: "Ready for PO Issuance", finalApproval: "07-03-2025", amount: "₦88,000,000", tenderStatus: "Approved" },
  ];


  const sampleProcurementRequests = [
    { id: "REQ-2023-001", title: "Office Furniture Procurement", department: "Admin", procurementMethod: "Open Tender Method", status: "In Progress", stage: "Under Evaluation", priority: "Medium", amount: "₦2,500,000", tenderStatus: "Validated" },
    { id: "REQ-2023-002", title: "IT Equipment Upgrade", department: "ICT", procurementMethod: "Open Tender Method", status: "Pending Approval", stage: "Pending Executive Chairman Review", priority: "High", amount: "₦15,000,000", tenderStatus: "Project Created" },
    { id: "REQ-2023-003", title: "Vehicle Maintenance Services", department: "Transport", procurementMethod: "Open Tender Method", status: "Completed", stage: "Pending Payment Processing", priority: "Low", amount: "₦800,000", tenderStatus: "SBD Distributed" },
    { id: "REQ-2024-004", title: "Generator Replacement", department: "Facilities", procurementMethod: "Bidding Method", status: "Rejected", stage: "Open for Submission", priority: "High", amount: "₦6,750,000", tenderStatus: "Assigned" },
    { id: "REQ-2024-007", title: "Conference Room Upgrade", department: "Admin", procurementMethod: "Bidding Method", status: "In Progress", stage: "Vendor Engagement", priority: "Medium", amount: "₦5,500,000", tenderStatus: "SBD Prepared" },
    { id: "REQ-2024-008", title: "Fleet Expansion", department: "Transport", procurementMethod: "Bidding Method", status: "Completed", stage: "Implementation Ongoing", priority: "High", amount: "₦22,000,000", tenderStatus: "Tender Assigned" },
    { id: "REQ-2025-009", title: "ERP License Renewal", department: "ICT", procurementMethod: "Default Method", status: "In Progress", stage: "Pending BPP Approval", priority: "High", amount: "₦9,000,000", tenderStatus: "Awaiting Review" },
    { id: "REQ-2025-011", title: "Security System Installation", department: "Security", procurementMethod: "Default Method", status: "In Progress", stage: "Recommendation Submitted", priority: "High", amount: "₦11,000,000", tenderStatus: "Evaluation Completed" },
    { id: "REQ-2025-012", title: "Public Awareness Campaign", department: "PR", procurementMethod: "Default Method", status: "Pending Approval", stage: "Pending FEC Review", priority: "Medium", amount: "₦7,800,000", tenderStatus: "Memo Prepared" },
    { id: "REQ-2025-013", title: "IT Security Audit", department: "ICT", procurementMethod: "Direct Procurement method", status: "Pending Approval", stage: "Awaiting Approvals", priority: "High", amount: "₦13,500,000", tenderStatus: "Executive Chairman Approval" },
    { id: "REQ-2025-014", title: "Renovation of Office Block A", department: "Facilities", procurementMethod: "Direct Procurement method", status: "Pending Approval", stage: "Contract Signed", priority: "High", amount: "₦25,000,000", tenderStatus: "Tenders Board Approval" },
    { id: "REQ-2025-015", title: "Nationwide Survey Project", department: "Research", procurementMethod: "Shopping Method", status: "Pending Approval", stage: "Contract Awarded", priority: "High", amount: "₦120,000,000", tenderStatus: "FEC Approval" },
    { id: "REQ-2025-020", title: "Public Sector Policy Consultancy", department: "Planning", procurementMethod: "Shopping Method", status: "Pending Approval", stage: "Advertised", priority: "Medium", amount: "₦32,000,000", tenderStatus: "BPP Approval" },
    { id: "REQ-2025-021", title: "Rural Electrification Project", department: "Energy", procurementMethod: "Open Tender Method", status: "In Progress", stage: "Evaluation Completed", priority: "High", amount: "₦88,000,000", tenderStatus: "Approved" },
  ];

  const sampleProcurementPlans = [
    { id: "REQ-2023-001", title: "Office Furniture Procurement", ProcurementYear: "2015", procurementMethod: "Open Tender Method", status: "In Progress", stage: "Tender Evaluation", date: "10/07/2025", amount: "₦2,500,000", tenderStatus: "Validated" },
    { id: "REQ-2023-002", title: "IT Equipment Upgrade", ProcurementYear: "2016", procurementMethod: "Open Tender Method", status: "Pending Approval", stage: "EC Review", date: "10/07/2025", amount: "₦15,000,000", tenderStatus: "Project Created" },
    { id: "REQ-2023-003", title: "Vehicle Maintenance Services", ProcurementYear: "2016", procurementMethod: "Open Tender Method", status: "Completed", stage: "Payment Processing", date: "10/07/2025", amount: "₦800,000", tenderStatus: "SBD Distributed" },
    { id: "REQ-2024-004", title: "Generator Replacement", ProcurementYear: "2017", procurementMethod: "Open Tender Method", status: "Rejected", stage: "Initial Screening", date: "10/07/2025", amount: "₦6,750,000", tenderStatus: "Assigned" },
    { id: "REQ-2024-007", title: "Conference Room Upgrade", ProcurementYear: "2018", procurementMethod: "Bidding Method", status: "In Progress", stage: "Vendor Engagement", date: "10/07/2025", amount: "₦5,500,000", tenderStatus: "SBD Prepared" },
    { id: "REQ-2024-008", title: "Fleet Expansion", ProcurementYear: "2019", procurementMethod: "Bidding Method", status: "Completed", stage: "Final Audit", date: "10/07/2025", amount: "₦22,000,000", tenderStatus: "Tender Assigned" },
    { id: "REQ-2025-009", title: "ERP License Renewal", ProcurementYear: "2020", procurementMethod: "Shopping Method", status: "In Progress", stage: "Procurement Approval", date: "10/07/2025", amount: "₦9,000,000", tenderStatus: "Awaiting Review" },
    { id: "REQ-2025-011", title: "Security System Installation", ProcurementYear: "2021", procurementMethod: "Shopping Method", status: "In Progress", stage: "Tender Evaluation", date: "10/07/2025", amount: "₦11,000,000", tenderStatus: "Evaluation Completed" },
    { id: "REQ-2025-012", title: "Public Awareness Campaign", ProcurementYear: "2021", procurementMethod: "Default Method", status: "Pending Approval", stage: "EC Review", date: "10/07/2025", amount: "₦7,800,000", tenderStatus: "Memo Prepared" },
    { id: "REQ-2025-013", title: "IT Security Audit", ProcurementYear: "2022", procurementMethod: "Direct Procurement Method", status: "Pending Approval", stage: "Approval Routing", date: "10/07/2025", amount: "₦13,500,000", tenderStatus: "Executive Chairman Approval" },
    { id: "REQ-2025-014", title: "Renovation of Office Block A", ProcurementYear: "2023", procurementMethod: "Direct Procurement Method", status: "Pending Approval", stage: "EC Review", date: "10/07/2025", amount: "₦25,000,000", tenderStatus: "Tenders Board Approval" },
    { id: "REQ-2025-015", title: "Nationwide Survey Project", ProcurementYear: "2024", procurementMethod: "Direct Procurement Method", status: "Pending Approval", stage: "Approval Routing", date: "10/07/2025", amount: "₦120,000,000", tenderStatus: "FEC Approval" },
    { id: "REQ-2025-020", title: "Public Sector Policy Consultancy", ProcurementYear: "2025", procurementMethod: "Direct Procurement Method", status: "Pending Approval", stage: "Procurement Approval", date: "10/07/2025", amount: "₦32,000,000", tenderStatus: "BPP Approval" },
    { id: "REQ-2025-021", title: "Rural Electrification Project", ProcurementYear: "2025", procurementMethod: "Direct Procurement Method", status: "In Progress", stage: "Final Routing", date: "10/07/2025", amount: "₦88,000,000", tenderStatus: "Approved" },
  ];


  const sampleApprovalRequests = [
    {
      id: "REQ-2025-001",
      title: "ERP System Upgrade",
      description: "Upgrade to the latest ERP version",
      requester: "Michael Johnson",
      department: "ICT",
      date: "2025-01-02",
      amount: "₦12,000,000",
      status: "Pending",
      category: "Software",
      priority: "High",
      neededBy: "2025-03-01",
      quantity: "1",
      stage: "Pending Annual Planning Approval",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-002",
      title: "Vehicle Purchase",
      description: "3 Toyota Prado for executive team",
      requester: "John Smith",
      department: "Transport",
      date: "2025-01-05",
      amount: "₦45,000,000",
      status: "Pending",
      category: "Vehicles",
      priority: "High",
      neededBy: "2025-03-10",
      quantity: "3",
      stage: "Pending Department Procurement Initiation Approval",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-003",
      title: "Document Digitization",
      description: "Scan and archive legacy files",
      requester: "Sarah Brown",
      department: "Records",
      date: "2025-01-08",
      amount: "₦3,800,000",
      status: "Pending",
      category: "Services",
      priority: "Medium",
      neededBy: "2025-03-20",
      quantity: "1",
      stage: "Review Memo Recommendations",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-004",
      title: "Enterprise Antivirus Subscription",
      description: "Multi-year antivirus for 200 users",
      requester: "David Lee",
      department: "ICT",
      date: "2025-01-10",
      amount: "₦2,400,000",
      status: "Pending Approval",
      category: "Software",
      priority: "Medium",
      neededBy: "2025-02-25",
      quantity: "200",
      stage: "Executive Chairman Review",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-005",
      title: "Medical Equipment Procurement",
      description: "Diagnostic tools for staff clinic",
      requester: "James White",
      department: "Health",
      date: "2025-01-11",
      amount: "₦7,500,000",
      status: "Approved",
      category: "Medical",
      priority: "High",
      neededBy: "2025-02-28",
      quantity: "15",
      stage: "Executive Chairman Review",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-006",
      title: "Conference Sponsorship",
      description: "Sponsorship for procurement conference",
      requester: "Nancy Hall",
      department: "Procurement",
      date: "2025-01-13",
      amount: "₦2,000,000",
      status: "Approved",
      category: "Events",
      priority: "Medium",
      neededBy: "2025-03-15",
      quantity: "1",
      stage: "Executive Chairman Sign-off",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-007",
      title: "Laptops for New Staff",
      description: "15 HP laptops for new recruits",
      requester: "Andrew King",
      department: "HR",
      date: "2025-01-14",
      amount: "₦4,500,000",
      status: "Approved",
      category: "Hardware",
      priority: "High",
      neededBy: "2025-03-10",
      quantity: "15",
      stage: "Executive Chairman Review",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-008",
      title: "Laptops for New Staff",
      description: "15 HP laptops for new recruits",
      requester: "Andrew King",
      department: "HR",
      date: "2025-01-14",
      amount: "₦45,500,000",
      status: "Pending",
      category: "Hardware",
      priority: "High",
      neededBy: "2025-03-10",
      quantity: "15",
      stage: "Pending Payment Processing",
      currentApprover: "Executive Chairman"
    },
    {
      id: "REQ-2025-009",
      title: "Laptops for New Staff",
      description: "15 HP laptops for new recruits",
      requester: "Andrew King",
      department: "HR",
      date: "2025-01-14",
      amount: "₦4,500,000",
      status: "Rejected",
      category: "Hardware",
      priority: "High",
      neededBy: "2025-03-10",
      quantity: "15",
      stage: "Executive Chairman Review",
      currentApprover: "Executive Chairman"
    },

    // Director of Procurement approvals
    {
      id: "REQ-2025-008",
      title: "Office Renovation",
      description: "New paint and lighting for all departments",
      requester: "Jennifer Doe",
      department: "Facilities",
      date: "2025-01-15",
      amount: "₦6,000,000",
      status: "Pending",
      category: "Facilities",
      priority: "Medium",
      neededBy: "2025-03-05",
      quantity: "1",
      stage: "Approve initiation",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-009",
      title: "Procurement Software License",
      description: "Annual license renewal for e-procurement platform",
      requester: "Samuel Peters",
      department: "ICT",
      date: "2025-01-16",
      amount: "₦3,200,000",
      status: "Pending",
      category: "Software",
      priority: "High",
      neededBy: "2025-03-01",
      quantity: "1",
      stage: "Reviews and endorses",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-010",
      title: "Stationery Supplies",
      description: "Bulk office stationery for 6 months",
      requester: "Linda Black",
      department: "Admin",
      date: "2025-01-17",
      amount: "₦8,500,000",
      status: "Pending",
      category: "Supplies",
      priority: "High",
      neededBy: "2025-02-28",
      quantity: "1",
      stage: "Validates the request",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-011",
      title: "Vehicle Servicing Contract",
      description: "Annual maintenance for company fleet",
      requester: "George Gray",
      department: "Transport",
      date: "2025-01-18",
      amount: "₦5,000,000",
      status: "Rejected",
      category: "Services",
      priority: "Medium",
      neededBy: "2025-03-30",
      quantity: "1",
      stage: "Pending Director of Procurement",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-012",
      title: "Printer Replacements",
      description: "Replace aging printers across departments",
      requester: "Diana Young",
      department: "Admin",
      date: "2025-01-19",
      amount: "₦2,300,000",
      status: "Approved",
      category: "Hardware",
      priority: "Medium",
      neededBy: "2025-03-10",
      quantity: "10",
      stage: "Director of Procurement",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-013",
      title: "Security Equipment Upgrade",
      description: "Upgrade access control systems",
      requester: "Jack Taylor",
      department: "Security",
      date: "2025-01-20",
      amount: "₦8,700,000",
      status: "Approved",
      category: "Security",
      priority: "High",
      neededBy: "2025-03-25",
      quantity: "1",
      stage: "Director of Procurement",
      currentApprover: "Director of Procurement"
    },
    {
      id: "REQ-2025-014",
      title: "Software Training",
      description: "Power BI training for staff",
      requester: "Emma Walker",
      department: "HR",
      date: "2025-01-21",
      amount: "₦1,800,000",
      status: "Approved",
      category: "Training",
      priority: "Medium",
      neededBy: "2025-04-01",
      quantity: "30",
      stage: "Director of Procurement",
      currentApprover: "Director of Procurement"
    },

    // FEC Approvals
    {
      id: "REQ-2025-015",
      title: "Fleet Expansion - SUVs",
      description: "Procurement of 5 new SUVs",
      requester: "Paul Newman",
      department: "Transport",
      date: "2025-01-22",
      amount: "₦55,000,000",
      status: "Rejected",
      category: "Vehicles",
      priority: "High",
      neededBy: "2025-04-01",
      quantity: "5",
      stage: "Federal Executive Council Review",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-016",
      title: "Server Infrastructure Upgrade",
      description: "High availability data center setup",
      requester: "Henry Adams",
      department: "ICT",
      date: "2025-01-23",
      amount: "₦70,000,000",
      status: "Pending",
      category: "Hardware",
      priority: "High",
      neededBy: "2025-04-15",
      quantity: "2",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-017",
      title: "Security Patrol Vehicles",
      description: "Procure 2 vehicles for surveillance",
      requester: "Grace Miller",
      department: "Security",
      date: "2025-01-24",
      amount: "₦108,000,000",
      status: "Pending",
      category: "Vehicles",
      priority: "High",
      neededBy: "2025-03-30",
      quantity: "2",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-018",
      title: "Disaster Recovery Plan",
      description: "Offsite backup and recovery setup",
      requester: "Martin Cruz",
      department: "ICT",
      date: "2025-01-25",
      amount: "₦90,500,000",
      status: "Pending",
      category: "IT Services",
      priority: "High",
      neededBy: "2025-03-25",
      quantity: "1",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-019",
      title: "Infrastructure Monitoring Tools",
      description: "License for enterprise monitoring software",
      requester: "Isabella Moore",
      department: "ICT",
      date: "2025-01-26",
      amount: "₦63,200,000",
      status: "Approved",
      category: "Software",
      priority: "Medium",
      neededBy: "2025-03-20",
      quantity: "1",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-020",
      title: "State-Level Procurement Oversight",
      description: "Compliance audits for state-funded projects",
      requester: "Olivia Scott",
      department: "Procurement",
      date: "2025-01-27",
      amount: "₦55,000,000",
      status: "Approved",
      category: "Services",
      priority: "Medium",
      neededBy: "2025-04-15",
      quantity: "1",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    {
      id: "REQ-2025-021",
      title: "Cybersecurity Risk Assessment",
      description: "Independent assessment across all departments",
      requester: "Liam Turner",
      department: "ICT",
      date: "2025-01-28",
      amount: "₦64,700,000",
      status: "Approved",
      category: "Security",
      priority: "High",
      neededBy: "2025-04-10",
      quantity: "1",
      stage: "Federal Executive Council Approval",
      currentApprover: "Federal Executive Council"
    },
    //BPP
    {
      id: "REQ-2025-022",
      title: "Digital Archiving Platform",
      description: "Cloud-based document archiving solution",
      requester: "Clara Benson",
      department: "Records",
      date: "2025-01-29",
      amount: "₦36,000,000",
      status: "Approved",
      category: "Software",
      priority: "Medium",
      neededBy: "2025-04-10",
      quantity: "1",
      stage: "Bureau of Public Procurement Vetting",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-023",
      title: "Multi-Year IT Service Contract",
      description: "3-year managed IT service agreement",
      requester: "Dennis Morgan",
      department: "ICT",
      date: "2025-01-30",
      amount: "₦47,000,000",
      status: "Approved",
      category: "Services",
      priority: "High",
      neededBy: "2025-04-20",
      quantity: "1",
      stage: "Bureau of Public Procurement Clearance",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-024",
      title: "Medical Supplies for Clinics",
      description: "Emergency and regular supplies for all clinics",
      requester: "Fiona Wright",
      department: "Health",
      date: "2025-01-31",
      amount: "₦30,800,000",
      status: "Approved",
      category: "Medical",
      priority: "High",
      neededBy: "2025-04-30",
      quantity: "100",
      stage: "Bureau of Public Procurement Evaluation",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-022",
      title: "Digital Archiving Platform",
      description: "Cloud-based document archiving solution",
      requester: "Clara Benson",
      department: "Records",
      date: "2025-01-29",
      amount: "₦40,000,000",
      status: "Approved",
      category: "Software",
      priority: "Medium",
      neededBy: "2025-04-10",
      quantity: "1",
      stage: "Bureau of Public Procurement Vetting",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-023",
      title: "Multi-Year IT Service Contract",
      description: "3-year managed IT service agreement",
      requester: "Dennis Morgan",
      department: "ICT",
      date: "2025-01-30",
      amount: "₦47,000,000",
      status: "Approved",
      category: "Services",
      priority: "High",
      neededBy: "2025-04-20",
      quantity: "10",
      stage: "Bureau of Public Procurement Clearance",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-024",
      title: "Medical Supplies for Clinics",
      description: "Emergency and regular supplies for all clinics",
      requester: "Fiona Wright",
      department: "Health",
      date: "2025-01-31",
      amount: "₦36,800,000",
      status: "Approved",
      category: "Medical",
      priority: "High",
      neededBy: "2025-04-30",
      quantity: "100",
      stage: "Bureau of Public Procurement Evaluation",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-025",
      title: "Vehicle Insurance Renewal",
      description: "Comprehensive insurance for official fleet",
      requester: "Gordon Adams",
      department: "Transport",
      date: "2025-02-01",
      amount: "₦33,500,000",
      status: "Pending",
      category: "Insurance",
      priority: "Medium",
      neededBy: "2025-04-15",
      quantity: "1",
      stage: "Bureau of Public Procurement Review",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-026",
      title: "Internet Bandwidth Expansion",
      description: "Upgrade to 1Gbps dedicated line",
      requester: "Rachel Thomas",
      department: "ICT",
      date: "2025-02-02",
      amount: "₦40,600,000",
      status: "Pending",
      category: "Connectivity",
      priority: "High",
      neededBy: "2025-04-18",
      quantity: "1",
      stage: "Bureau of Public Procurement Approval",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-027",
      title: "Office Air Conditioning Systems",
      description: "Replace faulty HVAC units",
      requester: "Victor Ike",
      department: "Facilities",
      date: "2025-02-03",
      amount: "₦40,200,000",
      status: "Pending",
      category: "Facilities",
      priority: "High",
      neededBy: "2025-05-01",
      quantity: "10",
      stage: "Bureau of Public Procurement Approval",
      currentApprover: "Bureau of Public Procurement"
    },
    {
      id: "REQ-2025-028",
      title: "Unified Communication Tools",
      description: "Procurement of Microsoft Teams & Zoom enterprise licenses",
      requester: "Sandra Oluchi",
      department: "ICT",
      date: "2025-02-04",
      amount: "₦70,000,000",
      status: "Rejected",
      category: "Software",
      priority: "High",
      neededBy: "2025-05-10",
      quantity: "250",
      stage: "Bureau of Public Procurement Final Clearance",
      currentApprover: "Bureau of Public Procurement"
    },
    //Hod
    {
      "id": "REQ-2025-029",
      "title": "Departmental Expansion Request",
      "description": "Request for enhancement of departmental operations",
      "requester": "Daniel Victor",
      "department": "Transport",
      "date": "2025-01-12",
      "amount": "₦6,225,531",
      "status": "Approved",
      "category": "Hardware",
      "priority": "Medium",
      "neededBy": "2025-04-09",
      "quantity": "47",
      "stage": "Needs Assessment",
      "currentApprover": "Head of Department"
    },
    {
      "id": "REQ-2025-030",
      "title": "Capacity Building Request",
      "description": "Request for upskilling staff",
      "requester": "Fatima Sule",
      "department": "HR",
      "date": "2025-02-20",
      "amount": "₦3,476,114",
      "status": "Rejected",
      "category": "Software",
      "priority": "High",
      "neededBy": "2025-03-31",
      "quantity": "28",
      "stage": "Technical Review by HOD",
      "currentApprover": "Head of Department"
    },
    {
      "id": "REQ-2025-031",
      "title": "Staff Welfare Request",
      "description": "Request for upskilling staff",
      "requester": "Fatima Sule",
      "department": "Procurement",
      "date": "2025-02-12",
      "amount": "₦6,586,428",
      "status": "Approved",
      "category": "Hardware",
      "priority": "Low",
      "neededBy": "2025-03-01",
      "quantity": "17",
      "stage": "Needs Assessment",
      "currentApprover": "Head of Department"
    },
    {
      "id": "REQ-2025-032",
      "title": "Digital Tools Request",
      "description": "Request for enhancement of departmental operations",
      "requester": "Fatima Sule",
      "department": "Transport",
      "date": "2025-02-21",
      "amount": "₦3,683,940",
      "status": "Pending",
      "category": "Services",
      "priority": "High",
      "neededBy": "2025-03-10",
      "quantity": "9",
      "stage": "Budget Consideration",
      "currentApprover": "Head of Department"
    },
    {
      "id": "REQ-2025-033",
      "title": "Digital Tools Request",
      "description": "Request for replacement of old equipment",
      "requester": "Helen Grant",
      "department": "Procurement",
      "date": "2025-01-31",
      "amount": "₦1,596,554",
      "status": "Pending",
      "category": "Services",
      "priority": "Medium",
      "neededBy": "2025-04-16",
      "quantity": "13",
      "stage": "HOD Recommendation to Director",
      "currentApprover": "Head of Department"
    },
    {
      "id": "REQ-2025-034",
      "title": "Technical Equipment Upgrade Request",
      "description": "Request for replacement of old equipment",
      "requester": "Fatima Sule",
      "department": "Legal",
      "date": "2025-01-04",
      "amount": "₦2,092,130",
      "status": "Pending",
      "category": "Facilities",
      "priority": "High",
      "neededBy": "2025-04-10",
      "quantity": "31",
      "stage": "Needs Assessment",
      "currentApprover": "Head of Department"
    }
  ];



  const samplePaymentProcessingRequests = [
    {
      id: "REQ-2023-001", title: "Office Furniture Procurement", contractor: "Elegance Interiors Ltd.", projectStatus: "Certificate Issued", description: "Ergonomic chairs and desks for new hires", requester: "Sarah Williams", department: "Admin", date: "2023-03-15", amount: "₦2,500,000", status: "In Progress", category: "Furniture", priority: "Medium", neededBy: "2023-05-20", quantity: "25", stage: "Tender Evaluation"
    },
    {
      id: "REQ-2023-002", title: "IT Equipment Upgrade", contractor: "Digital Nest Solutions", projectStatus: "Payment Initiated", description: "New laptops and monitors for development team", requester: "David Brown", department: "ICT", date: "2023-04-02", amount: "₦15,000,000", status: "pending Approval", category: "Hardware", priority: "High", neededBy: "2023-06-30", quantity: "30", stage: "EC Review"
    },
    {
      id: "REQ-2023-003", title: "Vehicle Maintenance Services", contractor: "FleetCare Services", projectStatus: "Completed", description: "Routine servicing for company fleet", requester: "Robert Johnson", department: "Transport", date: "2023-05-10", amount: "₦800,000", status: "Completed", category: "Maintenance", priority: "Low", neededBy: "2023-05-25", quantity: "12", stage: "Payment Processing"
    },
    {
      id: "REQ-2024-004", title: "Generator Replacement", contractor: "PowerHub Engineering", projectStatus: "Verified", description: "150KVA industrial generator for HQ", requester: "James Wilson", department: "Facilities", date: "2024-01-05", amount: "₦6,750,000", status: "rejected", category: "Equipment", priority: "High", neededBy: "2024-03-15", quantity: "1", stage: "Initial Screening"
    },
    {
      id: "REQ-2024-005", title: "Training for New Recruits", contractor: "GrowthEdge Academy", projectStatus: "Completed", description: "Onboarding program for Q1 hires", requester: "Emily Davis", department: "HR", date: "2024-01-12", amount: "₦1,200,000", status: "approved", category: "Training", priority: "Medium", neededBy: "2024-02-28", quantity: "15", stage: "Budget Allocation"
    },
    {
      id: "REQ-2024-006", title: "Cloud Storage Subscription", contractor: "CloudByte Ltd.", projectStatus: "Verified", description: "Enterprise cloud storage for 3 years", requester: "Daniel Miller", department: "ICT", date: "2024-01-18", amount: "₦3,000,000", status: "pending Approval", category: "Software", priority: "High", neededBy: "2024-02-15", quantity: "1", stage: "HOD Review"
    },
    {
      id: "REQ-2024-007", title: "Conference Room Upgrade", contractor: "AVSpace Technologies", projectStatus: "Payment Initiated", description: "AV equipment and furniture for main conference room", requester: "Jessica Taylor", department: "Admin", date: "2024-01-22", amount: "₦5,500,000", status: "In Progress", category: "Facilities", priority: "Medium", neededBy: "2024-03-10", quantity: "1", stage: "Vendor Engagement"
    },
    {
      id: "REQ-2024-008", title: "Fleet Expansion", contractor: "AutoEdge Motors", projectStatus: "Certificate Issued", description: "2 new Toyota Hilux for field operations", requester: "Michael Anderson", department: "Transport", date: "2024-01-25", amount: "₦22,000,000", status: "Completed", category: "Vehicles", priority: "High", neededBy: "2024-03-01", quantity: "2", stage: "Final Audit"
    },
    {
      id: "REQ-2025-009", title: "ERP License Renewal", contractor: "Enterprise Systems NG", projectStatus: "Verified", description: "3-year renewal for enterprise ERP system", requester: "Jennifer Thomas", department: "ICT", date: "2025-01-05", amount: "₦9,000,000", status: "In Progress", category: "Software", priority: "High", neededBy: "2025-02-28", quantity: "1", stage: "Procurement Approval"
    },
    {
      id: "REQ-2025-010", title: "Medical Supplies Procurement", contractor: "HealthMart Logistics", projectStatus: "Completed", description: "First aid kits and emergency medical supplies", requester: "Christopher Martinez", department: "Health", date: "2025-01-08", amount: "₦4,300,000", status: "pending Approval", category: "Medical", priority: "High", neededBy: "2025-02-15", quantity: "50", stage: "Internal Review"
    },
    {
      id: "REQ-2025-011", title: "Workstation Chairs Purchase", contractor: "OfficeFlex Ltd.", projectStatus: "Certificate Issued", description: "Ergonomic chairs for all staff", requester: "Amanda Garcia", department: "Admin", date: "2025-01-12", amount: "₦1,100,000", status: "Completed", category: "Furniture", priority: "Low", neededBy: "2025-02-01", quantity: "100", stage: "Reconciliation"
    },
    {
      id: "REQ-2025-012", title: "Annual Staff Retreat", contractor: "InspireEvents Ltd.", projectStatus: "Payment Initiated", description: "3-day retreat for all employees", requester: "Matthew Robinson", department: "HR", date: "2025-01-15", amount: "₦7,800,000", status: "approved", category: "Events", priority: "Medium", neededBy: "2025-03-20", quantity: "150", stage: "Vendor Selection"
    },
    {
      id: "REQ-2025-013", title: "Network Infrastructure Upgrade", contractor: "NetCore Solutions", projectStatus: "Verified", description: "New switches and routers for all offices", requester: "Elizabeth Clark", department: "ICT", date: "2025-01-18", amount: "₦11,200,000", status: "In Progress", category: "Hardware", priority: "High", neededBy: "2025-04-30", quantity: "15", stage: "Implementation"
    },
    {
      id: "REQ-2025-014", title: "Document Archiving System", contractor: "Archiva Technologies", projectStatus: "Completed", description: "Digital archiving solution for records department", requester: "Andrew Rodriguez", department: "Records", date: "2025-01-20", amount: "₦3,400,000", status: "rejected", category: "Software", priority: "Medium", neededBy: "2025-03-01", quantity: "1", stage: "HOD Review"
    },
    {
      id: "REQ-2025-015", title: "CCTV Installation", contractor: "SecureWatch Ltd.", projectStatus: "Certificate Issued", description: "Security cameras for all office entrances", requester: "Nicole Lewis", department: "Security", date: "2025-01-22", amount: "₦6,000,000", status: "approved", category: "Security", priority: "High", neededBy: "2025-03-15", quantity: "20", stage: "Tender Evaluation"
    },
    {
      id: "REQ-2024-001", title: "Office Laptops for Development Team", contractor: "TechCore Solutions", projectStatus: "Payment Initiated", description: "10 high-performance laptops for the development team", requester: "John Doe", department: "IT Department", date: "2024-01-15", amount: "₦25,000", status: "pending", category: "Hardware", priority: "high", neededBy: "2024-02-15", quantity: "10", stage: "Initial Review"
    },
    {
      id: "REQ-2024-002", title: "Office Supplies - Q1", contractor: "OfficeMart Nigeria", projectStatus: "Completed", description: "Quarterly office supplies including paper, pens, folders", requester: "Jane Smith", department: "Administration", date: "2024-01-10", amount: "₦1,500", status: "approved", category: "Supplies", priority: "medium", neededBy: "2024-02-01", quantity: "1", stage: "Completed"
    },
    {
      id: "REQ-2024-003", title: "Generator Replacement", contractor: "VoltEdge Energy", projectStatus: "Verified", description: "New 50KVA generator for head office", requester: "Michael Johnson", department: "Facilities", date: "2024-01-18", amount: "₦6,750", status: "pending", category: "Equipment", priority: "high", neededBy: "2024-03-01", quantity: "1", stage: "Evaluation"
    }
  ];

  const sidenavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: ['Administrator', 'User Department', 'Director of Procurement', 'Executive Chairman', 'Head of Department'] },
    { id: 'annual', name: 'Annual Planning', icon: Milestone, roles: ['Executive Chairman', 'Director of Procurement', 'Administrator'] },
    { id: 'dept', name: 'Departmental Needs', icon: Building, roles: ['User Department', 'Administrator', 'Head of Department'] },
    { id: 'new-requisition', name: 'New Requisition Request', icon: Plus, roles: ['User Department', 'Administrator', 'Head of Department'] },
    { id: 'requisitions', name: 'All Requisition Requests', icon: FileText, roles: ['Procurement Officer', 'Director of Procurement', 'Administrator', 'Head of Department'] },
    { id: 'approvals', name: 'Approvals', icon: CheckCircle, roles: ['Director of Procurement', 'Executive Chairman', 'Administrator', 'FEC Member', 'BPP Member', 'Head of Department'] },
    { id: 'tenders', name: 'Procurements', icon: ShoppingCart, roles: ['Procurement Officer', 'Administrator', 'Director of Procurement'] },
    { id: 'vendor', name: 'Vendor Management', icon: Users, roles: ['Procurement Officer', 'Administrator', 'Director of Procurement'] },
    { id: 'contracts', name: 'Contract Management', icon: ClipboardList, roles: ['Director of Procurement', 'Administrator'] },
    { id: 'project', name: 'Project Management', icon: Projector, roles: ['Administrator', 'User Department', 'Head of Department'] },
    { id: 'payments', name: 'Payment Processing', icon: DollarSign, roles: ['Executive Chairman', 'Administrator'] },
    { id: 'reports', name: 'Reports & Analytics', icon: BarChart3, roles: ['Administrator', 'Director of Procurement', 'Executive Chairman'] },
    { id: 'archived', name: 'Archive', icon: Archive, roles: ['Administrator', 'Head of Department'] },
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
    ],
    archived: [
      { id: 'memo', name: 'Memo' },
      { id: 'sbd', name: 'SBDs' },
      { id: 'tender', name: 'Tenders' }
    ],
    // project: [
    //   { id: 'memo', name: 'Memo' },
    //   { id: 'sbd', name: 'SBDs' },
    //   { id: 'tender', name: 'Tenders' }
    // ]
  };

  const sampleArchivedDocuments = [
    { documentId: "DOC-2023-001", title: "2023 Office Furniture Tender Docs", department: "Admin", type: "Tender Document", status: "Archived", dateArchived: "2024-01-15", archivedBy: "John Okeke", referenceNo: "REF-ADM-001", remarks: "Final copy submitted and signed" },
    { documentId: "DOC-2023-002", title: "Vehicle Maintenance Framework", department: "Transport", type: "Contract Agreement", status: "Archived", dateArchived: "2024-02-28", archivedBy: "Martha Egwu", referenceNo: "REF-TRN-003", remarks: "Superseded by 2024 agreement" },
    { documentId: "DOC-2023-003", title: "2022 Laptops Procurement Bids", department: "ICT", type: "Bid Submission", status: "Archived", dateArchived: "2024-03-10", archivedBy: "Abdul Musa", referenceNo: "REF-ICT-021", remarks: "All bids uploaded and verified" },
    { documentId: "DOC-2023-004", title: "Cleaning Services RFP", department: "Facility Mgt", type: "Request for Proposal", status: "Archived", dateArchived: "2024-04-05", archivedBy: "Emeka Obi", referenceNo: "REF-FCL-010", remarks: "Vendor evaluation completed" },
    { documentId: "DOC-2023-005", title: "Purchase Order for Printers", department: "ICT", type: "Purchase Order", status: "Archived", dateArchived: "2024-03-29", archivedBy: "Faith O. Ibe", referenceNo: "REF-ICT-045", remarks: "Fulfilled; invoice processed" },
    { documentId: "DOC-2023-006", title: "Approved Budget - Procurement 2023", department: "Finance", type: "Budget Document", status: "Archived", dateArchived: "2024-01-02", archivedBy: "Grace Nnamani", referenceNo: "REF-FIN-099", remarks: "Approved by management" },
    { documentId: "DOC-2023-007", title: "Procurement Plan 2023", department: "Procurement", type: "Annual Plan", status: "Archived", dateArchived: "2024-01-10", archivedBy: "Sani Usman", referenceNo: "REF-PROC-010", remarks: "Replaced by 2024 plan" },
    { documentId: "DOC-2023-008", title: "Vendor Contract - XYZ Ltd", department: "Legal", type: "Vendor Contract", status: "Archived", dateArchived: "2024-02-19", archivedBy: "Amina Yusuf", referenceNo: "REF-LGL-056", remarks: "Archived after termination clause" },
    { documentId: "DOC-2023-009", title: "Evaluation Report - Vehicle Bids", department: "Transport", type: "Evaluation Report", status: "Archived", dateArchived: "2024-04-12", archivedBy: "Kingsley Idoko", referenceNo: "REF-TRN-021", remarks: "Included in audit file" },
    { documentId: "DOC-2023-010", title: "Goods Receipt Note - IT Equipment", department: "ICT", type: "Goods Receipt Note", status: "Archived", dateArchived: "2024-05-01", archivedBy: "Rachel Adeyemi", referenceNo: "REF-ICT-078", remarks: "Verified and signed by storekeeper" }
  ];

  const sampleProjects: Project[] = [
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
      ];

  const generateVendors = (): Vendor[] => {
    const companies: [string, string, string, string, string, string, string, number, string, string][] = [
      ["Zenith Tech Solutions Ltd","IT Services","Lagos","Emeka Obi","emeka@zenithtech.ng","+234 801 234 5678","₦450M",94,"2024-11-10","Approved"],
      ["Dangote Supplies Co.","General Supplies","Kano","Amina Bello","amina@dangotesupplies.ng","+234 802 345 6789","₦1.2B",78,"2025-01-22","Pending"],
      ["Abuja Consulting Group","Consulting","FCT","Chidi Nwosu","chidi@abujacg.ng","+234 803 456 7890","₦220M",85,"2025-02-05","Under Review"],
      ["NigerCon Engineering","Engineering","Rivers","Fatima Yusuf","fatima@nigercon.ng","+234 804 567 8901","₦780M",91,"2024-09-18","Approved"],
      ["SafeGuard Security Ltd","Security Services","Ogun","Tunde Adeyemi","tunde@safeguard.ng","+234 805 678 9012","₦95M",52,"2025-03-01","Rejected"],
      ["EcoClean Facilities","Facility Management","Enugu","Ngozi Eze","ngozi@ecoclean.ng","+234 806 789 0123","₦310M",88,"2024-12-14","Approved"],
      ["Bluewave Maritime Ltd","Transportation","Rivers","Seun Lawal","seun@bluewave.ng","+234 807 890 1234","₦650M",82,"2025-01-08","Approved"],
      ["PharmaFirst HealthCo","Healthcare","Lagos","Aisha Muhammed","aisha@pharmafirst.ng","+234 808 901 2345","₦390M",76,"2025-02-18","Under Review"],
      ["CapitalEdge Finance","Financial Services","FCT","Olumide Adewale","olumide@capitaledge.ng","+234 809 012 3456","₦2.1B",90,"2024-10-05","Approved"],
      ["SkyBuild Construction","Construction","Lagos","Blessing Okonkwo","blessing@skybuild.ng","+234 810 123 4567","₦5.3B",87,"2024-08-22","Approved"],
      ["PrintMaster Nigeria","Printing & Publishing","Ibadan","Kayode Femi","kayode@printmaster.ng","+234 811 234 5678","₦85M",65,"2025-03-10","Pending"],
      ["LexPro Legal Partners","Legal Services","Lagos","Chioma Aneke","chioma@lexpro.ng","+234 812 345 6789","₦420M",93,"2024-07-14","Approved"],
      ["AgroStar Supplies","General Supplies","Kaduna","Ibrahim Bello","ibrahim@agrostar.ng","+234 813 456 7890","₦230M",71,"2025-01-30","Under Review"],
      ["SwiftLog Transport","Transportation","Abuja","Emeka Eze","emeka@swiftlog.ng","+234 814 567 8901","₦875M",84,"2024-11-25","Approved"],
      ["DataSphere IT","IT Services","Lagos","Yemi Okonkwo","yemi@datasphere.ng","+234 815 678 9012","₦560M",89,"2024-09-01","Approved"],
      ["MediTrust Pharma","Healthcare","Abuja","Hafsat Umar","hafsat@meditrust.ng","+234 816 789 0123","₦310M",77,"2025-02-28","Pending"],
      ["Goldcrest Builders","Construction","Kano","Musa Yakubu","musa@goldcrest.ng","+234 817 890 1234","₦3.8B",80,"2024-12-01","Approved"],
      ["CleanSweep Services","Facility Management","Port Harcourt","Grace Amadi","grace@cleansweep.ng","+234 818 901 2345","₦145M",68,"2025-03-05","Pending"],
      ["TechVault Systems","IT Services","Lagos","Sola Adegoke","sola@techvault.ng","+234 819 012 3456","₦720M",92,"2024-10-20","Approved"],
      ["PatriotSec Guards","Security Services","FCT","Bello Garba","bello@patriotsec.ng","+234 820 123 4567","₦180M",73,"2025-01-15","Under Review"],
      ["HorizonEdge Consulting","Consulting","Lagos","Adaeze Obi","adaeze@horizonedge.ng","+234 821 234 5678","₦660M",86,"2024-08-30","Approved"],
      ["AnchorBank Solutions","Financial Services","Abuja","Rasheed Olawale","rasheed@anchorbank.ng","+234 822 345 6789","₦4.5B",95,"2024-06-10","Approved"],
      ["StarPrint Media","Printing & Publishing","Lagos","Funmi Alade","funmi@starprint.ng","+234 823 456 7890","₦120M",59,"2025-02-14","Rejected"],
      ["AllRoads Haulage","Transportation","Ibadan","Toyin Adesanya","toyin@allroads.ng","+234 824 567 8901","₦490M",81,"2024-11-05","Approved"],
      ["RoyalCare Medical","Healthcare","Enugu","Uju Igwe","uju@royalcare.ng","+234 825 678 9012","₦275M",74,"2025-03-12","Pending"],
      ["NetBase Technologies","IT Services","Lagos","Dayo Bankole","dayo@netbase.ng","+234 826 789 0123","₦830M",88,"2024-09-15","Approved"],
      ["EliteGuard Security","Security Services","Lagos","Nnamdi Okeke","nnamdi@eliteguard.ng","+234 827 890 1234","₦210M",70,"2025-01-20","Under Review"],
      ["ProLegal Associates","Legal Services","FCT","Obiageli Nwachukwu","obiageli@prolegal.ng","+234 828 901 2345","₦380M",91,"2024-07-28","Approved"],
      ["SustainFarm Agro","General Supplies","Plateau","Ezekiel Pam","ezekiel@sustainfarm.ng","+234 829 012 3456","₦170M",67,"2025-02-10","Pending"],
      ["ApexBuild Engineering","Engineering","Lagos","Uchenna Ofor","uchenna@apexbuild.ng","+234 830 123 4567","₦6.2B",93,"2024-05-18","Approved"],
      ["ClearPath Consulting","Consulting","Abuja","Shade Olawuyi","shade@clearpath.ng","+234 831 234 5678","₦295M",82,"2024-10-08","Approved"],
      ["FidelBank Advisory","Financial Services","Lagos","Kemi Adeola","kemi@fidelbank.ng","+234 832 345 6789","₦3.1B",89,"2024-08-15","Approved"],
      ["SwiftMed Healthcare","Healthcare","Kano","Aminu Sani","aminu@swiftmed.ng","+234 833 456 7890","₦440M",75,"2025-02-22","Under Review"],
      ["NorthStar Haulage","Transportation","Sokoto","Yahaya Usman","yahaya@northstar.ng","+234 834 567 8901","₦320M",63,"2025-03-18","Pending"],
      ["PrintZone Nigeria","Printing & Publishing","Lagos","Titi Akintunde","titi@printzone.ng","+234 835 678 9012","₦98M",55,"2025-01-28","Rejected"],
      ["CleanTech Facilities","Facility Management","FCT","Suleiman Musa","suleiman@cleantech.ng","+234 836 789 0123","₦195M",79,"2024-12-10","Approved"],
      ["InnovateLaw Partners","Legal Services","Lagos","Bunmi Akinsanmi","bunmi@innovatelaw.ng","+234 837 890 1234","₦510M",87,"2024-09-25","Approved"],
      ["EagleEye Security","Security Services","Rivers","Goodluck Amaechi","goodluck@eagleeye.ng","+234 838 901 2345","₦265M",72,"2025-02-08","Under Review"],
      ["RapidIT Services","IT Services","Lagos","Tosin Afolabi","tosin@rapidit.ng","+234 839 012 3456","₦410M",84,"2024-11-18","Approved"],
      ["SolidRock Construction","Construction","FCT","Chukwudi Okafor","chukwudi@solidrock.ng","+234 840 123 4567","₦7.4B",90,"2024-06-25","Approved"],
      ["MetroSupply Co.","General Supplies","Lagos","Bisi Oludare","bisi@metrosupply.ng","+234 841 234 5678","₦285M",76,"2025-01-05","Pending"],
      ["TrustCare Pharmacy","Healthcare","Benin","Ngozi Okonkwo","ngozi@trustcare.ng","+234 842 345 6789","₦190M",69,"2025-03-08","Pending"],
      ["CityLink Transport","Transportation","Lagos","Samson Balogun","samson@citylink.ng","+234 843 456 7890","₦540M",83,"2024-10-30","Approved"],
      ["BrightMind Consulting","Consulting","Lagos","Adaora Chukwu","adaora@brightmind.ng","+234 844 567 8901","₦345M",85,"2024-12-05","Approved"],
      ["MaxForce Engineering","Engineering","Kano","Abubakar Tahir","abubakar@maxforce.ng","+234 845 678 9012","₦4.1B",88,"2024-08-08","Approved"],
      ["CapitalPrint Press","Printing & Publishing","FCT","Ngozi Nnadi","ngozi@capitalprint.ng","+234 846 789 0123","₦74M",61,"2025-02-25","Rejected"],
      ["TrustShield Guards","Security Services","Lagos","Seyi Adebanjo","seyi@trustshield.ng","+234 847 890 1234","₦155M",74,"2025-01-12","Under Review"],
      ["GreenBuild Developers","Construction","Enugu","Emeka Onuoha","emeka@greenbuild.ng","+234 848 901 2345","₦2.9B",86,"2024-09-05","Approved"],
      ["AlphaFinance Ltd","Financial Services","Lagos","Lola Fashola","lola@alphafinance.ng","+234 849 012 3456","₦1.7B",91,"2024-07-20","Approved"],
      ["OmegaLex Associates","Legal Services","FCT","Ikenna Ezenwachi","ikenna@omegalex.ng","+234 850 123 4567","₦465M",89,"2024-10-15","Approved"],
    ];
  
    return companies.map((c, i) => ({
      id: `VND-${String(i + 1).padStart(3, "0")}`,
      name: c[0], 
      category: c[1], 
      state: c[2], 
      contact: c[3], 
      email: c[4],
      phone: c[5], 
      turnover: c[6], 
      score: c[7], 
      date: c[8], 
      status: c[9] as Vendor["status"],
      tin: `${String(10000000 + i * 111111).slice(0,8)}-000${i + 1}`,
      rcNumber: `RC${String(100000 + i * 9876).slice(0,6)}`,
    }));
  };

  const sampleVendors = generateVendors();

  const sampleDepartmentalNeeds: IDetailsListItem[] = [
      {
          id: 1,
          requestId: "REQ-2025-001",
          title: "Office Furniture Procurement",
          department: "Admin",
          currentStage: "Tender Evaluation",
          priority: "Medium",
          amount: "₦2,500,000"
      },
      {
          id: 2,
          requestId: "REQ-2025-002",
          title: "IT Equipment Upgrade",
          department: "ICT",
          currentStage: "EC Review",
          priority: "High",
          amount: "₦15,000,000"
      },
      {
          id: 3,
          requestId: "REQ-2025-003",
          title: "Vehicle Maintenance Services",
          department: "Transport",
          currentStage: "Payment Processing",
          priority: "Low",
          amount: "₦800,000"
      },
      {
          id: 4,
          requestId: "REQ-2025-004",
          title: "Office Printing Supplies",
          department: "Admin",
          currentStage: "EC Review",
          priority: "Medium",
          amount: "₦800,000"
      }
  ];

  const location = useLocation();

  const currentLoginUser = location.state?.userLogin;

  const selectedRole = currentLoginUser.role;

  // Set first accessible tab when role changes
  useEffect(() => {
    if (selectedRole) {
      const accessibleTab = sidenavItems.find(item => item.roles.includes(selectedRole));
      if (accessibleTab) {
        setActiveTab(accessibleTab.id);
      }

    }
  }, [selectedRole]);


  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
      case 'new-requisition':
        return <Requisition sampleRequests={sampleRequests} />;
      case 'approvals':
        return <Approvals sampleRequests={sampleApprovalRequests} />;
      case 'annual':
        return <AnnualPlan activeTab={activeTab} sampleRequests={sampleProcurementPlans} />;
      case 'tenders':
        return <TenderManagement sampleRequests={sampleProcurementRequests} />;
      case 'requisitions':
        return <AllRequisitions sampleRequests={sampleRequests} />;
      case 'dept':
        return <DepartmentalNeeds sampleDepartmentalNeeds={sampleDepartmentalNeeds} />;
      case 'contracts':
        return <ContractManagement sampleRequests={sampleContractRequests} />;
      case 'vendor':
        return <VendorManagement sampleVendors={sampleVendors} />;
      case 'payments':
        return <PaymentProcessing sampleRequests={samplePaymentProcessingRequests} />;
      case 'archived':
        return <Archived sampleArchivedRequests={sampleArchivedDocuments} />;
      case 'project':
        return <ProjectManagement sampleProjects={sampleProjects}/>;
      case 'reports':
        return <Reports sampleRequests={sampleRequests} />;
      default:
        return <Dashboard stages={stages} setSelectedStage={setSelectedStage} sampleRequests={sampleRequests} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex h-screen">
      {/* Side Navigation */}
      <SideNav
        sidenavOpen={sidenavOpen}
        setSidenavOpen={setSidenavOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidenavItems={sidenavItems}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
        <main className="flex-1 overflow-y-auto p-6">
          {renderMainContent()}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Stage Detail Modal */}
      <StageDetailModal selectedStage={selectedStage} setSelectedStage={setSelectedStage} />

      {/* AI Chatbot — floats on every page */}
      <FIRSAIFeatures data={{
          requisitions: sampleRequests,
          procurements: sampleProcurementRequests,
          projects:     sampleProjects,
          vendors:      sampleVendors,
          payments:     samplePaymentProcessingRequests,
          annualPlans:  sampleProcurementPlans,
          approvals:    sampleApprovalRequests,
          contracts:    sampleContractRequests,
        }} />

    </div>
  );
};

export default FIRSProcurementSystem;