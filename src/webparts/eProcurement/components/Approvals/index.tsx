import * as React from 'react';
import { CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';

interface IApprovalItem {
    id: string;
    title: string;
    description: string;
    requester: string;
    department: string;
    date: string;
    amount: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    category: string;
    priority: 'low' | 'medium' | 'high';
    neededBy: string;
    quantity: number;
}

interface IApprovals {
    sampleRequests: any;
}

const ProcurementDashboard: React.FC<IApprovals> = ({ sampleRequests }) => {
    const [approvalItems, setApprovalItems] = React.useState<IApprovalItem[]>(sampleRequests);
    const [activeTab, setActiveTab] = React.useState<'pending' | 'all'>('pending');
    const [selectedItem, setSelectedItem] = React.useState<IApprovalItem | null>(null);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [showApproveModal, setShowApproveModal] = React.useState(false);
    const [showRejectModal, setShowRejectModal] = React.useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const filteredItems = approvalItems.filter(item => {
        if (activeTab === 'pending') return item.status === 'pending';
        return true;
    });

    const getStatusBadge = (status: string, priority: string) => {
        if (status === 'pending') {
            return (
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        pending Executive
                    </span>
                    {priority === 'high' && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                            HIGH
                        </span>
                    )}
                    {priority === 'medium' && (
                        <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                            MEDIUM
                        </span>
                    )}
                </div>
            );
        }
        if (status === 'approved') {
            return (
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                        Assigned
                    </span>
                    {priority === 'medium' && (
                        <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                            MEDIUM
                        </span>
                    )}
                </div>
            );
        }
        return null;
    };

    const formatAmount = (amount: string) => {
        return `${amount}`;
    };

    const handleViewDetails = (item: IApprovalItem) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const handleApprove = (item: IApprovalItem) => {
        setSelectedItem(item);
        setShowApproveModal(true);
    };

    const handleReject = (item: IApprovalItem) => {
        setSelectedItem(item);
        setShowRejectModal(true);
    };

    const confirmApprove = () => {
        if (selectedItem) {
            setApprovalItems(items =>
                items.map(item =>
                    item.id === selectedItem.id ? { ...item, status: 'approved' as const } : item
                )
            );
            setShowApproveModal(false);
            setSuccessMessage(`Requisition ${selectedItem.id} has been approved successfully!`);
            setShowSuccessModal(true);
        }
    };

    const confirmReject = () => {
        if (selectedItem) {
            setApprovalItems(items =>
                items.map(item =>
                    item.id === selectedItem.id ? { ...item, status: 'rejected' as const } : item
                )
            );
            setShowRejectModal(false);
            setSuccessMessage(`Requisition ${selectedItem.id} has been rejected.`);
            setShowSuccessModal(true);
        }
    };

    const closeModals = () => {
        setShowDetailsModal(false);
        setShowApproveModal(false);
        setShowRejectModal(false);
        setShowSuccessModal(false);
        setSelectedItem(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Requisition Management</h1>
                        <p className="text-gray-600 mt-1">Manage procurement requisitions and approvals</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'pending'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        pending Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'all'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All Requisitions
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                        {getStatusBadge(item.status, item.priority)}
                                    </div>

                                    <p className="text-gray-600 mb-4">{item.description}</p>

                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">ID:</span> {item.id}
                                        </div>
                                        <div>
                                            <span className="font-medium">Department:</span> {item.department}
                                        </div>
                                        <div>
                                            <span className="font-medium">Requested by:</span> {item.requester}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Qty:</span> {item.quantity}
                                        </div>
                                        <div>
                                            <span className="font-medium">Category:</span> {item.category}
                                        </div>
                                        <div>
                                            <span className="font-medium">Created:</span> {item.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 ml-6">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatAmount(item.amount)}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Needed: {item.neededBy}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleViewDetails(item)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>

                                        {item.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(item)}
                                                    className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item)}
                                                    className="flex items-center gap-1 px-4 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {/* Details Modal */}
            {showDetailsModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Requested Details</h2>
                            <button
                                onClick={closeModals}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* ID and Status */}
                            <div className="flex justify-between">
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">ID:</p>
                                    <p className="text-gray-900 font-mono">{selectedItem.id}</p>
                                </div>
                                <div className="w-1/2 pl-2">
                                    <p className="text-gray-500 text-sm">Status:</p>
                                    <p className="text-gray-900 capitalize">{selectedItem.status}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <p className="text-gray-500 text-sm">Title:</p>
                                <h3 className="text-gray-900 font-bold text-lg mt-1">{selectedItem.title}</h3>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-gray-500 text-sm">Description:</p>
                                <p className="text-gray-900 mt-1">{selectedItem.description}</p>
                            </div>

                            {/* Requestor and Amount */}
                            <div className="flex justify-between">
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">Requester:</p>
                                    <p className="text-gray-900">{selectedItem.requester}</p>
                                </div>
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">Department:</p>
                                    <p className="text-gray-900">{selectedItem.department}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Department and Amount */}
                            <div className="flex justify-between">
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">Quantity:</p>
                                    <p className="text-gray-900">{selectedItem.quantity}</p>
                                </div>
                                <div className="w-1/2 pl-2">
                                    <p className="text-gray-500 text-sm">Amount:</p>
                                    <p className="text-gray-900 font-bold"> {selectedItem.amount}</p>
                                </div>
                            </div>

                            {/* Quantity and Category */}
                            <div className="flex justify-between">
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">Priority:</p>
                                    <p className="text-gray-900 capitalize">{selectedItem.priority}</p>
                                </div>
                                <div className="w-1/2 pl-2">
                                    <p className="text-gray-500 text-sm">Category:</p>
                                    <p className="text-gray-900">{selectedItem.category}</p>
                                </div>
                            </div>

                            {/* Priority and Created */}
                            <div className="flex justify-between">
                                <div className="w-1/2 pr-2">
                                    <p className="text-gray-500 text-sm">Needed By:</p>
                                    <p className="text-gray-900">{selectedItem.neededBy}</p>
                                </div>
                                <div className="w-1/2 pl-2">
                                    <p className="text-gray-500 text-sm">Created:</p>
                                    <p className="text-gray-900">{selectedItem.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={closeModals}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Confirmation Modal */}
            {showApproveModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            <h2 className="text-xl font-bold">Approve Requisition</h2>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to approve the requisition "{selectedItem.title}" for {formatAmount(selectedItem.amount)}?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModals}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            {showRejectModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <XCircle className="w-8 h-8 text-red-500 mr-3" />
                            <h2 className="text-xl font-bold">Reject Requisition</h2>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to reject the requisition "{selectedItem.title}"?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModals}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                            <h2 className="text-xl font-bold">Success</h2>
                        </div>

                        <p className="text-gray-700 mb-6">{successMessage}</p>

                        <div className="flex justify-end">
                            <button
                                onClick={closeModals}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcurementDashboard;