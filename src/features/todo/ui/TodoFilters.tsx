import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { FilterType } from './useTodos';

interface TodoFiltersProps {
    current: FilterType;
    onChange: (filter: FilterType) => void;
    stats: { total: number; active: number; completed: number };
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({ current, onChange, stats }) => {
    const buttons: { id: FilterType; label: string; count: number }[] = [
        { id: 'all', label: 'Всі', count: stats.total },
        { id: 'active', label: 'В процесі', count: stats.active },
        { id: 'completed', label: 'Готові', count: stats.completed },
    ];

    return (
        <div className="flex p-1 bg-gray-100/80 rounded-lg mb-6 gap-1">
            {buttons.map((btn) => (
                <button
                    key={btn.id}
                    onClick={() => onChange(btn.id)}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2",
                        current === btn.id
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    )}
                >
                    {btn.label}
                    <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        current === btn.id ? "bg-blue-50 text-blue-700" : "bg-gray-200 text-gray-600"
                    )}>
            {btn.count}
          </span>
                </button>
            ))}
        </div>
    );
};