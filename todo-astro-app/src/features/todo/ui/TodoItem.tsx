import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { Todo } from '../domain/todo.types';
import { cn } from '@/shared/lib/utils';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, newTitle: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
                                                      todo,
                                                      onToggle,
                                                      onDelete,
                                                      onUpdate
                                                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo.title);

    const handleSave = () => {
        if (editValue.trim()) {
            onUpdate(todo.id, editValue);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditValue(todo.title);
        setIsEditing(false);
    };

    return (
        <div className={cn(
            "flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md",
            todo.completed && "bg-gray-50 opacity-75"
        )}>
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => onToggle(todo.id, e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />

                {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                            autoFocus
                        />
                    </div>
                ) : (
                    <span className={cn(
                        "text-gray-800 font-medium flex-1",
                        todo.completed && "line-through text-gray-400"
                    )}>
            {todo.title}
          </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                            <Check size={18} />
                        </button>
                        <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};