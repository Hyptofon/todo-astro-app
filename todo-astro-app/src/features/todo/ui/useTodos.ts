import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { Todo } from '../domain/todo.types';
import { TodoService } from '../api/todo.service';

export type FilterType = 'all' | 'active' | 'completed';

export const useTodos = () => {
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await TodoService.getAll();
                setAllTodos(response.sort((a, b) => b.id - a.id));
            } catch (err) {
                toast.error('Помилка з\'єднання', { description: 'Не вдалося завантажити список.' });
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);

    const addTodo = async (title: string) => {
        setIsAdding(true);
        const tempId = Date.now();
        const optimisticTodo: Todo = { id: tempId, title, completed: false, userId: 1 };
        setAllTodos((prev) => [optimisticTodo, ...prev]);
        setSearchQuery('');
        setFilter('all');
        setCurrentPage(1);

        try {
            await TodoService.create({ title, completed: false, userId: 1 });
            toast.success('Завдання створено ', {
                description: `"${title}" додано до списку.`
            });
        } catch (err) {
            setAllTodos((prev) => prev.filter(t => t.id !== tempId));
            toast.error('Не вдалося створити задачу');
        } finally {
            setIsAdding(false);
        }
    };

    const deleteTodo = useCallback(async (id: number) => {
        const previousTodos = [...allTodos];
        setAllTodos((prev) => prev.filter((t) => t.id !== id));

        try {
            await TodoService.delete(id);
            toast.info('Завдання видалено ');
        } catch (err) {
            setAllTodos(previousTodos);
            toast.error('Помилка видалення');
        }
    }, [allTodos]);

    const toggleTodo = useCallback(async (id: number, completed: boolean) => {
        const previousTodos = [...allTodos];

        setAllTodos((prev) =>
            prev.map((t) => t.id === id ? { ...t, completed } : t)
        );

        try {
            await TodoService.update(id, { completed });

            if (completed) {
                toast.success('Завдання виконано!', {
                    description: 'Чудова робота, так тримати!',
                    duration: 3000,
                });
            } else {
                toast.message('Статус оновлено', {
                    description: 'Завдання повернуто в роботу.',
                    duration: 2000,
                });
            }

        } catch (err) {
            setAllTodos(previousTodos);
            toast.error('Помилка оновлення статусу');
        }
    }, [allTodos]);

    const updateTodoTitle = useCallback(async (id: number, title: string) => {
        const previousTodos = [...allTodos];
        setAllTodos((prev) => prev.map((t) => t.id === id ? { ...t, title } : t));

        try {
            await TodoService.update(id, { title });
            toast.success('Текст оновлено ');
        } catch (err) {
            setAllTodos(previousTodos);
            toast.error('Помилка редагування');
        }
    }, [allTodos]);

    // Фільтр та Паг

    const filteredTodos = useMemo(() => {
        return allTodos.filter(todo => {
            const statusMatch =
                filter === 'all' ? true :
                    filter === 'active' ? !todo.completed :
                        filter === 'completed' ? todo.completed : true;

            const searchMatch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [allTodos, filter, searchQuery]);

    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

    const paginatedTodos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTodos.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTodos, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, itemsPerPage]);

    return {
        todos: paginatedTodos,
        stats: {
            total: allTodos.length,
            active: allTodos.filter(t => !t.completed).length,
            completed: allTodos.filter(t => t.completed).length,
            filteredTotal: filteredTodos.length
        },
        pagination: {
            currentPage,
            totalPages,
            itemsPerPage,
            setPage: setCurrentPage,
            setLimit: setItemsPerPage
        },
        search: {
            query: searchQuery,
            setQuery: setSearchQuery
        },
        loading,
        isAdding,
        filter,
        setFilter,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    };
};