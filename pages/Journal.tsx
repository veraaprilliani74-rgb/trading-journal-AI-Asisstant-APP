import React, { useState, useMemo, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Trade, Tag } from '../types';
import { XIcon, ChevronDownIcon } from '../components/Icons';

const PREDEFINED_COLORS = [
    { bg: 'bg-blue-500/20', text: 'text-blue-300' },
    { bg: 'bg-green-500/20', text: 'text-green-300' },
    { bg: 'bg-yellow-500/20', text: 'text-yellow-300' },
    { bg: 'bg-purple-500/20', text: 'text-purple-300' },
    { bg: 'bg-pink-500/20', text: 'text-pink-300' },
    { bg: 'bg-indigo-500/20', text: 'text-indigo-300' },
    { bg: 'bg-red-500/20', text: 'text-red-300' },
    { bg: 'bg-gray-500/20', text: 'text-gray-300' },
];

const getTagColor = (tagName: string, allTags: Tag[]): { bg: string, text: string } => {
    const tag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    return tag ? tag.color : PREDEFINED_COLORS[5];
};

const TradeCard: React.FC<{ 
    trade: Trade; 
    onEditNotes: (trade: Trade) => void;
    onEditTags: (trade: Trade) => void; 
    allTags: Tag[];
    isExpanded: boolean;
    onToggleExpand: () => void;
}> = ({ trade, onEditNotes, onEditTags, allTags, isExpanded, onToggleExpand }) => {
    const isWin = trade.pnl ? trade.pnl >= 0 : undefined;
    const isBuy = trade.type === 'BUY';

    return (
        <div className="bg-gray-800 rounded-lg animate-fade-in">
            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={onToggleExpand}>
                <div>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trade.type}
                    </span>
                    <span className="ml-2 font-bold">{trade.pair}</span>
                </div>
                <div className="flex items-center space-x-4">
                     {trade.pnl !== undefined ? (
                        <p className={`font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                            {isWin ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                    ) : (
                         <span className={`px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400`}>
                            {trade.status}
                        </span>
                    )}
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <p className="text-gray-400">Date:</p>
                            <p>{trade.date}</p>
                        </div>
                         <div>
                            <p className="text-gray-400">Status:</p>
                            <p className={`capitalize font-semibold ${trade.status === 'closed' ? 'text-gray-300' : 'text-blue-400'}`}>{trade.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Entry Price:</p>
                            <p className="font-mono">{trade.entryPrice.toFixed(4)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Exit Price:</p>
                            <p className="font-mono">{trade.exitPrice?.toFixed(4) || '---'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Quantity:</p>
                            <p>{trade.quantity}</p>
                        </div>
                    </div>
                    
                    {trade.notes && trade.notes.trim() !== '' ? (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-gray-400">Notes:</p>
                            <button onClick={() => onEditNotes(trade)} className="text-xs text-blue-400 hover:underline">Edit</button>
                            </div>
                            <p className="text-sm bg-gray-700/50 p-2 rounded whitespace-pre-wrap">{trade.notes}</p>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => onEditNotes(trade)} className="w-full text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors">
                                Add Notes
                            </button>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-gray-400">Tags:</p>
                            <button onClick={() => onEditTags(trade)} className="text-xs text-blue-400 hover:underline">Edit Tags</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {trade.tags.length > 0 ? trade.tags.map(tag => {
                                const color = getTagColor(tag, allTags);
                                return <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${color.bg} ${color.text}`}>{tag}</span>
                            }) : <p className="text-xs text-gray-500">No tags yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddTradeModal: React.FC<{ onClose: () => void; onAddTrade: (trade: Omit<Trade, 'id' | 'pnl' | 'tags'>, tags: string[]) => void; }> = ({ onClose, onAddTrade }) => {
    const [formData, setFormData] = useState({
        type: 'BUY' as 'BUY' | 'SELL',
        pair: '',
        entryPrice: '',
        exitPrice: '',
        quantity: '1',
        status: 'closed' as 'open' | 'closed',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        tags: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.pair.trim()) newErrors.pair = 'Pair is required.';
        if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) newErrors.entryPrice = 'Valid entry price is required.';
        if (formData.exitPrice && parseFloat(formData.exitPrice) <= 0) newErrors.exitPrice = 'Exit price must be a valid number.';
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newTradeData: Omit<Trade, 'id' | 'pnl' | 'tags'> = {
            type: formData.type,
            pair: formData.pair.toUpperCase(),
            status: formData.status,
            entryPrice: parseFloat(formData.entryPrice),
            exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
            quantity: parseFloat(formData.quantity),
            date: formData.date,
            notes: formData.notes,
        };
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        onAddTrade(newTradeData, tags);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg animate-slide-up">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Add New Trade</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="BUY">BUY</option>
                                <option value="SELL">SELL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Pair</label>
                            <input type="text" name="pair" value={formData.pair} onChange={handleChange} placeholder="e.g., EUR/USD" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.pair ? 'border-red-500' : 'border-gray-600'}`} />
                            {errors.pair && <p className="text-red-500 text-xs mt-1">{errors.pair}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Entry Price</label>
                            <input type="number" name="entryPrice" value={formData.entryPrice} onChange={handleChange} step="any" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.entryPrice ? 'border-red-500' : 'border-gray-600'}`} />
                            {errors.entryPrice && <p className="text-red-500 text-xs mt-1">{errors.entryPrice}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Exit Price</label>
                            <input type="number" name="exitPrice" value={formData.exitPrice} onChange={handleChange} step="any" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.exitPrice ? 'border-red-500' : 'border-gray-600'}`} />
                             {errors.exitPrice && <p className="text-red-500 text-xs mt-1">{errors.exitPrice}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} step="any" className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.quantity ? 'border-red-500' : 'border-gray-600'}`} />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Trade rationale, execution details..." className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., Scalping, News" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Save Trade</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const EditNotesModal: React.FC<{ trade: Trade; onClose: () => void; onSave: (tradeId: string, notes: string) => void; }> = ({ trade, onClose, onSave }) => {
    const [currentNotes, setCurrentNotes] = useState(trade.notes || '');
    const handleSave = () => { onSave(trade.id, currentNotes); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg animate-slide-up">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Edit Notes for {trade.pair}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4">
                    <textarea value={currentNotes} onChange={(e) => setCurrentNotes(e.target.value)} rows={4} placeholder="Add your trade rationale..." className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                </div>
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Save Notes</button>
                </div>
            </div>
        </div>
    );
};

