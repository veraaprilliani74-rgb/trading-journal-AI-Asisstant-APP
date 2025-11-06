import React from 'react';
import { XIcon } from './Icons';
import { DashboardWidget } from '../types';

interface AddWidgetModalProps {
    onClose: () => void;
    onAddWidget: (widget: DashboardWidget) => void;
    availableWidgets: DashboardWidget[];
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ onClose, onAddWidget, availableWidgets }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Add Widget</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-3">
                    {availableWidgets.length > 0 ? (
                        availableWidgets.map(widget => (
                            <button
                                key={widget.id}
                                onClick={() => onAddWidget(widget)}
                                className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
                            >
                                + {widget.name}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">All available widgets have been added.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddWidgetModal;
