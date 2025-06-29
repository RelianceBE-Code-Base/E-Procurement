import * as React from "react";
// import { useState } from "react";
import {
    MessageBar,
    MessageBarType,
} from "@fluentui/react";
import {  X } from "lucide-react";
import styles from "../EProcurement.module.scss";

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

    // const columns: IColumn[] = [
    //     { key: 'title', name: 'Title', fieldName: 'title', minWidth: 100, isMultiline: true },
    //     { key: 'description', name: 'Description', fieldName: 'description', minWidth: 150, isMultiline: true },
    //     { key: 'quantity', name: 'Qty', fieldName: 'quantity', minWidth: 50 },
    //     { key: 'unitCost', name: 'Unit Cost', fieldName: 'estimatedCost', minWidth: 80, onRender: item => `₦${item.estimatedCost.toLocaleString()}` },
    //     { key: 'total', name: 'Total', fieldName: '', minWidth: 80, onRender: item => `₦${(item.quantity * item.estimatedCost).toLocaleString()}` },
    //     // {
    //     //     key: 'priority',
    //     //     name: 'Priority',
    //     //     fieldName: 'priority',
    //     //     minWidth: 80,
    //     //     onRender: item => (
    //     //         <span style={{
    //     //             padding: '4px 8px',
    //     //             borderRadius: '9999px',
    //     //             fontSize: 12,
    //     //             backgroundColor:
    //     //                 item.priority === 'high' ? '#FDE7E9' :
    //     //                     item.priority === 'medium' ? '#FFF4CE' :
    //     //                         '#DFF6DD',
    //     //             color:
    //     //                 item.priority === 'high' ? '#A4262C' :
    //     //                     item.priority === 'medium' ? '#986F0B' :
    //     //                         '#0B6A0B',
    //     //         }}>{item.priority}</span>
    //     //     )
    //     // },
    //     {
    //         key: 'actions',
    //         name: 'Actions',
    //         fieldName: '',
    //         minWidth: 50,
    //         onRender: item => (
    //             <IconButton iconProps={{ iconName: 'Delete' }} title="Remove" onClick={() => removeItem(item.id)} />
    //         )
    //     }
    // ];

    return (
        <>
            {/* <Stack tokens={{ childrenGap: 20 }}> 
                <Stack tokens={{ childrenGap: 10 }}>
                    {/* <Label>Add Procurement Item</Label> *
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
                    /> 
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
                *

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
            */}

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                
                            </h3>
                            <div className="space-y-4">
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${styles['no-after']} ${styles['no-before']}`}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={newItem.title}
                                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value || '' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="number"
                                                value={newItem.quantity}
                                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Quantity"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${styles['no-after']} ${styles['no-before']}`}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value || '' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estimated Unit Cost (₦)
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="number"
                                                value={newItem.estimatedCost}
                                                onChange={(e) => setNewItem({ ...newItem, estimatedCost: parseInt(e.target.value) || 0 })}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Quantity"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                        type="button"
                                        onClick={addItem}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold">Procurement Items ({items.length})</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                        {items.length > 0 ? (
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-3 px-4">Title</th>
                                                        <th className="text-left py-3 px-4">Description</th>
                                                        <th className="text-left py-3 px-4">Qty</th>
                                                        <th className="text-left py-3 px-4">Unit Cost</th>
                                                        <th className="text-left py-3 px-4">Total Cost</th>
                                                        <th className="text-left py-3 px-4">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((request: any) => (
                                                        <tr key={request.id} className="border-b hover:bg-gray-50">
                                                            <td className="py-3 px-4 font-mono text-sm">{request.title}</td>
                                                            <td className="py-3 px-4">{request.description}</td>
                                                            <td className="py-3 px-4">{request.quantity}</td>
                                                            <td className="py-3 px-4">
                                                             
                                                                    ₦{request.estimatedCost.toLocaleString()}

                                                            </td>
                                                            <td className="py-3 px-4">
                                                                
                                                                    ₦{(request.quantity * request.estimatedCost).toLocaleString()}
                                                              
                                                            </td>
                                                            <td className="py-3 px-4 font-semibold">  <button
                                                                onClick={() => removeItem(request.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                                             No procurement items added yet. Use the form above to add items.
                                            </MessageBar>
                                        )}
                                        </div>

                                        <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            
                                        </label>
                                        <div className="w-full mb-2">
  <div className="flex justify-end border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    <p className="px-3 py-2 ">
      ₦{estimatedTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
</div>
                                    </div>
                                    </div>
                                
                            </div>
                        </div>
        </>
    );
};

export default ProcurementItemsFluent8;
