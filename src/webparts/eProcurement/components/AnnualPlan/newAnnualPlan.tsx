import * as React from 'react';
import { useState } from "react";
import {
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react/lib/Button';

import { TextField } from '@fluentui/react/lib/TextField';
import { Label } from '@fluentui/react/lib/Label';
// import {
//   Dropdown,
//   IDropdownOption,
// } from '@fluentui/react/lib/Dropdown';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
//import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
// import {
//   Icon
// } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { initializeIcons, Modal, Stack } from '@fluentui/react';

// Initialize Fluent UI icons
initializeIcons();

interface NewAnnualPlanProps {
    isOpen: boolean;
    onSubmit?: (data: any) => void;
    onDismiss?: () => void;
}
  
  const containerStyle = mergeStyles({
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108)',
    borderRadius: '4px',
  });

  const modalContentStyles = mergeStyles({
    width: '700px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  });

const NewAnnualPlan = ({
    isOpen,
    onSubmit = () => {},
    onDismiss = () => {},
}: NewAnnualPlanProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successful, setSuccessful] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);


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
    setCurrentStep(1);
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
        setCurrentStep(1)

  };


  return (
    <Modal
    isOpen={isOpen}
    onDismiss={() => {
      resetForm();
      onDismiss();
    }}
    isBlocking={false}
    containerClassName={modalContentStyles}
  >
    <div className={containerStyle}>
    <Stack tokens={{ childrenGap: 16 }}>
    {!successful && <div>
      <Stack>
        <h2 style={{ margin: 0 }}>Initiate Annual Planning</h2>
        <p style={{ marginTop: '8px', color: '#605e5c' }}>
          Complete the form to initiate a new annual plan request. All fields
          marked with * are required.
        </p>
  
      </Stack>

      {validationError && (
          <MessageBar messageBarType={MessageBarType.error} styles={{ root: { marginBottom: '16px' } }}>
            {validationError}
          </MessageBar>
        )}

        <Pivot selectedKey={`step-${currentStep}`} styles={{ root: { width: '100%' } }}>

          <PivotItem itemKey="step-1" headerText="">

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <Label required>Request Title</Label>
                  <TextField
                    placeholder="Enter a descriptive title for your request"
                    value={formData.title}
                    onChange={(e, value) => handleChange("title", value)}
                  />
                </div>

                <div>
                  <Label required>Business Justification</Label>
                  <TextField
                    placeholder="Explain why this annual plan is necessary"
                    multiline
                    rows={5}
                    value={formData.description}
                    onChange={(e, value) => handleChange("description", value)}
                  />
                </div>
              </div>

          </PivotItem>

        </Pivot>
    </div>}
    {successful && (
        <MessageBar
            messageBarType={MessageBarType.success}
            styles={{ root: { marginBottom: '16px' } }}
            isMultiline={true}
        >
            <strong>Submitted Successfully!</strong><br /><br />
            Email notifications have been successfully sent to all departments.<br /><br />
            Reference Number: <strong>{referenceNumber}</strong><br />
            <br />
            Departments are expected to respond with their projected procurement needs as part of the annual planning process.

        </MessageBar>
        )}

      <Stack horizontal horizontalAlign="space-between">
          <DefaultButton
            onClick={() => { resetForm(); onDismiss(); setSuccessful(false) }}
            text={successful ? "Close" : "Cancel"}
            iconProps={ { iconName: 'circle-x' }}
          />

          <PrimaryButton
            onClick={handleSubmit}
            text={"Submit Request"}
            iconProps={ { iconName: 'send-horizontal' }}
            disabled={successful}
          />
      </Stack>
    </Stack>
    </div>
    </Modal>
  );
};

export default NewAnnualPlan;