import * as React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
// import { TextField } from '@fluentui/react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
// import { DialogType, Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
// import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import DepartmentNeedsForm from './DepartmentalNeedsForm';

interface IColumnItemStageStyle {
    background: string;
    color: string;
}

interface IcurrentStageStyles {
    "Tender Evaluation": IColumnItemStageStyle;
    "EC Review": IColumnItemStageStyle;
    "Payment Processing": IColumnItemStageStyle;
}

interface IPriorityStyles {
    "High": IColumnItemStageStyle;
    "Medium": IColumnItemStageStyle;
    "Low": IColumnItemStageStyle;
}

interface IDetailsListItem {
    id: number;
    requestId: string;
    title: string;
    department: string;
    currentStage: string;
    priority: string;
    amount: string;
}


const currentStageStyles: IcurrentStageStyles = {
    "Tender Evaluation": {
        background: "#D6E4FF",
        color: "#1D4ED8"
    },
    "EC Review": {
        background: "#FFEFC1",
        color: "#92400E"
    },
    "Payment Processing": {
        background: "#CFFAEA",
        color: "#0F766E"
    }
};

const priorityStyles: IPriorityStyles = {
    "High": {
        background: "#FECACA",
        color: "#991B1B"
    },
    "Medium": {
        background: "#FDE68A",
        color: "#92400E"
    },
    "Low": {
        background: "#E5E7EB",
        color: "#374151"
    }
};

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


// const modalPropsStyles = { main: { maxWidth: 450 }, };

// const dialogContentProps = {
//     type: DialogType.normal,
//     title: 'Create New Role',
//     styles: {
//         title: {
//             fontSize: '14px',
//             padding: '0',
//         },
//         topButton: {
//             width: '57px',
//             height: '100%',
//             padding: '0px',
//             display: 'flex',
//             alignItems: 'center',
//         },
//         button: {
//             ':hover': {
//                 border: 'solid 1px',
//                 borderRadius: '50% !important',
//             },
//         },
//         header: {
//             margin: '25px 0 15px',
//             padding: '0px 25px'
//         },
//     }
// };

// const actionOptions: IDropdownOption[] = [
//     {
//         key: "Preview",
//         text: "Preview"
//     },
//     {
//         key: "Version History",
//         text: "Version History"
//     },
//     {
//         key: "Request for Review",
//         text: "Request for Review"
//     },
//     {
//         key: "Request for Signature",
//         text: "Request for Signature"
//     },
//     {
//         key: "Document History",
//         text: "Document History"
//     },
//     {
//         key: "Manage Access",
//         text: "Manage Access"
//     },
//     {
//         key: "Share",
//         text: "Share"
//     },
//     {
//         key: "Delete Document",
//         text: "Delete Document"
//     },
//     {
//         key: "Edit Document",
//         text: "Edit Document"
//     },
//     {
//         key: "Approve Document",
//         text: "Approve Document"
//     },
//     {
//         key: "Can Upload Document",
//         text: "Can Upload Document"
//     },
//     {
//         key: "View Document Properties",
//         text: "View Document Properties"
//     },
//     {
//         key: "View Check Out-In",
//         text: "View Check Out-In"
//     }
// ];

