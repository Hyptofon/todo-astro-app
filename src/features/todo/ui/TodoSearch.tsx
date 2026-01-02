import React from 'react';
import { Search, X } from 'lucide-react';

interface TodoSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const TodoSearch: React.FC<TodoSearchProps> = ({ value, onChange }) => {
    return (
        <div className="relative mb-4 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={20} />
            </div>
            <input
                type="text"
                placeholder="Пошук завдань..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400 text-gray-700"
            />

            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};