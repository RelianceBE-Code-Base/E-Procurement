import * as React from 'react';
import { CircleX, X } from 'lucide-react';

interface IMsgBox {
  isOpen: boolean;
  message?: string;
  action: string;
  onDismiss?: () => void;
  referenceNumber: string;
  description?: string;
}

const MsgBox: React.FC<IMsgBox> = ({ isOpen, onDismiss, referenceNumber, message, action, description }) => {
  return (
    <>
    {isOpen &&

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{action}</h2>
        <button onClick={() => onDismiss?.()} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
        <strong>Reference Number:</strong> {referenceNumber}
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2"></h4>
          <p
            className="text-sm text-blue-700"
            dangerouslySetInnerHTML={{
              __html: `${message}<br /><br />${description || ""}`
            }}
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => onDismiss?.()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
        <CircleX className='w-4 h-4'/>
          Close
        </button>
      </div>
    </div>
    </div>
  }
  </>
  );
};

export default MsgBox;
