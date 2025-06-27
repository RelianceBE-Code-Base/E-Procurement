import {
    Eye,
    Filter,
    MoreVertical,
    CheckCircle,
    ScrollText,
    Wallet
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import MsgBox from '../../Modals/msgBox';

interface IPaymentProcessing {
    stages?: any;
    setSelectedStage?: any;
    sampleRequests: any
}
const PaymentProcessing: React.FC<IPaymentProcessing> = ({ sampleRequests }) => {
    const [showCompletionBox, setShowCompletionBox] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [message, setMessage] = useState<string>(``);
    const [action, setAction] = useState<string>(``);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const openCompletionBox = (item: any) => {
        let message;
        let action;
        console.log(item.projectStatus)
        switch (item.projectStatus) {
            case "Completed":
                message = `The project deliverables have been successfully verified
                
                `;
                action = "Deliverables Verification Successful";
                break;
            case "Verified":
                message = `The Job Completion Certificate has been successfully issued to the contractor
                
                `;
                action = "Certificate Isuance Successful";
                break;
            case "Certificate Issued":
                message = `The payment process has been successfully initiated
                
                `;
                action = "Payment Initiation Successful";
                break;
            default:
                message = `The payment process has been successfully completed
                
                `;
                action = "Payment Successful";
        };
        setAction(action);
        setMessage(message)
        setShowCompletionBox(true)
        setReferenceNumber(item.id)
    }

    return (
        <main className="flex-1 p-6 overflow-auto border border-red-300">
            <div className="space-y-6 border border-red-300">

                {/* Recent Requests Table */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Project Completion and Payment Processing</h3>
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
                                    <th className="text-left py-3 px-4">Request ID</th>
                                    <th className="text-left py-3 px-4">Title</th>
                                    <th className="text-left py-3 px-4">Contractor</th>
                                    <th className="text-left py-3 px-4">Project Stage</th>
                                    <th className="text-left py-3 px-4">Priority</th>
                                    <th className="text-left py-3 px-4">Amount</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sampleRequests.map((request: any) => (
                                    <tr key={request.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
                                        <td className="py-3 px-4">{request.title}</td>
                                        <td className="py-3 px-4">{request.contractor}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${request.projectStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                                request.projectStatus === 'Verified' ? 'bg-blue-100 text-blue-800' :
                                                    request.projectStatus === 'Certificate Issued' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {request.projectStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${request.priority === 'High' ? 'bg-red-100 text-red-800' :
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

                                                {request.projectStatus !== "Payment Initiated" && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                setOpenMenuId((prevId) => (prevId === request.id ? null : request.id))
                                                            }
                                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>

                                                        {openMenuId === request.id && (
                                                            <div className="absolute right-0 z-10 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg">
                                                                <button
                                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                                                    onClick={() => {
                                                                        openCompletionBox(request);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                >
                                                                    {request.projectStatus === 'Completed' && (
                                                                        <>
                                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                                            Verify Deliverables
                                                                        </>
                                                                    )}
                                                                    {request.projectStatus === 'Verified' && (
                                                                        <>
                                                                            <ScrollText className="w-4 h-4 text-blue-600" />
                                                                            Issue Certificate
                                                                        </>
                                                                    )}
                                                                    {request.projectStatus === 'Certificate Issued' && (
                                                                        <>
                                                                            <Wallet className="w-4 h-4 text-purple-600" />
                                                                            Initiate Payment
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
                message={message} 
                action={action}
            />
        </main>
    )
}
export default PaymentProcessing