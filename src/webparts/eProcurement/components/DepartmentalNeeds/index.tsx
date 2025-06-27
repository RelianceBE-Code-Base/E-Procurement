import * as React from 'react';
import { useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
// import { TextField } from '@fluentui/react/lib/TextField';
// import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
// import { Text } from '@fluentui/react/lib/Text';
// import { Stack } from '@fluentui/react/lib/Stack';
// import { IconButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
// import { DialogType, Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
// import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import DepartmentNeedsForm from './DepartmentalNeedsForm';
import MsgBox from '../../Modals/msgBox';
import { Download, Eye, Filter, Plus } from 'lucide-react';

// interface IColumnItemStageStyle {
//     background: string;
//     color: string;
// }

// interface IcurrentStageStyles {
//     "Tender Evaluation": IColumnItemStageStyle;
//     "EC Review": IColumnItemStageStyle;
//     "Payment Processing": IColumnItemStageStyle;
// }

// interface IPriorityStyles {
//     "High": IColumnItemStageStyle;
//     "Medium": IColumnItemStageStyle;
//     "Low": IColumnItemStageStyle;
// }

interface IDetailsListItem {
    id: number;
    requestId: string;
    title: string;
    department: string;
    currentStage: string;
    priority: string;
    amount: string;
}


// const currentStageStyles: IcurrentStageStyles = {
//     "Tender Evaluation": {
//         background: "#D6E4FF",
//         color: "#1D4ED8"
//     },
//     "EC Review": {
//         background: "#FFEFC1",
//         color: "#92400E"
//     },
//     "Payment Processing": {
//         background: "#CFFAEA",
//         color: "#0F766E"
//     }
// };

// const priorityStyles: IPriorityStyles = {
//     "High": {
//         background: "#FECACA",
//         color: "#991B1B"
//     },
//     "Medium": {
//         background: "#FDE68A",
//         color: "#92400E"
//     },
//     "Low": {
//         background: "#E5E7EB",
//         color: "#374151"
//     }
// };

const dummyDetailsListItems: IDetailsListItem[] = [
    {
        id: 1,
        requestId: "REQ-2025-001",
        title: "Office Furniture Procurement",
        department: "Admin",
        currentStage: "Tender Evaluation",
        priority: "Medium",
        amount: "₦2,500,000"
    },
    {
        id: 2,
        requestId: "REQ-2025-002",
        title: "IT Equipment Upgrade",
        department: "ICT",
        currentStage: "EC Review",
        priority: "High",
        amount: "₦15,000,000"
    },
    {
        id: 3,
        requestId: "REQ-2025-003",
        title: "Vehicle Maintenance Services",
        department: "Transport",
        currentStage: "Payment Processing",
        priority: "Low",
        amount: "₦800,000"
    },
    {
        id: 4,
        requestId: "REQ-2025-004",
        title: "Office Printing Supplies",
        department: "Admin",
        currentStage: "EC Review",
        priority: "Medium",
        amount: "₦800,000"
    }
];


const DepartmentalNeeds: React.FunctionComponent<{}> = () => {
    const [isDepartmentRequestDialogOpen, { setTrue: openDepartmentRequestDialog, setFalse: dismissDepartmentRequestDialog }] = useBoolean(false);


    // const detailsListColumns: IColumn[] = [
    //     {
    //         key: "column1",
    //         name: "Request ID",
    //         fieldName: "requestId",
    //         minWidth: 100,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item: IDetailsListItem) => (
    //             <span>{item.requestId}</span>
    //         ),
    //         isPadded: true
    //     },
    //     {
    //         key: "column2",
    //         name: "Title",
    //         fieldName: "title",
    //         minWidth: 150,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item: IDetailsListItem) => (
    //             <span>{item.title}</span>
    //         ),
    //         isPadded: true,
    //     },
    //     {
    //         key: "column3",
    //         name: "Department",
    //         fieldName: "department",
    //         minWidth: 100,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item: IDetailsListItem) => (
    //             <span>{item.department}</span>
    //         ),
    //         isPadded: true,
    //     },
    //     {
    //         key: "column4",
    //         name: "Current Stage",
    //         fieldName: "currentStage",
    //         minWidth: 120,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item: IDetailsListItem) => {
    //             const stageTileStyles = {
    //                 padding: '8px',
    //                 borderRadius: '8px',
    //                 backgroundColor: currentStageStyles[item.currentStage as keyof typeof currentStageStyles].background,
    //                 color: currentStageStyles[item.currentStage as keyof typeof currentStageStyles].color,
    //             };

    //             return <span style={stageTileStyles}>{item.currentStage}</span>
    //         },
    //         isPadded: true,
    //     },
    //     {
    //         key: "column5",
    //         name: "Priority",
    //         fieldName: "priority",
    //         minWidth: 80,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item) => {
    //             const stageTileStyles = {
    //                 padding: '8px',
    //                 borderRadius: '8px',
    //                 backgroundColor: priorityStyles[item.priority as keyof typeof priorityStyles].background,
    //                 color: priorityStyles[item.priority as keyof typeof priorityStyles].color,
    //             };

    //             return <span style={stageTileStyles}>{item.priority}</span>
    //         },
    //         isPadded: true,
    //     },
    //     {
    //         key: "column6",
    //         name: "Amount",
    //         fieldName: "amount",
    //         minWidth: 100,
    //         maxWidth: 250,
    //         isResizable: true,
    //         data: "string",
    //         onRender: (item) => (
    //             <span>{item.amount}</span>
    //         ),
    //         isPadded: true,
    //     },
    //     {
    //         key: "column7",
    //         name: "Actions",
    //         fieldName: "actions",
    //         minWidth: 100,
    //         maxWidth: 500,
    //         isResizable: true,
    //         data: "",
    //         onRender: () => {
    //             return (
    //                 <Stack
    //                     horizontal
    //                     verticalAlign="center"
    //                     // styles={{
    //                     //   root: {
    //                     //     border: 'solid 1px red',
    //                     //   }
    //                     // }}
    //                     tokens={{ childrenGap: '10px' }}
    //                 >
    //                     <IconButton iconProps={{ iconName: "View" }} />
    //                     <IconButton iconProps={{ iconName: "Download" }} />
    //                 </Stack>
    //             );
    //         },
    //         // isPadded: true
    //     }
    // ];

    const [showCompletionBox, setShowCompletionBox] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [message, setMessage] = useState<string>(``);



    const openCompletionBox = (item: any) => {
        setMessage(`Your annual departmental need request has been successfully submitted.
       <br />
        The Executive Management will act on the request as appropriate.`)
        setShowCompletionBox(true)
        setReferenceNumber(item)
    }

    return (
        <>

<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold">Recent Departmental Procurement Requests</h3>
  <div className="flex gap-2">
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={openDepartmentRequestDialog}>
      <Plus className="w-4 h-4" />
      New Request
    </button>
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
      {dummyDetailsListItems.map((request:any) => (
        <tr key={request.requestId} className="border-b hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-sm">{request.requestId}</td>
          <td className="py-3 px-4">{request.title}</td>
          <td className="py-3 px-4">{request.department}</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-xs ${
              request.status === 'Completed' ? 'bg-green-100 text-green-800' :
              request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {request.currentStage}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded text-xs ${
              request.priority === 'High' ? 'bg-red-100 text-red-800' :
              request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {request.priority}
            </span>
          </td>
          <td className="py-3 px-4 font-semibold">{request.amount}</td>
          <td className="py-3 px-4">
            <div className="flex gap-2">
              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" onClick={ () => openCompletionBox(request.requestId)}>
               <Download className='w-4 h-4' />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>

{isDepartmentRequestDialogOpen &&
                <DepartmentNeedsForm
                    isOpen={isDepartmentRequestDialogOpen}
                    onDismiss={dismissDepartmentRequestDialog}
                    openCompletionBox={openCompletionBox}
                />
            }

{showCompletionBox &&
                <MsgBox
                    isOpen={showCompletionBox}
                    onDismiss={() => setShowCompletionBox(false)}
                    referenceNumber={referenceNumber}
                    message={message} action={'Department Need Request Initiated'}
                />
            }
</>
    );
};

export default DepartmentalNeeds;