const DepartmentalNeeds: React.FunctionComponent<{}> = () => {
    const [isDepartmentRequestDialogOpen, { setTrue: openDepartmentRequestDialog, setFalse: dismissDepartmentRequestDialog }] = useBoolean(false);


    const detailsListColumns: IColumn[] = [
        {
            key: "column1",
            name: "Request ID",
            fieldName: "requestId",
            minWidth: 100,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item: IDetailsListItem) => (
                <span>{item.requestId}</span>
            ),
            isPadded: true
        },
        {
            key: "column2",
            name: "Title",
            fieldName: "title",
            minWidth: 150,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item: IDetailsListItem) => (
                <span>{item.title}</span>
            ),
            isPadded: true,
        },
        {
            key: "column3",
            name: "Department",
            fieldName: "department",
            minWidth: 100,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item: IDetailsListItem) => (
                <span>{item.department}</span>
            ),
            isPadded: true,
        },
        {
            key: "column4",
            name: "Current Stage",
            fieldName: "currentStage",
            minWidth: 120,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item: IDetailsListItem) => {
                const stageTileStyles = {
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: currentStageStyles[item.currentStage as keyof typeof currentStageStyles].background,
                    color: currentStageStyles[item.currentStage as keyof typeof currentStageStyles].color,
                };

                return <span style={stageTileStyles}>{item.currentStage}</span>
            },
            isPadded: true,
        },
        {
            key: "column5",
            name: "Priority",
            fieldName: "priority",
            minWidth: 80,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item) => {
                const stageTileStyles = {
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: priorityStyles[item.priority as keyof typeof priorityStyles].background,
                    color: priorityStyles[item.priority as keyof typeof priorityStyles].color,
                };

                return <span style={stageTileStyles}>{item.priority}</span>
            },
            isPadded: true,
        },
        {
            key: "column6",
            name: "Amount",
            fieldName: "amount",
            minWidth: 100,
            maxWidth: 250,
            isResizable: true,
            data: "string",
            onRender: (item) => (
                <span>{item.amount}</span>
            ),
            isPadded: true,
        },
        {
            key: "column7",
            name: "Actions",
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 500,
            isResizable: true,
            data: "",
            onRender: () => {
                return (
                    <Stack
                        horizontal
                        verticalAlign="center"
                        // styles={{
                        //   root: {
                        //     border: 'solid 1px red',
                        //   }
                        // }}
                        tokens={{ childrenGap: '10px' }}
                    >
                        <IconButton iconProps={{ iconName: "View" }} />
                        <IconButton iconProps={{ iconName: "Download" }} />
                    </Stack>
                );
            },
            // isPadded: true
        }
    ];


    return (
        <div>

            <div
                style={{
                    // border: 'solid 1px red',
                    padding: '20px 20px',
                    backgroundColor: '#ffffff'
                }}
            >
                <Stack horizontal horizontalAlign='space-between' verticalAlign='center'
                    styles={{
                        root: {
                            // border: 'solid 1px green',
                        }
                    }}
                >
                    <Text variant='large' styles={{ root: { fontWeight: 600 } }}>Recent Departmental Procurement Requests</Text>
                    <Stack horizontal tokens={{ childrenGap: '10px' }}>
                        <PrimaryButton text="New Request" iconProps={{ iconName: "Add" }} onClick={openDepartmentRequestDialog} />
                        <DefaultButton text="Filter" iconProps={{ iconName: "Filter" }} />
                    </Stack>
                </Stack>

                <div
                    style={{
                        // border: 'solid 1px blue',
                        // marginTop: '20px 0 0'
                    }}
                >
                    <DetailsList
                        items={dummyDetailsListItems}
                        columns={detailsListColumns}
                        selectionMode={SelectionMode.none}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                    // onRenderRow={onRenderRow}
                    // onRenderDetailsHeader={(props, defaultRender) =>
                    //   defaultRender ? defaultRender({ ...props, styles: detailsListHeaderStyles } as IDetailsHeaderProps) : null
                    // }
                    // styles={{
                    //   root: {
                    //     border: 'solid 1px red'
                    //   }
                    // }}
                    />
                </div>
            </div>

            {isDepartmentRequestDialogOpen &&
                // <Dialog
                //     hidden={!isDepartmentRequestDialogOpen}
                //     onDismiss={dismissDepartmentRequestDialog}
                //     dialogContentProps={dialogContentProps}
                //     modalProps={{
                //         isBlocking: true,
                //         styles: modalPropsStyles,
                //     }}
                //     minWidth={"400px"}
                // >
                //     <Stack
                //         tokens={{ childrenGap: 10 }}
                //     >
                //         <TextField
                //             label="Role Name"
                //             // value={disciplineName}
                //             // onChange={onChangeDisciplineName}
                //             placeholder="Enter Role Name"
                //             styles={{
                //                 subComponentStyles: {
                //                     label: {
                //                         color: 'red'
                //                     }
                //                 }
                //             }}
                //         />
                //         <Dropdown
                //             placeholder="Select actions for discipline"
                //             label="Actions"
                //             // selectedKeys={selectedActions}
                //             options={actionOptions}
                //         // multiSelect
                //         // onChange={onChangeActionsDropdown}
                //         />
                //     </Stack>
                //     <DialogFooter
                //         styles={{
                //             actions: {
                //                 paddingTop: '20px',
                //                 paddingBottom: '20px',
                //                 display: 'flex',
                //                 justifyContent: 'center',
                //             }
                //         }}
                //     >
                //         <DefaultButton
                //             // onClick={dismissDialog}
                //             text="Cancel" />
                //         <PrimaryButton
                //             // onClick={dismissDialog}
                //             text="Create"
                //         // className={classNames.submitButton}
                //         />
                //     </DialogFooter>
                // </Dialog>
                <DepartmentNeedsForm
                    isOpen={isDepartmentRequestDialogOpen}
                    onDismiss={dismissDepartmentRequestDialog}
                    />
            }
        </div>
    );
};

export default DepartmentalNeeds;