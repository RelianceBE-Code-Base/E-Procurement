import {   Eye, Filter, Plus } from 'lucide-react';
//CheckCircle, ChevronRight, Clock, DollarSign, FileText,
import * as React from 'react';
import { useState } from 'react';
import NewAnnualPlan from './newAnnualPlan';
import MsgBox from '../../Modals/msgBox';

interface IAnnualPlan{
    activeTab: any;
    sampleRequests: any
}
const AnnualPlan:React.FC<IAnnualPlan> = ({activeTab, sampleRequests}) =>{

    const [showNewAnnualPlan, setShowNewAnnualPlan] = useState(false)
    const [showCompletionBox, setShowCompletionBox] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [message, setMessage] = useState<string>(``);

    const openNewAnnualPlan = () => {
        setShowNewAnnualPlan(true)
    }

    const openCompletionBox =(item:any)=>{
        setMessage(`This annual procurement plan has been marked completed.
        
        User department can now initate requisition for this procurement plan`)
        setShowCompletionBox(true)
        setReferenceNumber(item)
    }

    return(

        <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Stats Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Requests</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-yellow-600">12</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">156</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-purple-600">₦2.4B</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div> */}

              {/* Process Workflow */}
              {/* <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Procurement Process Workflow</h3>
                <div className="overflow-x-auto">
                  <div className="flex gap-2 min-w-max pb-4">
                    <div className="px-3 py-2 rounded-lg text-white text-sm bg-green-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
                      Stage 0: Annual Procurement Preparation
                    </div>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
                    <div className="px-3 py-2 rounded-lg text-white text-sm bg-blue-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
                      Stage 1: Requisition Initiation
                    </div>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
                    <div className="px-3 py-2 rounded-lg text-white text-sm bg-yellow-500 cursor-pointer hover:opacity-80 whitespace-nowrap">
                      Stage 2: EC Approval & Routing
                    </div>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0 self-center" />
                    <div className="px-3 py-2 rounded-lg text-white text-sm bg-gray-400 cursor-pointer hover:opacity-80 whitespace-nowrap">
                      Stage 3: Procurement Plan Validation
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Recent Requests Table */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Annaul Plan Requests</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={openNewAnnualPlan}>
                      <Plus className="w-4 h-4" />
                      New Request
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
                      {sampleRequests.map((request:any) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
                          <td className="py-3 px-4">{request.title}</td>
                          <td className="py-3 px-4">{request.department}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              request.priority === 'High' ? 'bg-red-100 text-red-800' :
                              request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{request.amount}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 px-2 py-2 border border-gray-300 hover:bg-blue-100 rounded" onClick={ () => openCompletionBox(request.id)}>
                                {/* <Download className="w-4 h-4" /> */}
                                Finalize Plan
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

          {showNewAnnualPlan && <NewAnnualPlan isOpen={showNewAnnualPlan} onDismiss={() => setShowNewAnnualPlan(false)}/>}
          <MsgBox
            isOpen={showCompletionBox}
            onDismiss={ () => setShowCompletionBox(false)}
            referenceNumber={referenceNumber}
            message={message}
        />
        </main>
    )
}
export default AnnualPlan