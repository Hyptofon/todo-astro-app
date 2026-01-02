import React from 'react';
import { useTodos } from './useTodos';
import { TodoItem } from './TodoItem';
import { CreateTodo } from './CreateTodo';
import { Loader2 } from 'lucide-react';

export const TodoWidget = () => {
    const {
        todos,
        loading,
        error,
        isAdding,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    } = useTodos();

    if (loading && todos.length === 0) {
        return (
            <div className="flex justify-center items-center py-20 text-blue-600">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Мої задачі 🚀
                </h1>

                <CreateTodo onAdd={addTodo} isAdding={isAdding} />

                <div className="space-y-1">
                    {todos.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">
                            Схоже, ти вільний як птах! Додай задачу.
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onUpdate={updateTodoTitle}
                            />
                        ))
                    )}
                </div>

                <div className="mt-6 text-xs text-center text-gray-400">
                    Powered by Astro & React Islands
                </div>
            </div>
        </div>
    );
};