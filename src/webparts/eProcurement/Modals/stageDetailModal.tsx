import { X } from 'lucide-react';
import * as React from 'react';

interface IStageDetailModal{
  selectedStage:any;
  setSelectedStage: any
}

const StageDetailModal:React.FC<IStageDetailModal> = ({selectedStage, setSelectedStage}) => {
  if (!selectedStage) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Stage {selectedStage.id}: {selectedStage.name}</h3>
            <button onClick={() => setSelectedStage(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className={`w-full h-2 rounded-full ${selectedStage.color}`}></div>
            <p className="text-gray-700">
              {selectedStage.id === 0 && "Establish procurement needs pipeline ahead of budgeting. Departments provide input on projected needs for annual planning."}
              {selectedStage.id === 1 && "Department identifies specific procurement requirement and drafts physical memo to Executive Chairman for approval."}
              {selectedStage.id === 2 && "Executive Chairman reviews and approves request, then forwards memo to Director of Procurement."}
              {selectedStage.id === 3 && "Director of Procurement validates request against approved annual procurement plan."}
              {selectedStage.id === 4 && "Director approves tendering process initiation and assigns task to Procurement Officer."}
              {selectedStage.id === 5 && "Procurement Officer manages tender planning, document preparation, and bid evaluation process."}
              {selectedStage.id === 6 && "Evaluation recommendations are prepared and routed for approval based on requisition thresholds."}
              {selectedStage.id === 7 && "Physical Award Letter is issued to winning vendor/contractor upon receiving appropriate approval."}
              {selectedStage.id === 8 && "Procurement Department monitors project execution and delivery until completion."}
              {selectedStage.id === 9 && "User Department verifies deliverables and issues Job Completion Certificate for payment processing."}
            </p>
            <div className="text-sm text-gray-600">
              <p><strong>Status:</strong> {selectedStage.status}</p>
              <p><strong>Automation Opportunities:</strong> Digital workflow, automated routing, electronic approvals</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default StageDetailModal;