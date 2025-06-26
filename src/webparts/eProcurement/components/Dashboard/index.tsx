// components/Dashboard.jsx
import * as React from 'react';
import { 
  ChevronRight, FileText, Clock, CheckCircle, AlertCircle, Download, Eye, 
  LucideIcon
} from 'lucide-react';
import styles from '../EProcurement.module.scss';

interface IDashboard{
    stages: any;
    setSelectedStage?: any;
    sampleRequests?: any
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon; 
    color: string;
    iconColor: string;
  }

  const dashboardStages = [
    { id: 0, name: "Annual Procurement Preparation", status: "completed", color: "bg-green-500" },
    { id: 1, name: "Requisition Initiation", status: "active", color: "bg-blue-500" },
    { id: 2, name: "Tendering Process Initiation", status: "pending", color: "bg-yellow-500" },
    { id: 3, name: "Contract Award", status: "pending", color: "bg-gray-400" },
    { id: 4, name: "Project Completion & Payment", status: "pending", color: "bg-gray-400" }
  ];

const Dashboard:React.FC<IDashboard> = ({ stages, sampleRequests, setSelectedStage }) => {

return(
  <div className="space-y-6">
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${styles['no-after']} ${styles['no-before']}`}>
      {/* Stats Cards */}
      <StatCard 
        title="Active Requests" 
        value="24" 
        icon={FileText} 
        color="text-blue-600" 
        iconColor="text-blue-500"
      />
      <StatCard 
        title="Pending Approvals" 
        value="12" 
        icon={Clock} 
        color="text-yellow-600" 
        iconColor="text-yellow-500"
      />
      <StatCard 
        title="Completed" 
        value="156" 
        icon={CheckCircle} 
        color="text-green-600" 
        iconColor="text-green-500"
      />
      <StatCard 
        title="Total Value" 
        value="₦2.4B" 
        icon={AlertCircle} 
        color="text-purple-600" 
        iconColor="text-purple-500"
      />
    </div>

    {/* Process Flow */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Procurement Process Workflow</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-4">
          {dashboardStages.map((stage:any, index:any) => (
            <div key={stage.id} className="flex items-center">
              <div 
                className={`px-3 py-2 rounded-lg text-white text-sm cursor-pointer hover:opacity-80 whitespace-nowrap ${stage.color}`}
                onClick={() => setSelectedStage(stage)}
              >
                Stage {stage.id}: {stage.name}
              </div>
              {index < stages.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Requests */}
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Procurement Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Request ID</th>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Department</th>
              <th className="text-left py-3 px-4">Current Stage</th>
              <th className="text-left py-3 px-4">Priority</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleRequests.slice(0, 4).map((request:any) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
                <td className="py-3 px-4">{request.title}</td>
                <td className="py-3 px-4">{request.department}</td>
                <td className="py-3 px-4">
                  <StatusBadge 
                    status={request.status} 
                    text={request.stage} 
                  />
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={request.priority} />
                </td>
                <td className="py-3 px-4 font-semibold">{request.amount}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
};

// Helper components
const StatCard = ({ title, value, icon: Icon, color, iconColor }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${iconColor}`} />
    </div>
  </div>
);

const StatusBadge = ({ status='', text='' }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    status === 'Completed' ? 'bg-green-100 text-green-800' :
    status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
    'bg-yellow-100 text-yellow-800'
  }`}>
    {text}
  </span>
);

const PriorityBadge = ({ priority=' ' }) => (
  <span className={`px-2 py-1 rounded text-xs ${
    priority === 'High' ? 'bg-red-100 text-red-800' :
    priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
    'bg-gray-100 text-gray-800'
  }`}>
    {priority}
  </span>
);

export default Dashboard