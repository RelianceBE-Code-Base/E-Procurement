import { Eye, FileText, Filter, X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import MsgBox from '../../Modals/msgBox';
import NewContract from '../AnnualPlan/newAnnualPlan'

interface IContractManagement {
  stages?: any;
  setSelectedStage?: any;
  sampleRequests: any
}
type Contract = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  category: string;
  performanceRating: number;
  registrationDate: string;
  status: string;
  stage?: string;
  previousContracts: number;
};

const selectedVendors: Contract[] = [
  {
    id: "VND-001",
    companyName: "GlobalTech Supplies Ltd.",
    contactPerson: "Jane Okafor",
    email: "j.okafor@globaltech.com",
    phone: "+234-701-234-5678",
    address: "12 Allen Avenue, Ikeja, Lagos",
    taxId: "TIN-76482319",
    category: "ICT Equipment",
    performanceRating: 4.5,
    registrationDate: "2023-02-12",
    status: "Verified",
    previousContracts: 3,
  },
  {
    id: "VND-002",
    companyName: "EcoBuild Nigeria Ltd.",
    contactPerson: "Ahmed Musa",
    email: "ahmed.m@ecobuild.com.ng",
    phone: "+234-803-456-7812",
    address: "23 Stadium Road, Port Harcourt, Rivers",
    taxId: "TIN-98172648",
    category: "Construction",
    performanceRating: 4.7,
    registrationDate: "2022-11-05",
    status: "Verified",
    previousContracts: 5,
  },
  {
    id: "VND-003",
    companyName: "CleanWorks Hygiene Services",
    contactPerson: "Ngozi Eze",
    email: "ngozi.eze@cleanworks.com",
    phone: "+234-806-221-9870",
    address: "Plot 4, Gwarinpa Estate, Abuja",
    taxId: "TIN-11234567",
    category: "Cleaning & Janitorial",
    performanceRating: 4.1,
    registrationDate: "2024-01-18",
    status: "Awaiting Verification",
    previousContracts: 1,
  },
  {
    id: "VND-004",
    companyName: "Prime Logistics and Haulage",
    contactPerson: "Emeka Nwosu",
    email: "emeka.n@primelogistics.ng",
    phone: "+234-905-432-1245",
    address: "Suite B14, Trade Fair Complex, Lagos",
    taxId: "TIN-66778890",
    category: "Transport & Logistics",
    performanceRating: 4.3,
    registrationDate: "2023-07-10",
    status: "Verified",
    previousContracts: 2,
  },
  {
    id: "VND-005",
    companyName: "MedicLink Pharmaceuticals",
    contactPerson: "Dr. Aisha Bello",
    email: "a.bello@mediclink.com",
    phone: "+234-802-345-6743",
    address: "14A, Medical Lane, Ilorin, Kwara",
    taxId: "TIN-55667788",
    category: "Medical Supply",
    performanceRating: 4.9,
    registrationDate: "2021-06-03",
    status: "Verified",
    previousContracts: 6,
  }
];

const ContractManagement: React.FC<IContractManagement> = ({ sampleRequests }) => {
  const [showNewContract, setShowNewContract] = useState(false)
  const [showCompletionBox, setShowCompletionBox] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [message, setMessage] = useState<string>(``);
  const [showVendors, setShowVendors] = useState<boolean>(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // const openNewContract = () => {
  //   setShowNewContract(true)
  // }

  const openCompletionBox = (item: any) => {
    setMessage(`An Award Letter has been issued to the winning vendor/contractor`)
    setShowCompletionBox(true)
    setReferenceNumber(item)
  }

  // Find the top performer
  const topVendor: Contract | null = selectedVendors.reduce<Contract | null>((top, current) => {
    if (!top || current.performanceRating > top.performanceRating) {
      return current;
    }
    return top;
  }, null);
  


  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="space-y-6">


        {/* Recent Requests Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Contract Requests</h3>
            <div className="flex gap-2">
              {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={openNewContract}>
                <Plus className="w-4 h-4" />
                New Request
              </button> */}
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
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Approved Date</th>
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
                        {request.finalApproval}

                    </td>
                    <td className="py-3 px-4 font-semibold">{request.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 hover:bg-blue-100 rounded text-sm"
                         onClick={() => {request.stage === 'Ready for PO Issuance' ? (setShowCompletionBox(true), setMessage("PO issued to vendor successfully")) : setShowVendors(true); setSelectedContract(request)}}>
                        <Eye className="w-4 h-4" /> {request.stage !== 'Ready for PO Issuance' ? 'View Vendors' : 'Issue  PO'}
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

      {showNewContract && <NewContract isOpen={showNewContract} onDismiss={() => setShowNewContract(false)} />}
      <MsgBox
        isOpen={showCompletionBox}
        onDismiss={() => setShowCompletionBox(false)}
        referenceNumber={referenceNumber}
        message={message} action={'Contract Awarded'} />

{showVendors && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Vendors for {selectedContract?.id} Contract</h2>
        <button
          onClick={() => setShowVendors(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <h6 className="text-sm text-gray-600 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Vendors with Submitted and Reviewed Bids
        </h6>

        <div className="overflow-x-auto border rounded">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left border-b">
                <th className="py-3 px-4">Tax ID</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Performance Rating</th>
                <th className="py-3 px-4">Previous Contracts</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedVendors?.length > 0 ? (
                selectedVendors.map((vendor: any) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">{vendor.taxId}</td>
                    <td className="py-3 px-4">{vendor.companyName}</td>
                    <td className="py-3 px-4">{vendor.contactPerson}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === "Verified"
                            ? "bg-green-100 text-green-800"
                            : vendor.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        {vendor.performanceRating}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {vendor.previousContracts} Contract
                      {vendor.previousContracts > 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-4">
                    {selectedContract?.stage === 'Ready for Award Letter' ? (
                      <button
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                        onClick={() => {
                          openCompletionBox(vendor.id);
                          setShowVendors(false);
                        }}
                      >
                        Award Letter
                      </button>
                    ) : (
                      vendor.id === topVendor?.id && vendor.performanceRating && (
                        <button
                          className="px-3 py-1 text-sm bg-green-500 text-white border border-green-200 rounded hover:bg-green-600"
                          disabled
                        >
                          Letter Awarded
                        </button>
                      )
                    )}
                  </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan={7}>
                    No vendors available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}

    </main>
  )
}
export default ContractManagement