import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface CreateTodoProps {
    onAdd: (title: string) => void;
    isAdding: boolean;
}

export const CreateTodo: React.FC<CreateTodoProps> = ({ onAdd, isAdding }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        onAdd(value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Що плануєш зробити?"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isAdding}
                    className="w-full pl-4 pr-14 py-3 bg-white rounded-lg shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-50"
                />
                <button
                    type="submit"
                    disabled={!value.trim() || isAdding}
                    className={cn(
                        "absolute right-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        isAdding && "animate-pulse"
                    )}
                >
                    <PlusCircle size={24} />
                </button>
            </div>
        </form>
    );
};