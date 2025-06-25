import * as React from 'react';
import styles from './EProcurement.module.scss';
import type { IEProcurementProps } from './IEProcurementProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import Home from '../components/Home'
import {  useNavigate } from 'react-router-dom';

const EProcurement: React.FC<IEProcurementProps> = (props) => {
  const { description, isDarkTheme, environmentMessage, hasTeamsContext, userDisplayName } = props;


    const navigate = useNavigate();

    const navigateToMain=()=>{
      navigate('/home')
    }

    return (
      <section className={`${styles.eProcurement} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className="flex-1 p-6 overflow-auto">
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
          <button onClick={navigateToMain} className="p-2 hover:bg-gray-100 rounded-lg">
          Get Started
           </button>
        </div>
       
      </section>
    );
  }

export default EProcurement;
// import * as React from 'react';
// import  {  useState } from 'react';
// import { 
//   ChevronRight, FileText, CheckCircle, Clock, Search, Plus, Filter, 
//   Download, Eye, Home, Settings, Bell, Menu, X, BarChart3, ShoppingCart, 
//   ClipboardList, DollarSign, Archive, HelpCircle, LogOut 
// } from 'lucide-react';
// import type { IEProcurementProps } from './IEProcurementProps';

// const FIRSProcurementSystem:React.FC<IEProcurementProps> = (props) => {

//   //const { description, isDarkTheme, environmentMessage, hasTeamsContext, userDisplayName } = props;

//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [sidenavOpen, setSidenavOpen] = useState(true);

//   const sidenavItems = [
//     { id: 'dashboard', name: 'Dashboard', icon: Home },
//     { id: 'requests', name: 'All Requests', icon: FileText },
//     { id: 'new-request', name: 'New Request', icon: Plus },
//     { id: 'approvals', name: 'Approvals', icon: CheckCircle },
//     { id: 'tenders', name: 'Tender Management', icon: ShoppingCart },
//     { id: 'contracts', name: 'Contract Management', icon: ClipboardList },
//     { id: 'payments', name: 'Payment Processing', icon: DollarSign },
//     { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
//     { id: 'archive', name: 'Archive', icon: Archive }
//   ];

//   const sampleRequests = [
//     { id: "REQ-2025-001", title: "Office Furniture Procurement", department: "Admin", status: "In Progress", stage: "Tender Evaluation", priority: "Medium", amount: "₦2,500,000" },
//     { id: "REQ-2025-002", title: "IT Equipment Upgrade", department: "ICT", status: "Pending Approval", stage: "EC Review", priority: "High", amount: "₦15,000,000" },
//     { id: "REQ-2025-003", title: "Vehicle Maintenance Services", department: "Transport", status: "Completed", stage: "Payment Processing", priority: "Low", amount: "₦800,000" }
//   ];

//    // Load Tailwind CSS when component mounts
//   //  useEffect(() => {
//   //   const loadTailwind = () => {
//   //     if (!document.querySelector('#tailwind-css')) {
//   //       const link = document.createElement('link');
//   //       link.id = 'tailwind-css';
//   //       link.rel = 'stylesheet';
//   //       link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
//   //       document.head.appendChild(link);
//   //     }
//   //   };
  
//   //   // Add timeout to ensure styles load
//   //   const timer = setTimeout(loadTailwind, 100);
//   //   return () => clearTimeout(timer);
//   // }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <div className={`bg-gray-900 text-white transition-all duration-300 ${sidenavOpen ? 'w-64' : 'w-16'} flex-shrink-0`}>
//         {/* Logo */}
//         <div className="p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
//               F
//             </div>
//             {sidenavOpen && (
//               <div>
//                 <h2 className="font-bold text-sm">FIRS</h2>
//                 <p className="text-xs text-gray-400">Procurement System</p>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Navigation */}
//         <nav className="mt-8">
//           {sidenavItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
//                 activeTab === item.id ? 'bg-blue-600 border-r-2 border-blue-400' : ''
//               }`}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               {sidenavOpen && <span className="text-sm">{item.name}</span>}
//             </button>
//           ))}
//         </nav>

//         {/* Bottom Menu */}
//         <div className="absolute bottom-4 left-4 right-4">
//           {sidenavOpen && (
//             <div className="space-y-2">
//               <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
//                 <Settings className="w-4 h-4" />
//                 Settings
//               </button>
//               <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
//                 <HelpCircle className="w-4 h-4" />
//                 Help
//               </button>
//               <button className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-800 transition-colors text-sm">
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b">
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={() => setSidenavOpen(!sidenavOpen)}
//                   className="p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   {sidenavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//                 </button>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900">Federal Inland Revenue Service</h1>
//                   <p className="text-sm text-gray-600">Procurement Management System</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
//                   <input 
//                     type="text" 
//                     placeholder="Search requests..." 
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//                   />
//                 </div>
//                 <button className="relative p-2 text-gray-400 hover:text-gray-600">
//                   <Bell className="w-5 h-5" />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                 </button>
//                 <div className="flex items-center gap-3">
//                   <div className="text-right">
//                     <p className="text-sm font-medium">John Doe</p>
//                     <p className="text-xs text-gray-500">Procurement Officer</p>
//                   </div>
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                     JD
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 p-6 overflow-auto">
//           {activeTab === 'dashboard' && (
//             <div className="space-y-6">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Active Requests</p>
//                       <p className="text-2xl font-bold text-blue-600">24</p>
//                     </div>
//                     <FileText className="w-8 h-8 text-blue-500" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Pending Approvals</p>
//                       <p className="text-2xl font-bold text-yellow-600">12</p>
//                     </div>
//                     <Clock className="w-8 h-8 text-yellow-500" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Completed</p>
//                       <p className="text-2xl font-bold text-green-600">156</p>
//                     </div>
//                     <CheckCircle className="w-8 h-8 text-green-500" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Value</p>
//                       <p className="text-2xl font-bold text-purple-600">₦2.4B</p>
//                     </div>
//                     <DollarSign className="w-8 h-8 text-purple-500" />
//                   </div>
//                 </div>
//               </div>

//               {/* Process Workflow */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold mb-4">Procurement Process Workflow</h3>
//                 <div className="overflow-x-auto">
//                   <div className="flex gap-2 min-w-max pb-4">
//                     <div className="px-3 py-2 rounded-lg text-white text-sm bg-green-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
//                       Stage 0: Annual Procurement Preparation
//                     </div>
//                     <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
//                     <div className="px-3 py-2 rounded-lg text-white text-sm bg-blue-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
//                       Stage 1: Requisition Initiation
//                     </div>
//                     <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
//                     <div className="px-3 py-2 rounded-lg text-white text-sm bg-yellow-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
//                       Stage 2: EC Approval & Routing
//                     </div>
//                     <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
//                     <div className="px-3 py-2 rounded-lg text-white text-sm bg-gray-400 cursor-pointer hover:opacity-80 whitespace-nowrap">
//                       Stage 3: Procurement Plan Validation
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Requests Table */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Recent Procurement Requests</h3>
//                   <div className="flex gap-2">
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
//                       <Plus className="w-4 h-4" />
//                       New Request
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
//                       <Filter className="w-4 h-4" />
//                       Filter
//                     </button>
//                   </div>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="text-left py-3 px-4">Request ID</th>
//                         <th className="text-left py-3 px-4">Title</th>
//                         <th className="text-left py-3 px-4">Department</th>
//                         <th className="text-left py-3 px-4">Current Stage</th>
//                         <th className="text-left py-3 px-4">Priority</th>
//                         <th className="text-left py-3 px-4">Amount</th>
//                         <th className="text-left py-3 px-4">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sampleRequests.map((request) => (
//                         <tr key={request.id} className="border-b hover:bg-gray-50">
//                           <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
//                           <td className="py-3 px-4">{request.title}</td>
//                           <td className="py-3 px-4">{request.department}</td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               request.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                               request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
//                               'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {request.stage}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-1 rounded text-xs ${
//                               request.priority === 'High' ? 'bg-red-100 text-red-800' :
//                               request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                               {request.priority}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 font-semibold">{request.amount}</td>
//                           <td className="py-3 px-4">
//                             <div className="flex gap-2">
//                               <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
//                                 <Eye className="w-4 h-4" />
//                               </button>
//                               <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
//                                 <Download className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'new-request' && (
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-6">New Procurement Request</h3>
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Requesting Department</label>
//                     <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                       <option>Select Department</option>
//                       <option>Administration</option>
//                       <option>ICT</option>
//                       <option>Finance</option>
//                       <option>Legal</option>
//                       <option>Transport</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Category</label>
//                     <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                       <option>Select Category</option>
//                       <option>Goods</option>
//                       <option>Works</option>
//                       <option>Services</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
//                   <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter procurement request title" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Description & Justification</label>
//                   <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide detailed description and justification for this procurement request"></textarea>
//                 </div>

//                 <div className="flex gap-4">
//                   <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                     Submit Request
//                   </button>
//                   <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                     Save as Draft
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'approvals' && (
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-6">Pending Approvals</h3>
//               <div className="space-y-4">
//                 {sampleRequests.filter(r => r.status !== 'Completed').map((request) => (
//                   <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium">{request.title}</h4>
//                         <p className="text-sm text-gray-600">{request.id} • {request.department} • {request.amount}</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//                           Approve
//                         </button>
//                         <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
//                           Reject
//                         </button>
//                         <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
//                           Review
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </main>

//         {/* Footer */}
//         <footer className="bg-white border-t px-6 py-4">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <div className="flex items-center gap-6">
//               <p>© 2025 Federal Inland Revenue Service</p>
//               <span>•</span>
//               <p>Procurement Management System v2.1</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <button className="hover:text-blue-600">Privacy Policy</button>
//               <span>•</span>
//               <button className="hover:text-blue-600">Support</button>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default FIRSProcurementSystem;