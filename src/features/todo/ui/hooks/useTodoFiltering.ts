import { useState, useMemo } from 'react';
import type { Todo } from '@/features/todo/domain/todo.types';

export type FilterType = 'all' | 'active' | 'completed';

export const useTodoFiltering = (todos: Todo[]) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTodos = useMemo(() => {
        return todos.filter(todo => {
            const statusMatch =
                filter === 'all' ? true :
                    filter === 'active' ? !todo.completed :
                        filter === 'completed' ? todo.completed : true;

            const searchMatch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [todos, filter, searchQuery]);

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length,
        filteredTotal: filteredTodos.length
    };

    return {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredTodos,
        stats
    };
};