const EditTradeTagsModal: React.FC<{
    trade: Trade;
    allTags: Tag[];
    onClose: () => void;
    onSave: (tradeId: string, newTags: string[]) => void;
    onAddNewTag: (tagName: string) => void;
}> = ({ trade, allTags, onClose, onSave, onAddNewTag }) => {
    const [currentTags, setCurrentTags] = useState<string[]>(trade.tags);
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = (tagName: string) => {
        const formattedTag = tagName.trim();
        if (formattedTag && !currentTags.some(t => t.toLowerCase() === formattedTag.toLowerCase())) {
            setCurrentTags([...currentTags, formattedTag]);
            if (!allTags.some(t => t.name.toLowerCase() === formattedTag.toLowerCase())) {
                onAddNewTag(formattedTag);
            }
        }
        setInputValue('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setCurrentTags(currentTags.filter(t => t !== tagToRemove));
    };

    const handleSave = () => { onSave(trade.id, currentTags); };

    const suggestions = useMemo(() => {
        if (!inputValue) return [];
        return allTags.filter(t => t.name.toLowerCase().includes(inputValue.toLowerCase()) && !currentTags.some(ct => ct.toLowerCase() === t.name.toLowerCase()));
    }, [inputValue, allTags, currentTags]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg animate-slide-up">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Edit Tags for {trade.pair}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Add or Create Tags</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(inputValue)}
                                placeholder="Type a tag and press Enter"
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {suggestions.length > 0 && (
                                <div className="absolute z-10 w-full bg-gray-600 rounded-md mt-1 shadow-lg">
                                    {suggestions.slice(0, 5).map(tag => (
                                        <div key={tag.name} onClick={() => handleAddTag(tag.name)} className="px-3 py-2 hover:bg-gray-500 cursor-pointer">{tag.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Current Tags:</p>
                        <div className="flex flex-wrap gap-2">
                            {currentTags.length > 0 ? currentTags.map(tag => {
                                const color = getTagColor(tag, allTags);
                                return (
                                    <span key={tag} className={`flex items-center px-2 py-1 text-sm font-semibold rounded-full ${color.bg} ${color.text}`}>
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="ml-1.5"><XIcon className="w-3 h-3" /></button>
                                    </span>
                                );
                            }) : <p className="text-sm text-gray-500">No tags applied.</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Save Tags</button>
                </div>
            </div>
        </div>
    );
};

const TagManagerModal: React.FC<{
    allTags: Tag[];
    onClose: () => void;
    onUpdateTagColor: (tagName: string, newColor: { bg: string, text: string }) => void;
    onDeleteTag: (tagName: string) => void;
    onAddNewTag: (tagName: string) => void;
}> = ({ allTags, onClose, onUpdateTagColor, onDeleteTag, onAddNewTag }) => {
    const [newTagName, setNewTagName] = useState('');

    const handleAddTag = () => {
        if (newTagName.trim() && !allTags.some(t => t.name.toLowerCase() === newTagName.trim().toLowerCase())) {
            onAddNewTag(newTagName.trim());
            setNewTagName('');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg animate-slide-up h-[80vh]">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Tag Library</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-3">
                    <div className="flex space-x-2">
                        <input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} placeholder="Create new tag..." className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button onClick={handleAddTag} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Add</button>
                    </div>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-3">
                    {allTags.map(tag => (
                        <div key={tag.name} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg">
                            <span className={`px-2 py-1 text-sm font-semibold rounded-full ${tag.color.bg} ${tag.color.text}`}>{tag.name}</span>
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    {PREDEFINED_COLORS.map(color => (
                                        <button key={color.bg} onClick={() => onUpdateTagColor(tag.name, color)} className={`w-5 h-5 rounded-full ${color.bg.replace('/20', '')} ${tag.color.bg === color.bg ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}></button>
                                    ))}
                                </div>
                                <button onClick={() => onDeleteTag(tag.name)} className="text-red-400 hover:text-red-300 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="p-4 border-t border-gray-700 text-right">
                     <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Done</button>
                 </div>
            </div>
        </div>
    );
};

interface FilterState {
  status: 'all' | 'open' | 'closed';
  type: 'all' | 'BUY' | 'SELL';
  startDate: string;
  endDate: string;
}

const FilterModal: React.FC<{
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onClear: () => void;
    currentFilters: FilterState;
}> = ({ onClose, onApply, onClear, currentFilters }) => {
    const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

    const handleApply = () => {
        onApply(localFilters);
    };
    
    const handleClear = () => {
        onClear();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({...prev, [name]: value}));
    };
    
    const setStatus = (status: FilterState['status']) => {
        setLocalFilters(prev => ({...prev, status}));
    };
    
    const setType = (type: FilterState['type']) => {
        setLocalFilters(prev => ({...prev, type}));
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md flex flex-col shadow-lg animate-slide-up">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold">Filter Trades</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="p-4 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setStatus('all')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.status === 'all' ? 'bg-gray-600' : ''}`}>All</button>
                            <button onClick={() => setStatus('open')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.status === 'open' ? 'bg-gray-600' : ''}`}>Open</button>
                            <button onClick={() => setStatus('closed')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.status === 'closed' ? 'bg-gray-600' : ''}`}>Closed</button>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setType('all')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.type === 'all' ? 'bg-gray-600' : ''}`}>All</button>
                            <button onClick={() => setType('BUY')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.type === 'BUY' ? 'bg-gray-600' : ''}`}>Buy</button>
                            <button onClick={() => setType('SELL')} className={`w-1/3 py-1.5 text-sm rounded-md ${localFilters.type === 'SELL' ? 'bg-gray-600' : ''}`}>Sell</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" name="startDate" value={localFilters.startDate} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <input type="date" name="endDate" value={localFilters.endDate} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 border-t border-gray-700">
                     <button type="button" onClick={handleClear} className="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 font-semibold">Clear Filters</button>
                    <div className="space-x-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                        <button type="button" onClick={handleApply} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SortIcon: React.FC<{ order: 'asc' | 'desc', className?: string }> = ({ order, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {order === 'asc' ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
    </svg>
);

type SortKey = 'date' | 'pnl' | 'pair';

const Journal: React.FC = () => {
    const { trades, setTrades } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [editingNotesTrade, setEditingNotesTrade] = useState<Trade | null>(null);
    const [editingTagsTrade, setEditingTagsTrade] = useState<Trade | null>(null);
    const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const initialFilters: FilterState = {
        status: 'all',
        type: 'all',
        startDate: '',
        endDate: '',
    };
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: 'asc' | 'desc' }>({ key: 'date', order: 'desc' });

    const [allTags, setAllTags] = useState<Tag[]>(() => {
        const uniqueTags = new Set<string>();
        trades.forEach(trade => trade.tags.forEach(tag => uniqueTags.add(tag)));
        return Array.from(uniqueTags).map((tag, index) => ({
            name: tag,
            color: PREDEFINED_COLORS[index % PREDEFINED_COLORS.length],
        }));
    });
    
    const winningTrades = trades.filter(t => t.status === 'closed' && t.pnl && t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.status === 'closed' && t.pnl && t.pnl < 0).length;

    const processedTrades = useMemo(() => {
      const lowercasedQuery = searchQuery.toLowerCase();

      let filtered = trades
        .filter(trade => {
          // Search filter
          if (lowercasedQuery) {
              const inPair = trade.pair.toLowerCase().includes(lowercasedQuery);
              const inNotes = trade.notes?.toLowerCase().includes(lowercasedQuery) ?? false;
              const inTags = trade.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery));
              if (!inPair && !inNotes && !inTags) {
                  return false;
              }
          }

          // Modal filters
          if (filters.status !== 'all' && trade.status !== filters.status) return false;
          if (filters.type !== 'all' && trade.type !== filters.type) return false;
          if (filters.startDate || filters.endDate) {
            const tradeDate = new Date(trade.date);
            tradeDate.setUTCHours(0,0,0,0);
             if (filters.startDate && tradeDate < new Date(filters.startDate)) return false;
             if (filters.endDate && tradeDate > new Date(filters.endDate)) return false;
          }
          return true;
        });

      return filtered.sort((a, b) => {
        const orderMultiplier = sortConfig.order === 'asc' ? 1 : -1;
        switch(sortConfig.key) {
            case 'date':
                return (new Date(b.date).getTime() - new Date(a.date).getTime()) * orderMultiplier;
            case 'pnl': {
                // Treat open trades as having the lowest P&L for sorting purposes
                const pnlA = a.pnl ?? -Infinity;
                const pnlB = b.pnl ?? -Infinity;
                if (pnlA === pnlB) return 0;
                return (pnlA > pnlB ? 1 : -1) * orderMultiplier;
            }
            case 'pair':
                return a.pair.localeCompare(b.pair) * orderMultiplier;
            default:
                return 0;
        }
      });
    }, [trades, filters, sortConfig, searchQuery]);
    
    const isFiltersActive = useMemo(() => {
        return filters.status !== 'all' || filters.type !== 'all' || filters.startDate !== '' || filters.endDate !== '';
    }, [filters]);
    
    const handleApplyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
        setIsFilterModalOpen(false);
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setIsFilterModalOpen(false);
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key) {
                return { key, order: prevConfig.order === 'asc' ? 'desc' : 'asc' };
            }
            // Default to descending for new sort keys
            return { key, order: 'desc' };
        });
    };

    const handleAddNewTag = (tagName: string) => {
        if (!allTags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
            const newTag: Tag = {
                name: tagName,
                color: PREDEFINED_COLORS[allTags.length % PREDEFINED_COLORS.length]
            };
            setAllTags(prev => [...prev, newTag]);
        }
    };

    const handleAddTrade = (newTradeData: Omit<Trade, 'id' | 'pnl' | 'tags'>, tags: string[]) => {
        let pnl;
        if (newTradeData.exitPrice !== undefined && newTradeData.status === 'closed') {
            const priceDiff = newTradeData.type === 'BUY' ? newTradeData.exitPrice - newTradeData.entryPrice : newTradeData.entryPrice - newTradeData.exitPrice;
            pnl = priceDiff * newTradeData.quantity * 10000;
        }

        const newTrade: Trade = {
            ...newTradeData,
            id: Date.now().toString(),
            pnl,
            tags,
        };

        setTrades(prevTrades => [newTrade, ...prevTrades]);
        tags.forEach(handleAddNewTag);
    };

    const handleSaveNote = (tradeId: string, newNotes: string) => {
        setTrades(prev => prev.map(t => t.id === tradeId ? { ...t, notes: newNotes.trim() } : t));
        setEditingNotesTrade(null);
    };

    const handleSaveTradeTags = (tradeId: string, newTags: string[]) => {
        setTrades(prev => prev.map(t => t.id === tradeId ? { ...t, tags: newTags } : t));
        setEditingTagsTrade(null);
    };

    const handleUpdateTagColor = (tagName: string, newColor: { bg: string, text: string }) => {
        setAllTags(prev => prev.map(t => t.name === tagName ? { ...t, color: newColor } : t));
    };

    const handleDeleteTag = (tagToDelete: string) => {
        if (window.confirm(`Are you sure you want to delete the "${tagToDelete}" tag? It will be removed from all trades.`)) {
            setAllTags(prev => prev.filter(t => t.name !== tagToDelete));
            setTrades(prev => prev.map(trade => ({
                ...trade,
                tags: trade.tags.filter(t => t !== tagToDelete)
            })));
        }
    };

    const handleExportCSV = () => {
        const headers = ['id', 'type', 'pair', 'status', 'entryPrice', 'exitPrice', 'quantity', 'pnl', 'date', 'notes', 'tags'];
        const csvRows = [headers.join(',')];

        trades.forEach(trade => {
            const row = [
                trade.id,
                trade.type,
                trade.pair,
                trade.status,
                trade.entryPrice,
                trade.exitPrice ?? '',
                trade.quantity,
                trade.pnl ?? '',
                trade.date,
                `"${trade.notes?.replace(/"/g, '""') ?? ''}"`,
                `"${trade.tags.join('|')}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'alphalytic_trades_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const parseCSV = (csvText: string): string[][] => {
                const rows: string[][] = [];
                const lines = csvText.split('\n');
                lines.forEach(line => {
                    if (!line.trim()) return;
                    const columns: string[] = [];
                    let currentColumn = '';
                    let inQuotes = false;
                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') {
                            if (inQuotes && line[i + 1] === '"') {
                                currentColumn += '"';
                                i++;
                            } else {
                                inQuotes = !inQuotes;
                            }
                        } else if (char === ',' && !inQuotes) {
                            columns.push(currentColumn);
                            currentColumn = '';
                        } else {
                            currentColumn += char;
                        }
                    }
                    columns.push(currentColumn);
                    rows.push(columns);
                });
                return rows;
            };

            const parsedRows = parseCSV(text);
            const newTrades: Trade[] = [];
            const newTags = new Set<string>();

            for (let i = 1; i < parsedRows.length; i++) { // Skip header row
                const columns = parsedRows[i];
                if (columns.length < 11) continue;

                try {
                    const trade: Trade = {
                        id: `imported-${Date.now()}-${i}`,
                        type: columns[1] as 'BUY' | 'SELL',
                        pair: columns[2],
                        status: columns[3] as 'open' | 'closed',
                        entryPrice: parseFloat(columns[4]),
                        exitPrice: columns[5] ? parseFloat(columns[5]) : undefined,
                        quantity: parseFloat(columns[6]),
                        pnl: columns[7] ? parseFloat(columns[7]) : undefined,
                        date: columns[8],
                        notes: columns[9],
                        tags: columns[10]?.split('|').filter(Boolean) ?? []
                    };
                    newTrades.push(trade);
                    trade.tags.forEach(tag => newTags.add(tag));
                } catch (error) {
                    console.error(`Error parsing row ${i + 1}:`, parsedRows[i], error);
                }
            }
            
            setTrades(prev => [...newTrades, ...prev]);
            newTags.forEach(handleAddNewTag);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        reader.readAsText(file);
    };
    
    const handleToggleExpand = (tradeId: string) => {
        setExpandedTradeId(prevId => prevId === tradeId ? null : tradeId);
    };

  return (
    <>
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Trading Journal</h1>
        <p className="text-sm text-gray-400">Track your trading performance</p>
      </div>

      <div className="flex justify-end space-x-2 flex-wrap gap-2">
        <button onClick={handleImportClick} className="bg-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-600 transition-colors">Import CSV</button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
        />
        <button onClick={handleExportCSV} className="bg-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-600 transition-colors">Export</button>
        <button onClick={() => setIsTagManagerOpen(true)} className="bg-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-600 transition-colors">Manage Tags</button>
         <button onClick={() => setIsFilterModalOpen(true)} className="relative bg-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-600 transition-colors">
            Filters
            {isFiltersActive && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-gray-900"></span>}
         </button>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 px-3 py-1.5 text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors">Add Entry</button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search trades by pair, notes, or tags..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-400">{winningTrades}</p>
            <p className="text-sm text-gray-400">Winning Trades</p>
        </div>
         <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-red-400">{losingTrades}</p>
            <p className="text-sm text-gray-400">Losing Trades</p>
        </div>
      </div>
      
       <div className="flex justify-between items-center border-b border-gray-700 pb-2 text-sm text-gray-400">
          <span>Showing {processedTrades.length} of {trades.length} trades</span>
           <div className="flex items-center space-x-2 text-xs">
            <span>Sort by:</span>
            {(['date', 'pnl', 'pair'] as SortKey[]).map(key => (
              <button key={key} onClick={() => handleSort(key)} className={`px-2 py-1 rounded-md flex items-center space-x-1 ${sortConfig.key === key ? 'bg-gray-700 text-white' : 'hover:bg-gray-700/50'}`}>
                <span className="capitalize">{key}</span>
                {sortConfig.key === key && <SortIcon order={sortConfig.order} />}
              </button>
            ))}
          </div>
       </div>

      <div className="space-y-4">
        {processedTrades.length > 0 ? (
            processedTrades.map(trade => 
                <TradeCard 
                    key={trade.id} 
                    trade={trade} 
                    onEditNotes={setEditingNotesTrade} 
                    onEditTags={setEditingTagsTrade} 
                    allTags={allTags}
                    isExpanded={expandedTradeId === trade.id}
                    onToggleExpand={() => handleToggleExpand(trade.id)}
                />)
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500">{trades.length > 0 ? "No trades match your search or filters." : "Your journal is empty. Add your first trade!"}</p>
                {isFiltersActive && <button onClick={handleClearFilters} className="mt-2 text-green-400 font-semibold text-sm">Clear Filters</button>}
            </div>
        )}
      </div>
    </div>
    {isAddModalOpen && <AddTradeModal onClose={() => setIsAddModalOpen(false)} onAddTrade={handleAddTrade} />}
    {editingNotesTrade && <EditNotesModal trade={editingNotesTrade} onClose={() => setEditingNotesTrade(null)} onSave={handleSaveNote} />}
    {editingTagsTrade && <EditTradeTagsModal trade={editingTagsTrade} allTags={allTags} onClose={() => setEditingTagsTrade(null)} onSave={handleSaveTradeTags} onAddNewTag={handleAddNewTag} />}
    {isTagManagerOpen && <TagManagerModal allTags={allTags} onClose={() => setIsTagManagerOpen(false)} onUpdateTagColor={handleUpdateTagColor} onDeleteTag={handleDeleteTag} onAddNewTag={handleAddNewTag} />}
    {isFilterModalOpen && <FilterModal onClose={() => setIsFilterModalOpen(false)} onApply={handleApplyFilters} onClear={handleClearFilters} currentFilters={filters} />}
    </>
  );
};

export default Journal;