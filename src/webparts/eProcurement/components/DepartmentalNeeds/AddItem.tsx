import * as React from "react";
// import { useState } from "react";
import {
    TextField,
    // Dropdown,
    // IDropdownOption,
    PrimaryButton,
    //   DefaultButton,
    Label,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    IconButton,
    Stack,
    MessageBar,
    MessageBarType,
} from "@fluentui/react";

export interface ProcurementItem {
    id: number;
    title: string;
    quantity: number;
    estimatedCost: number;
    description: string;
    // estimatedTotalCost: number;
    // priority: 'high' | 'medium' | 'low';
    // justification: string;
}

interface Props {
    newItem: ProcurementItem;
    setNewItem: (item: ProcurementItem) => void;
    items: ProcurementItem[];
    estimatedTotalCost: number;
    addItem: () => void;
    removeItem: (id: number) => void;
}

const ProcurementItemsFluent8: React.FC<Props> = ({ newItem, setNewItem, items, estimatedTotalCost, addItem, removeItem }) => {
    // const priorityOptions: IDropdownOption[] = [
    //     { key: 'high', text: 'High' },
    //     { key: 'medium', text: 'Medium' },
    //     { key: 'low', text: 'Low' },
    // ];

    const columns: IColumn[] = [
        { key: 'title', name: 'Title', fieldName: 'title', minWidth: 100, isMultiline: true },
        { key: 'description', name: 'Description', fieldName: 'description', minWidth: 150, isMultiline: true },
        { key: 'quantity', name: 'Qty', fieldName: 'quantity', minWidth: 50 },
        { key: 'unitCost', name: 'Unit Cost', fieldName: 'estimatedCost', minWidth: 80, onRender: item => `₦${item.estimatedCost.toLocaleString()}` },
        { key: 'total', name: 'Total', fieldName: '', minWidth: 80, onRender: item => `₦${(item.quantity * item.estimatedCost).toLocaleString()}` },
        // {
        //     key: 'priority',
        //     name: 'Priority',
        //     fieldName: 'priority',
        //     minWidth: 80,
        //     onRender: item => (
        //         <span style={{
        //             padding: '4px 8px',
        //             borderRadius: '9999px',
        //             fontSize: 12,
        //             backgroundColor:
        //                 item.priority === 'high' ? '#FDE7E9' :
        //                     item.priority === 'medium' ? '#FFF4CE' :
        //                         '#DFF6DD',
        //             color:
        //                 item.priority === 'high' ? '#A4262C' :
        //                     item.priority === 'medium' ? '#986F0B' :
        //                         '#0B6A0B',
        //         }}>{item.priority}</span>
        //     )
        // },
        {
            key: 'actions',
            name: 'Actions',
            fieldName: '',
            minWidth: 50,
            onRender: item => (
                <IconButton iconProps={{ iconName: 'Delete' }} title="Remove" onClick={() => removeItem(item.id)} />
            )
        }
    ];

    return (
        <Stack tokens={{ childrenGap: 20 }}>
            <Stack tokens={{ childrenGap: 10 }}>
                {/* <Label>Add Procurement Item</Label> */}
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <TextField
                        label="Title"
                        value={newItem.title}
                        onChange={(_, val) => setNewItem({ ...newItem, title: val || '' })}
                        styles={{ root: { width: '50%' } }}
                    />
                    {/* <Dropdown
                        label="Priority"
                        selectedKey={newItem.priority}
                        options={priorityOptions}
                        onChange={(_, opt) => setNewItem({ ...newItem, priority: opt?.key as 'high' | 'medium' | 'low' })}
                        styles={{ root: { width: '50%' } }}
                    /> */}
                    <TextField
                        label="Quantity"
                        type="number"
                        min={0}
                        value={newItem.quantity.toString()}
                        onChange={(_, val) => setNewItem({ ...newItem, quantity: parseInt(val || '0') })}
                        styles={{ root: { width: '50%' } }}
                    />
                </Stack>


                <Stack horizontal tokens={{ childrenGap: 10 }} >
                    <TextField
                        label="Estimated Unit Cost (₦)"
                        type="number"
                        min={0}
                        // step={0.01}
                        value={newItem.estimatedCost.toString()}
                        onChange={(_, val) => setNewItem({ ...newItem, estimatedCost: parseFloat(val || '0') })}
                        styles={{ root: { width: '50%' } }}
                    />
                    <TextField
                        label="Estimated Total Cost (₦)"
                        type="number"
                        value={items.reduce((sum, item) => sum + item.quantity * item.estimatedCost, 0).toLocaleString()}
                        styles={{ root: { width: '50%' } }}
                    />
                </Stack>

                <TextField
                    label="Description"
                    value={newItem.description}
                    onChange={(_, val) => setNewItem({ ...newItem, description: val || '' })}
                />

                {/* <TextField
                        label="Business Justification"
                        multiline
                        rows={3}
                        value={newItem.justification}
                        onChange={(_, val) => setNewItem({ ...newItem, justification: val || '' })}
                    /> 
                */}

                <PrimaryButton text="Add Item" onClick={addItem} />
            </Stack>

            <Stack>
                <Label>Procurement Items ({items.length})</Label>
                {items.length > 0 ? (
                    <DetailsList
                        items={items}
                        columns={columns}
                        layoutMode={DetailsListLayoutMode.fixedColumns}
                        selectionMode={SelectionMode.none}
                    />
                ) : (
                    <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        No procurement items added yet. Use the form above to add items.
                    </MessageBar>
                )}
            </Stack>
        </Stack>
    );
};

export default ProcurementItemsFluent8;
