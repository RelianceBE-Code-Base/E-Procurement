import * as React from 'react';
import { Eye, Filter, EllipsisVertical, X, User, FolderOpen, FileText, Send, CheckCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useState } from 'react';

interface ITenderManagement {
  stages?: any;
  setSelectedStage?: any;
  sampleRequests?: any;
}

const procurementOfficers = [
  { id: 1, name: "John Doe", department: "Procurement", email: "john.doe@company.com" },
  { id: 2, name: "Sarah Wilson", department: "Procurement", email: "sarah.wilson@company.com" },
  { id: 3, name: "Michael Brown", department: "Procurement", email: "michael.brown@company.com" },
  { id: 4, name: "Emily Davis", department: "Procurement", email: "emily.davis@company.com" }
];

const TenderManagement: React.FC<ITenderManagement> = ({ sampleRequests: initialRequests }) => {
  const [showCompletionBox, setShowCompletionBox] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showAssignOfficerModal, setShowAssignOfficerModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [viewingRequest, setViewingRequest] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [sampleRequests, setSampleRequests] = useState(initialRequests || []);
  const [currentTab, setCurrentTab] = useState(0);

  // Form states
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [tenderName, setTenderName] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [procurementCategory, setProcurementCategory] = useState('');
  const [sbdType, setSbdType] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('');
  const [interestedBidders, setInterestedBidders] = useState<string[]>([]);
  const [newBidder, setNewBidder] = useState('');

  const tabs = [
    { id: 'assign_tender_id', title: 'Assign Tender', status: 'Project Created' },
    { id: 'prepare_sbd', title: 'Prepare SBD', status: 'Tender Assigned' },
    { id: 'distribute_sbd', title: 'Distribute SBD', status: 'SBD Prepared' },
    { id: 'seek_approval', title: 'Seek Approvals', status: 'SBD Distributed' }
  ];

  const getCurrentTabIndex = (tenderStatus: string) => {
    switch (tenderStatus) {
      case 'Project Created': return 0;
      case 'Tender Assigned': return 1;
      case 'SBD Prepared': return 2;
      case 'SBD Distributed': return 3;
      default: return 0;
    }
  };

  const handleViewRecord = (request: any) => {
    setViewingRequest(request);
    setShowRecordModal(true);
  };

  const handleActionClick = (request: any) => {
    setSelectedRequest(request);
    setShowActionModal(true);
    setCurrentTab(getCurrentTabIndex(request.tenderStatus));

    // Pre-populate fields if available or generate defaults
    setTenderName(request.tenderName || `${request.title} - Tender Process`);
    setTenderId(request.tenderId || `TND-${request.id}-${new Date().getFullYear()}`);
    if (request.procurementCategory) setProcurementCategory(request.procurementCategory);
    if (request.sbdType) setSbdType(request.sbdType);
    if (request.distributionMethod) setDistributionMethod(request.distributionMethod);
    if (request.interestedBidders) setInterestedBidders(request.interestedBidders || []);
  };


  const handleAssignOfficerClick = (request: any) => {
    setSelectedRequest(request);
    setShowAssignOfficerModal(true);
  };

  const handleCreateProjectClick = (request: any) => {
    setSelectedRequest(request);
    setTenderName(`${request.title} - Tender Process`);
    setTenderId(`TND-${request.id}-${new Date().getFullYear()}`);
    setShowCreateProjectModal(true);
  };

  const updateRequestStatus = (requestId: string, newTenderStatus: string, additionalData: any = {}) => {
    setSampleRequests((prev: any[]) =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, tenderStatus: newTenderStatus, ...additionalData }
          : req
      )
    );
  };

  const handleSaveProgress = () => {
    if (!selectedRequest) return;

    const currentTabData = tabs[currentTab];
    const additionalData = getCurrentFormData();

    updateRequestStatus(selectedRequest.id, currentTabData.status, additionalData);
    setMessage(`Progress saved at "${currentTabData.title}" stage`);
    setShowCompletionBox(true);
  };

  const getCurrentFormData = () => {
    switch (tabs[currentTab].id) {
      case 'assign_tender_id':
        return { tenderName, tenderId, tenderIdAssignedDate: new Date().toISOString() };
      case 'prepare_sbd':
        return { procurementCategory, sbdType, sbdPreparedDate: new Date().toISOString() };
      case 'distribute_sbd':
        return { distributionMethod, interestedBidders, distributionDate: new Date().toISOString() };
      case 'seek_approval':
        return { approvalRequested: true, approvalRequestDate: new Date().toISOString() };
      default:
        return {};
    }
  };

  const handleCompleteAction = () => {
    if (!selectedRequest) return;

    const currentTabData = tabs[currentTab];
    const additionalData = getCurrentFormData();

    updateRequestStatus(selectedRequest.id, currentTabData.status, additionalData);
    setMessage(`"${currentTabData.title}" stage completed successfully`);
    setShowCompletionBox(true);

    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    } else {
      closeModal();
    }
  };

  const handleAssignOfficer = () => {
    if (!selectedRequest || !selectedOfficer) return;

    const officer = procurementOfficers.find(o => o.id === selectedOfficer);
    updateRequestStatus(selectedRequest.id, 'Assigned', {
      assignedOfficer: officer?.name,
      assignedOfficerId: selectedOfficer
    });
    setMessage(`Tender has been successfully assigned to ${officer?.name}`);
    setShowCompletionBox(true);
    setShowAssignOfficerModal(false);
    resetFormFields();
  };

  const handleCreateProjectFile = () => {
    if (!selectedRequest) return;

    updateRequestStatus(selectedRequest.id, 'Project Created', {
      projectFileCreated: true,
      projectFileDate: new Date().toISOString()
    });
    setMessage(`Physical project file has been successfully created for tender: ${tenderName}`);
    setShowCompletionBox(true);
    setShowCreateProjectModal(false);
    resetFormFields();
  };

  const closeModal = () => {
    setShowActionModal(false);
    setShowRecordModal(false);
    setShowAssignOfficerModal(false);
    setShowCreateProjectModal(false);
    setSelectedRequest(null);
    setViewingRequest(null);
    setCurrentTab(0);
    resetFormFields();
  };

  const resetFormFields = () => {
    setSelectedOfficer(null);
    setTenderName('');
    setTenderId('');
    setProcurementCategory('');
    setSbdType('');
    setDistributionMethod('');
    setInterestedBidders([]);
    setNewBidder('');
  };

  const addBidder = () => {
    if (newBidder.trim() && !interestedBidders.includes(newBidder.trim())) {
      setInterestedBidders([...interestedBidders, newBidder.trim()]);
      setNewBidder('');
    }
  };

  const removeBidder = (bidder: string) => {
    setInterestedBidders(interestedBidders.filter(b => b !== bidder));
  };

  const renderTabContent = () => {
    const currentTabId = tabs[currentTab].id;

    switch (currentTabId) {
      case 'assign_tender_id':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Assign Tender Name & ID
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Name
                </label>
                <input
                  type="text"
                  value={tenderName}
                  onChange={(e) => setTenderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter unique tender name"
                />
                {selectedRequest?.title && !selectedRequest?.tenderName && (
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested based on request title
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Identification Number
                </label>
                <input
                  type="text"
                  value={tenderId}
                  onChange={(e) => setTenderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter unique tender ID"
                />
                {selectedRequest?.id && !selectedRequest?.tenderId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated based on request ID
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'prepare_sbd':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Prepare Standard Bidding Documents
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procurement Category
                </label>
                <select
                  value={procurementCategory}
                  onChange={(e) => setProcurementCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Goods">Goods</option>
                  <option value="Works">Works</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SBD Template Type
                </label>
                <select
                  value={sbdType}
                  onChange={(e) => setSbdType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select SBD type</option>
                  <option value="Standard SBD - Goods">Standard SBD - Goods</option>
                  <option value="Standard SBD - Works">Standard SBD - Works</option>
                  <option value="Standard SBD - Services">Standard SBD - Services</option>
                  <option value="Simplified SBD">Simplified SBD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'distribute_sbd':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Send className="w-5 h-5" />
              Distribute SBD to Bidders
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distribution Method
                </label>
                <select
                  value={distributionMethod}
                  onChange={(e) => setDistributionMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select method</option>
                  <option value="Email (Soft Copy)">Email (Soft Copy)</option>
                  <option value="Physical Distribution (Hard Copy)">Physical Distribution (Hard Copy)</option>
                  <option value="Both Email and Physical">Both Email and Physical</option>
                  <option value="Portal Download">Portal Download</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Bidders
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newBidder}
                    onChange={(e) => setNewBidder(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add bidder name/company"
                    onKeyPress={(e) => e.key === 'Enter' && addBidder()}
                  />
                  <button
                    type="button"
                    onClick={addBidder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {interestedBidders.map((bidder, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span>{bidder}</span>
                      <button
                        onClick={() => removeBidder(bidder)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'seek_approval':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Seek Necessary Approvals
            </h3>
            <p className="text-gray-600">
              Request approval for supervising the following tender activities:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Tender submissions supervision
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Bid opening supervision
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Bid evaluations supervision
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderActionModal = () => {
    if (!showActionModal || !selectedRequest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tender Planning & Execution</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex overflow-x-auto pb-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(index)}
                  className={`flex-shrink-0 px-4 py-2 border-b-2 font-medium text-sm ${currentTab === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="mb-6">
            {renderTabContent()}
          </div>

          {/* Navigation and action buttons */}
          <div className="flex justify-between">
            <div>
              {currentTab > 0 && (
                <button
                  onClick={() => setCurrentTab(currentTab - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProgress}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </button>
              <button
                onClick={handleCompleteAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {currentTab < tabs.length - 1 ? 'Next' : 'Complete'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignOfficerModal = () => {
    if (!showAssignOfficerModal || !selectedRequest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tender Planning & Execution</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Assign Procurement Officer
            </h3>
            <p className="text-gray-600">Select a procurement officer to handle this tender:</p>
            <div className="space-y-2">
              {procurementOfficers.map(officer => (
                <div key={officer.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`officer-${officer.id}`}
                    name="officer"
                    value={officer.id}
                    checked={selectedOfficer === officer.id}
                    onChange={() => setSelectedOfficer(officer.id)}
                    className="text-blue-600"
                  />
                  <label htmlFor={`officer-${officer.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{officer.name}</div>
                    <div className="text-sm text-gray-500">{officer.email}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignOfficer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!selectedOfficer}
            >
              Assign Officer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateProjectModal = () => {
    if (!showCreateProjectModal || !selectedRequest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tender Planning & Execution</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Open Physical Project File
            </h3>
            <p className="text-gray-600">
              Create and open a physical project file for this tender.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Project File Details</span>
              </div>
              <p className="text-sm text-blue-700">
                File Location: /Procurement/Tenders/{selectedRequest?.id}/
              </p>
              <p className="text-sm text-blue-700">
                File Name: {selectedRequest?.title}_ProjectFile
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProjectFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create File
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRecordModal = () => {
    if (!showRecordModal || !viewingRequest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tender Request Details</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Information */}
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <p className="text-gray-500 text-sm">Request ID:</p>
                <p className="text-gray-900 font-mono">{viewingRequest.id}</p>
              </div>
              <div className="w-1/2 pl-2">
                <p className="text-gray-500 text-sm">Title:</p>
                <p className="text-gray-900">{viewingRequest.title}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <p className="text-gray-500 text-sm">Department:</p>
                <p className="text-gray-900">{viewingRequest.department}</p>
              </div>
              <div className="w-1/2 pl-2">
                <p className="text-gray-500 text-sm">Amount:</p>
                <p className="text-gray-900 font-bold">{viewingRequest.amount}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <p className="text-gray-500 text-sm">Current Stage:</p>
                <p className="text-gray-900">{viewingRequest.stage}</p>
              </div>
              <div className="w-1/2 pl-2">
                <p className="text-gray-500 text-sm">Status:</p>
                <p className="text-gray-900 capitalize">{viewingRequest.status}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <p className="text-gray-500 text-sm">Priority:</p>
                <p className="text-gray-900">{viewingRequest.priority}</p>
              </div>
              <div className="w-1/2 pl-2">
                <p className="text-gray-500 text-sm">Tender Status:</p>
                <p className="text-gray-900">{viewingRequest.tenderStatus || 'Not Started'}</p>
              </div>
            </div>

            {/* Assigned Officer */}
            {viewingRequest.assignedOfficer && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-gray-500 text-sm">Assigned Officer:</p>
                    <p className="text-gray-900">{viewingRequest.assignedOfficer}</p>
                  </div>
                  {viewingRequest.assignedOfficerId && (
                    <div className="w-1/2 pl-2">
                      <p className="text-gray-500 text-sm">Officer ID:</p>
                      <p className="text-gray-900">{viewingRequest.assignedOfficerId}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Tender Details */}
            {viewingRequest.tenderName && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-gray-500 text-sm">Tender Name:</p>
                    <p className="text-gray-900">{viewingRequest.tenderName}</p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-gray-500 text-sm">Tender ID:</p>
                    <p className="text-gray-900">{viewingRequest.tenderId}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ActionDropdown = ({ request }: { request: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (request.tenderStatus === 'Approved' || request.tenderStatus === 'Awaiting Approval') {
      return null;
    }

    const getActionLabel = () => {
      switch (request.tenderStatus) {
        case 'Validated': return 'Assign Officer';
        case 'Assigned': return 'Create Project File';
        case 'Project Created': return 'Assign Tender';
        case 'Tender Assigned': return 'Prepare SBD';
        case 'SBD Prepared': return 'Distribute SBD';
        case 'SBD Distributed': return 'Seek Approvals';
        default: return 'Process';
      }
    };

    const handleAction = () => {
      switch (request.tenderStatus) {
        case 'Validated':
          handleAssignOfficerClick(request);
          break;
        case 'Assigned':
          handleCreateProjectClick(request);
          break;
        default:
          handleActionClick(request);
          break;
      }
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 px-2 py-2 border border-gray-300 hover:bg-blue-100 rounded"
        >
          <EllipsisVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={handleAction}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 rounded-lg"
            >
              {request.tenderStatus === 'Validated' && <User className="w-4 h-4" />}
              {request.tenderStatus === 'Assigned' && <FolderOpen className="w-4 h-4" />}
              {(request.tenderStatus === 'Project Created' ||
                request.tenderStatus === 'Tender Assigned' ||
                request.tenderStatus === 'SBD Prepared' ||
                request.tenderStatus === 'SBD Distributed') && (
                  <FileText className="w-4 h-4" />
                )}
              {getActionLabel()}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="space-y-6">
        {/* Recent Requests Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tender Requests</h3>
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
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Current Stage</th>
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
                    <td className="py-3 px-4">{request.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {request.stage}
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
                        <button
                          onClick={() => handleViewRecord(request)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <ActionDropdown request={request} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {renderActionModal()}
      {renderAssignOfficerModal()}
      {renderCreateProjectModal()}
      {renderRecordModal()}

      {/* Completion Message Box */}
      {showCompletionBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Action Completed</h2>
              <button
                onClick={() => setShowCompletionBox(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowCompletionBox(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TenderManagement;