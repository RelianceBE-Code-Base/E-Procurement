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
  );
};

export default MemoCreationFormFluent8;
