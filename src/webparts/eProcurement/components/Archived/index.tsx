import { Download, Filter } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import MsgBox from '../../Modals/msgBox';


interface IArchived {
  stages?: any;
  setSelectedStage?: any;
  sampleArchivedRequests: any
}
const Archived: React.FC<IArchived> = ({ sampleArchivedRequests }) => {
  const [showCompletionBox, setShowCompletionBox] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [message, setMessage] = useState<string>(``);

  const openCompletionBox = (item: any) => {
    setMessage(`Pdf document downloaded successfully`)
    setShowCompletionBox(true)
    setReferenceNumber(item)
  }
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="space-y-6">


        {/* Recent Requests Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Archived Data</h3>
            <div className="flex gap-2">
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
                  <th className="text-left py-3 px-4">Document ID</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Reference Number</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Document Type</th>
                  <th className="text-left py-3 px-4">Archived Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleArchivedRequests.map((request: any) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{request.documentId}</td>
                    <td className="py-3 px-4">{request.title}</td>
                    <td className="py-3 px-4">{request.referenceNo}</td>
                    <td className="py-3 px-4">
                    
                        {request.department}
                     
                    </td>
                    <td className="py-3 px-4">
                      
                        {request.type}
                    
                    </td>
                    <td className="py-3 px-4 font-semibold">{request.dateArchived}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 px-2 py-2 border border-gray-300 hover:bg-blue-100 rounded" onClick={() => openCompletionBox(request.id)}>
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

      <MsgBox
        isOpen={showCompletionBox}
        onDismiss={() => setShowCompletionBox(false)}
        referenceNumber={referenceNumber}
        message={message} action={'Pdf Downloaded'} />
    </main>
  )
}
export default Archived