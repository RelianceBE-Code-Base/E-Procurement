import * as React from 'react';
import { useState } from "react";
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { initializeIcons } from '@fluentui/react';
import { FileText, Save, X, CircleX } from 'lucide-react';
import MsgBox from '../../Modals/msgBox';

// Initialize Fluent UI icons
initializeIcons();

interface NewAnnualPlanProps {
  isOpen: boolean;
  onSubmit?: (data: any) => void;
  onDismiss?: () => void;
}



const NewAnnualPlan = ({
  onSubmit = () => { },
  onDismiss = () => { },
}: NewAnnualPlanProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successful, setSuccessful] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");


  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error when user makes changes
    if (validationError) setValidationError(null);
  };


  const validateCurrentStep = () => {

    if (!formData.title || !formData.description) {
      setValidationError("Please fill in all required fields");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    });
    setValidationError(null);
  };



  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setSuccessful(true)
      onSubmit(formData);
      setReferenceNumber("REQ-2025-005")
    }

  };


  return (
    <>
      {!successful &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Initiate Annual Planning</h2>
              <button onClick={() => {
                resetForm();
                onDismiss();
              }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <MessageBar messageBarType={MessageBarType.error} styles={{ root: { marginBottom: '16px' } }}>
                {validationError}
              </MessageBar>
            )}

            {/* Tab content */}
            <div className="mb-6">
              <div className="space-y-4">
                <h6 className="text-sm text-gray-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Complete the form to initiate a new annual plan request. All fields
                  marked with * are required.
                </h6>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a descriptive title for your reques"
                    />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Justification
                    </label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Explain why this annual plan is necessary"
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and action buttons */}
            <div className="flex justify-end">
              <div className="flex gap-3">
                <button
                  onClick={() => { resetForm(); onDismiss(); setSuccessful(false) }}

                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <CircleX className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {successful &&
        <MsgBox isOpen={successful} onDismiss={() => { onDismiss(); setSuccessful(false) }} action={'Submitted Successfully'} referenceNumber={referenceNumber} message='Email notifications have been successfully sent to all departments.' description='Departments are expected to respond with their projected procurement needs as part of the annual planning process.' />
      }
    </>
  );
};

export default NewAnnualPlan;