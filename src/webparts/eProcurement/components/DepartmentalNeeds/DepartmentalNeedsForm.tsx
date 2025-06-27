import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Pivot,
  PivotItem,
  Stack,
  TextField,
  Dropdown,
  IDropdownOption,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
} from "@fluentui/react";
import ProcurementItemsFluent8, { ProcurementItem } from "./AddItem";
import { X, ChevronLeft, Save, ChevronRight } from "lucide-react";

const MemoCreationFormFluent8 = ({ isOpen, onDismiss, openCompletionBox }: { isOpen: boolean; onDismiss: () => void, openCompletionBox: (item: any) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    templateType: "",
    title: "",
    department: "",
    description: "",
    justification: "",
    estimatedCost: "",
    planReference: "",
  });
  const [items, setItems] = useState<ProcurementItem[]>([]);
  const [newItem, setNewItem] = useState<ProcurementItem>({
    id: 1,
    title: "",
    quantity: 0,
    estimatedCost: 0,
    description: "",
    // estimatedTotalCost: 0,
    // justification: "",
    // priority: "medium",
  });
  const [error, setError] = useState<string | null>(null);
  const [estimatedTotalCost, setEstimatedTotalCost] = useState<number>(0);

  const templateOptions: IDropdownOption[] = [
    { key: "goods", text: "Procurement of Goods" },
    { key: "services", text: "Procurement of Services" },
    { key: "works", text: "Procurement of Works" },
    { key: "consultancy", text: "Consultancy Services" },
  ];

  const departmentOptions: IDropdownOption[] = [
    { key: "finance", text: "Finance Department" },
    { key: "it", text: "Information Technology" },
    { key: "admin", text: "Administration" },
    { key: "hr", text: "Human Resources" },
    { key: "operations", text: "Operations" },
  ];

  const tabs = [
    { id: 'assign_tender_id', title: 'Basic Info' },
    { id: 'prepare_sbd', title: 'Request Details' },
    { id: 'distribute_sbd', title: 'Items' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
  };

  const addItem = () => {
    if (!newItem.title || !newItem.description) return;

    setItems([
      ...items,
      {
        id: newItem.id,
        title: newItem.title!,
        quantity: newItem.quantity || 1,
        estimatedCost: newItem.estimatedCost || 0,
        // estimatedTotalCost: newItem.estimatedTotalCost || 0,
        description: newItem.description!,
        // justification: newItem.justification || "",
        // priority: newItem.priority || "medium",
      },
    ]);

    const nextId = newItem.id + 1;
    setNewItem({ id: nextId, title: "", quantity: 0, estimatedCost: 0, description: "" });

    const totalCost = items.reduce((sum, item) => sum + item.quantity * item.estimatedCost, 0);
    setEstimatedTotalCost(totalCost);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    // Dummy check
    if (!formData.templateType || !formData.title) {
      setError("Please complete required fields");
      return;
    }
    console.log("Form Data:", formData);
    console.log("Items:", items);
    onDismiss();
    openCompletionBox("RQ-2025-005");
  };

  return (
    <>
    <Dialog
      hidden={!isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Create Procurement Request",
        subText: "Complete all steps to submit your request",
      }}
      modalProps={{ isBlocking: false }}
      minWidth={900}
    >
      <ProgressIndicator
        label={`Step ${currentStep + 1} of 3`}
        percentComplete={(currentStep + 1) / 3}
      />

      {error && (
        <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>
      )}

      <Pivot selectedKey={`step-${currentStep}`}>
        <PivotItem headerText="Basic Info" itemKey="step-0">
          <Stack tokens={{ childrenGap: 10 }}>
            <Dropdown
              label="Template Type"
              selectedKey={formData.templateType}
              options={templateOptions}
              onChange={(_, option) => handleInputChange("templateType", option?.key as string)}
            />
            <TextField
              label="Title"
              value={formData.title}
              onChange={(_, val) => handleInputChange("title", val || "")}
            />
            <Dropdown
              label="Department"
              selectedKey={formData.department}
              options={departmentOptions}
              onChange={(_, option) => handleInputChange("department", option?.key as string)}
            />
            <TextField
              label="Annual Plan Reference"
              value={formData.planReference}
              onChange={(_, val) => handleInputChange("planReference", val || "")}
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Request Details" itemKey="step-1">
          <Stack tokens={{ childrenGap: 10 }}>
            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(_, val) => handleInputChange("description", val || "")}
            />
            <TextField
              label="Justification"
              multiline
              rows={3}
              value={formData.justification}
              onChange={(_, val) => handleInputChange("justification", val || "")}
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Items" itemKey="step-2">
          <ProcurementItemsFluent8
            items={items}
            newItem={newItem}
            estimatedTotalCost={estimatedTotalCost}
            setNewItem={setNewItem}
            addItem={addItem}
            removeItem={removeItem}
          />
        </PivotItem>
      </Pivot>

      <DialogFooter>
        <DefaultButton
          text={currentStep === 0 ? "Cancel" : "Back"}
          onClick={() => (currentStep === 0 ? onDismiss() : setCurrentStep(currentStep - 1))}
        />
        <PrimaryButton
          text={currentStep === 2 ? "Submit" : "Next"}
          onClick={() => {
            if (currentStep === 2) {
              handleSubmit();
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        />
      </DialogFooter>
    </Dialog>

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create Procurement Request</h2>
            <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex overflow-x-auto pb-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-shrink-0 px-4 py-2 border-b-2 font-medium text-sm ${currentStep === index
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
            {/* {renderTabContent()} */}
          </div>

          {/* Navigation and action buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 0 && (
                <button
                onClick={() => (currentStep === 0 ? onDismiss() : setCurrentStep(currentStep - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </button>
              <button
                        onClick={() => {
                          if (currentStep === 2) {
                            handleSubmit();
                          } else {
                            setCurrentStep(currentStep + 1);
                          }
                        }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {currentStep < tabs.length - 1 ? 'Next' : 'Submit'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoCreationFormFluent8;
