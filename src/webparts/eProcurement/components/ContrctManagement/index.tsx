import { Eye, Filter, Plus } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import MsgBox from '../../Modals/msgBox';
import NewContract from '../AnnualPlan/newAnnualPlan'

interface IContractManagement{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests: any
}
const ContractManagement:React.FC<IContractManagement> = ({sampleRequests}) =>{
    const [showNewContract, setShowNewContract] = useState(false)
    const [showCompletionBox, setShowCompletionBox] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [message, setMessage] = useState<string>(``);

    const openNewContract = () => {
        setShowNewContract(true)
    }

    const openCompletionBox =(item:any)=>{
        setMessage(`An Award Letter has been issued to the winning vendor/contractor`)
        setShowCompletionBox(true)
        setReferenceNumber(item)
    }
    return(
        <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
        

          {/* Recent Requests Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contract Requests</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={openNewContract}>
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
                            Award Letter
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

      {showNewContract && <NewContract isOpen={showNewContract} onDismiss={() => setShowNewContract(false)}/>}
      <MsgBox
          isOpen={showCompletionBox}
          onDismiss={() => setShowCompletionBox(false)}
          referenceNumber={referenceNumber}
          message={message} action={'Contract Awarded'}    />
    </main>
    )
}
export default ContractManagement