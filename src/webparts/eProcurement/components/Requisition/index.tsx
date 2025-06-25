import { DefaultButton, MessageBar, MessageBarType, Modal, Stack } from '@fluentui/react';
import * as React from 'react';
import { useState } from 'react';
import styles from '../EProcurement.module.scss';

interface IRequistion {
  stages?: any;
  setSelectedStage?: any;
  sampleRequests: any
}
const Requistion: React.FC<IRequistion> = ({ sampleRequests }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubmit = () => {
    setIsSubmitting(true);
    handleReset()
    setReferenceNumber("REQ-2025-005")
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleDraft = () => {
    handleReset()
  }

  const handleReset = () => {

  }
  const onDismiss = () => {
    setIsSubmitted(false)
  }
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "Select Annual Plan") {
      setSelectedPlan(null)
    } else {
      setSelectedPlan(value)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">New Requisition Request</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter procurement request title" />
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${styles['no-after']} ${styles['no-before']}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"> Select Annual Plan</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSelect}>
                <option>Select Annual Plan</option>
                {sampleRequests.map((itm: any) => (
                  <option>{itm.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Category</option>
                <option>Goods</option>
                <option>Works</option>
                <option>Services</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description & Justification</label>
            <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide detailed description and justification for this procurement request"></textarea>
          </div>

          {selectedPlan &&
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Line items for the selected annual plan</h3>
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
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRequests.slice(0, 4).map((request: any) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
              Submit Request
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={handleDraft}>
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isSubmitted}
        onDismiss={() => {
          handleReset();
          onDismiss();
        }}
        isBlocking={false}
        containerClassName={styles.modalContent}
      >
        <div className={styles.modalContainer}>
          <Stack tokens={{ childrenGap: 16 }}>

            <MessageBar
              messageBarType={MessageBarType.success}
              styles={{ root: { marginBottom: '16px' } }}
              isMultiline={true}
            >
              <strong>Submitted Successfully!</strong><br /><br />
              A memo has been generated, addressed to the Executive Chairman (EC) seeking approval to initiate procurement for the stated need.<br /><br />
              Reference Number: <strong>{referenceNumber}</strong><br />
              <br />
              Once Executive Chairman (EC) approves, the memo is forwarded to the Director of Procurement for action
              <br />
              •	The Director of Procurement:
              Reviews the memo,
              Validates the request against the approved annual procurement plan


            </MessageBar>


            <Stack horizontal horizontalAlign="space-between">
              <DefaultButton
                onClick={() => { handleReset(); onDismiss(); setIsSubmitted(false) }}
                text={"Close"}
                iconProps={{ iconName: 'circle-x' }}
              />

            </Stack>
          </Stack>
        </div>
      </Modal>
    </>
  )

}
export default Requistion