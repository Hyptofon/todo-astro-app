import React from 'react';
import { useTodos } from './useTodos';
import { TodoItem } from './TodoItem';
import { CreateTodo } from './CreateTodo';
import { TodoFilters } from './TodoFilters';
import { TodoSearch } from './TodoSearch';
import { TodoPagination } from './TodoPagination';
import { ThemePalette } from './ThemePalette';
import { Loader2, Inbox } from 'lucide-react';
import { Toaster } from 'sonner';

export const TodoWidget = () => {
    const {
        todos,
        loading,
        isAdding,
        filter,
        setFilter,
        stats,
        pagination,
        search,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    } = useTodos();

    return (
        <>
            <Toaster position="top-center" richColors />

            <div className="max-w-xl mx-auto w-full">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 ring-1 ring-black/5 flex flex-col min-h-[600px]">
                    <header className="mb-6 flex items-center justify-between relative">
                        <div className="w-10" />
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center flex-1">
                            Astro<span className="text-blue-600">Tasks</span>
                        </h1>
                        <div className="w-10 flex justify-end">
                            <ThemePalette />
                        </div>
                    </header>
                    <div className="space-y-4 mb-6">
                        <CreateTodo onAdd={addTodo} isAdding={isAdding} />
                        <TodoSearch value={search.query} onChange={search.setQuery} />
                        <TodoFilters current={filter} onChange={setFilter} stats={stats} />
                    </div>
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-40 text-blue-600">
                                <Loader2 className="animate-spin" size={32} />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {todos.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-gray-100 rounded-xl text-gray-400">
                                        <Inbox size={40} className="mb-2 opacity-50" />
                                        <p className="font-medium">
                                            {search.query
                                                ? 'Нічого не знайдено за запитом'
                                                : 'Задач немає на цій сторінці'}
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
                    {!loading && (
                        <TodoPagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            itemsPerPage={pagination.itemsPerPage}
                            onPageChange={pagination.setPage}
                            onLimitChange={pagination.setLimit}
                        />
                    )}

                </div>
            </div>
        </>
    );
};