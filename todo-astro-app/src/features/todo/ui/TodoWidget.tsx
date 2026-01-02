import React from 'react';
import { useTodos } from './useTodos';
import { TodoItem } from './TodoItem';
import { CreateTodo } from './CreateTodo';
import { TodoFilters } from './TodoFilters';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

export const TodoWidget = () => {
    const {
        todos,
        loading,
        isAdding,
        filter,
        setFilter,
        stats,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    } = useTodos();

    return (
        <>
            <Toaster position="top-center" richColors />

            <div className="max-w-xl mx-auto w-full">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 ring-1 ring-black/5">
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            Astro<span className="text-blue-600">Tasks</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm">Твій список справ на сьогодні</p>
                    </header>

                    <CreateTodo onAdd={addTodo} isAdding={isAdding} />

                    <TodoFilters current={filter} onChange={setFilter} stats={stats} />

                    {loading ? (
                        <div className="flex justify-center items-center py-12 text-blue-600">
                            <Loader2 className="animate-spin" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-2 min-h-[200px]">
                            {todos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    <p className="text-gray-400 font-medium">
                                        {filter === 'completed' ? 'Ще нічого не зроблено' : 'Список порожній'}
                                    </p>
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
                    )}
                </div>
            </div>
        </>
    );
};