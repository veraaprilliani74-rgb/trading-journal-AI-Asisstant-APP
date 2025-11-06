
import React, { useState, useEffect, useRef } from 'react';
import { ChatIcon, XIcon } from '../components/Icons';
import AiAssistantModal from '../components/AiAssistantModal';
import AddWidgetModal from '../components/AddWidgetModal';
import { DashboardWidget } from '../types';

// Widget Components
import AccountSummaryWidget from '../components/widgets/AccountSummaryWidget';
import StatsWidget from '../components/widgets/StatsWidget';
import MarketWatchWidget from '../components/widgets/MarketWatchWidget';
import OpenPositionsWidget from '../components/widgets/OpenPositionsWidget';
import AiInsightsWidget from '../components/widgets/AiInsightsWidget';

// --- Widget Configuration ---
const ALL_WIDGETS: DashboardWidget[] = [
    { id: 'accountSummary', name: 'Account Summary' },
    { id: 'stats', name: 'Stats' },
    { id: 'marketWatch', name: 'Market Watch' },
    { id: 'openPositions', name: 'Open Positions' },
    { id: 'aiInsights', name: 'AI Insights' },
];

const DEFAULT_LAYOUT: DashboardWidget[] = [
    { id: 'accountSummary', name: 'Account Summary' },
    { id: 'stats', name: 'Stats' },
    { id: 'marketWatch', name: 'Market Watch' },
];

const WIDGET_COMPONENTS: Record<DashboardWidget['id'], React.FC> = {
    accountSummary: AccountSummaryWidget,
    stats: StatsWidget,
    marketWatch: MarketWatchWidget,
    openPositions: OpenPositionsWidget,
    aiInsights: AiInsightsWidget,
};

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isCustomizeMode, setIsCustomizeMode] = useState(false);
    const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
    const [layout, setLayout] = useState<DashboardWidget[]>(() => {
        try {
            const savedLayout = localStorage.getItem('dashboardLayout');
            return savedLayout ? JSON.parse(savedLayout) : DEFAULT_LAYOUT;
        } catch (error) {
            console.error("Could not parse dashboard layout from localStorage", error);
            return DEFAULT_LAYOUT;
        }
    });

    const draggedItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('dashboardLayout', JSON.stringify(layout));
        } catch (error) {
            console.error("Could not save dashboard layout to localStorage", error);
        }
    }, [layout]);
    
    const availableWidgetsToAdd = ALL_WIDGETS.filter(
        w => !layout.some(lw => lw.id === w.id)
    );

    const addWidget = (widget: DashboardWidget) => {
        setLayout(prev => [...prev, widget]);
        setIsAddWidgetModalOpen(false);
    };

    const removeWidget = (widgetId: string) => {
        setLayout(prev => prev.filter(w => w.id !== widgetId));
    };

    const handleDragSort = () => {
        if (draggedItem.current === null || dragOverItem.current === null) return;
        const layoutClone = [...layout];
        const draggedItemContent = layoutClone.splice(draggedItem.current, 1)[0];
        layoutClone.splice(dragOverItem.current, 0, draggedItemContent);
        draggedItem.current = null;
        dragOverItem.current = null;
        setLayout(layoutClone);
    };

    return (
        <>
            <div className="p-4 space-y-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsCustomizeMode(!isCustomizeMode)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isCustomizeMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}
                    >
                        {isCustomizeMode ? 'Done' : 'Customize'}
                    </button>
                </div>
                
                <div className="space-y-6">
                    {layout.map((widget, index) => {
                        const WidgetComponent = WIDGET_COMPONENTS[widget.id];
                        return (
                            <div
                                key={widget.id}
                                draggable={isCustomizeMode}
                                onDragStart={() => draggedItem.current = index}
                                onDragEnter={() => dragOverItem.current = index}
                                onDragEnd={handleDragSort}
                                onDragOver={(e) => e.preventDefault()}
                                className={`
                                    relative transition-all duration-300
                                    ${isCustomizeMode ? 'p-2 border-2 border-dashed border-gray-600 rounded-2xl cursor-grab bg-gray-800/50' : ''}
                                `}
                            >
                                {isCustomizeMode && (
                                    <div className="absolute top-0 right-0 -mt-3 -mr-3 z-10">
                                        <button
                                            onClick={() => removeWidget(widget.id)}
                                            className="bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                                            aria-label={`Remove ${widget.name} widget`}
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <WidgetComponent />
                            </div>
                        );
                    })}
                </div>

                {isCustomizeMode && (
                    <button
                        onClick={() => setIsAddWidgetModalOpen(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:border-green-500 hover:text-green-400 transition-colors font-semibold"
                    >
                        + Add Widget
                    </button>
                )}
            </div>

            <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="fixed bottom-20 right-4 max-w-md mx-auto bg-green-600 p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 z-10"
                style={{ right: 'calc(50% - 224px + 16px)' }}
                aria-label="Open AI Assistant"
            >
                <ChatIcon className="w-6 h-6 text-white" />
            </button>

            {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
            {isAddWidgetModalOpen && (
                <AddWidgetModal 
                    onClose={() => setIsAddWidgetModalOpen(false)}
                    onAddWidget={addWidget}
                    availableWidgets={availableWidgetsToAdd}
                />
            )}
        </>
    );
};

export default Dashboard;
