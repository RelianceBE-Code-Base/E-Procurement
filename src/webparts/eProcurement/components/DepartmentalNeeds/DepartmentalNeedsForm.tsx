import * as React from "react";
import { useState } from "react";
import {
  IDropdownOption
} from "@fluentui/react";
import ProcurementItemsFluent8, { ProcurementItem } from "./AddItem";
import { X, ChevronLeft, Save, ChevronRight, AlertCircle } from "lucide-react";

const MemoCreationFormFluent8 = ({ isOpen, onDismiss, openCompletionBox }: { isOpen: boolean; onDismiss: () => void, openCompletionBox: (item: any) => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    templateType: "",
    title: "",
    department: "",
    description: "",
    justification: "",
    estimatedCost: 0,
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
  //const [error, setError] = useState<string | null>(null);
  const [estimatedTotalCost, setEstimatedTotalCost] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

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
    { id: '1', title: 'Basic Info' },
    { id: '2', title: 'Request Details' },
    { id: '3', title: 'Items' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    //setError(null);
    if (validationError) setValidationError(null);
  };

  const addItem = () => {
    if (!newItem.title || !newItem.description) return;

    const updatedItems = [
      ...items,
      {
        id: newItem.id,
        title: newItem.title!,
        quantity: newItem.quantity || 1,
        estimatedCost: newItem.estimatedCost || 0,
        description: newItem.description!,
      },
    ];


  setItems(updatedItems);

  // Reset the new item form
  const nextId = newItem.id + 1;
  setNewItem({ id: nextId, title: "", quantity: 0, estimatedCost: 0, description: "" });

  // Calculate total from updatedItems, not stale `items`
  const totalCost = updatedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) * Number(item.estimatedCost)),
    0
  );
    setEstimatedTotalCost(totalCost);

    if (validationError) setValidationError(null);
  };


  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.templateType || !formData.title || !formData.department || !formData.planReference) {
          setValidationError("Please fill in all required fields in this step");
          return false;
        }
        break;
      case 2:
        if (!formData.description || !formData.justification) {
          setValidationError("Please fill in all required fields in this step");
          return false;
        }
        break;
      case 3:
        if (
          estimatedTotalCost === 0
        ) {
          setValidationError("No procurement items added yet");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Simulate validation against annual procurement plan
      if (Math.random() > 0.3) {
        // 70% chance of success for demo purposes

        //setTimeout(() => {
          // Delay onDismiss and openCompletionBox
          onDismiss();
          openCompletionBox("RQ-2025-005");
  
        //}, 1500); // 1.5 seconds delay
      } else {
        setValidationError(
          "Request does not match any item in the approved annual procurement plan",
        );
      }
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  }

  const renderTabContent = () => {
    const currentTabId = tabs[currentStep-1].id;
    switch (currentTabId) {
      case '1':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {/* <FileText className="w-5 h-5" />
              {tabs[0].title} */}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Type *
                </label>
                <select
                  value={formData.templateType}
                  onChange={(e) => handleInputChange("templateType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select template type</option>
                  {templateOptions.map((itm: any, index: number) =>
                    <option value={index}>{itm.text}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {departmentOptions.map((itm: any, index: number) =>
                    <option value={index}>{itm.text}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Plan Reference *
                </label>
                <input
                  type="text"
                  value={formData.planReference}
                  onChange={(e) => handleInputChange("planReference", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter annual plan reference"
                />
              </div>
            </div>
          </div>
        );

      case '2':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {/* <FileText className="w-5 h-5" /> */}
              {/* {tabs[1].title} */}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification *
                </label>
                <textarea
                  rows={5}
                  value={formData.justification}
                  onChange={(e) => handleInputChange("justification", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case '3':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {/* <Send className="w-5 h-5" />
              {tabs[2].title} */}
            </h3>
            <div className="space-y-4">
              <ProcurementItemsFluent8
                items={items}
                newItem={newItem}
                estimatedTotalCost={estimatedTotalCost}
                setNewItem={setNewItem}
                addItem={addItem}
                removeItem={removeItem}
              />
            </div>
            
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create Procurement Request</h2>
            <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Complete the form to initiate a new procurement request. All fields
            marked with * are required.
          </p>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Progress tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex overflow-x-auto pb-2">
              {tabs.map((tab, index) => (
                //console.log(tab +" "+ index);
                <button
                key={tab.id}
                //onClick={() => setCurrentStep(index);}
                className={`flex-shrink-0 px-4 py-2 border-b-2 font-medium text-sm ${currentStep === index+1
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.title}
              </button>
              ))}
            </div>
          </div>
           {/* Validation Error Alert */}
           {validationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{validationError}</p>
                </div>
              </div>
            )}

          {/* Tab content */}
          <div className="mb-6">
            {renderTabContent()}
          </div>

          {/* Navigation and action buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => (currentStep === 1 ? onDismiss() : setCurrentStep(currentStep - 1))}
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
                  if (currentStep === 3) {
                    handleSubmit();
                  } else {
                    handleNext()
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {currentStep === 3 && <Save className="w-4 h-4" />}
                {currentStep < 3 ? 'Next' : 'Submit'}
                {currentStep < 3 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoCreationFormFluent8;
