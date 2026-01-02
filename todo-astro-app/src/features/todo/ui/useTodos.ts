import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { Todo } from '../domain/todo.types';
import { TodoService } from '../api/todo.service';

export type FilterType = 'all' | 'active' | 'completed';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [isAdding, setIsAdding] = useState(false);

    // --- Завантаження ---
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await TodoService.getAll();
                setTodos(data.sort((a, b) => b.id - a.id));
            } catch (err) {
                toast.error('Помилка з\'єднання ', {
                    description: 'Не вдалося завантажити список задач.'
                });
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
        setTodos((prev) => [optimisticTodo, ...prev]);

        try {
            await TodoService.create({ title, completed: false, userId: 1 });
            toast.success('Нове завдання створено', {
                description: `"${title}" додано до списку.`
            });
        } catch (err) {
            setTodos((prev) => prev.filter(t => t.id !== tempId));
            toast.error('Не вдалося створити задачу');
        } finally {
            setIsAdding(false);
        }
    };

    // --- Видалення ---
    const deleteTodo = useCallback(async (id: number) => {
        const previousTodos = [...todos];
        const todoToDelete = previousTodos.find(t => t.id === id);

        setTodos((prev) => prev.filter((t) => t.id !== id));

        try {
            await TodoService.delete(id);
            toast.info('Завдання видалено', {
                description: todoToDelete ? `"${todoToDelete.title}" було стерто.` : undefined
            });
        } catch (err) {
            setTodos(previousTodos);
            toast.error('Помилка видалення');
        }
    }, [todos]);

    const toggleTodo = useCallback(async (id: number, completed: boolean) => {
        const previousTodos = [...todos];

        setTodos((prev) =>
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
                toast.message('Статус змінено', {
                    description: 'Завдання повернуто в роботу.',
                    duration: 2000,
                });
            }

        } catch (err) {
            setTodos(previousTodos);
            toast.error('Не вдалося оновити статус ');
        }
    }, [todos]);

    // --- Редагування назви ---
    const updateTodoTitle = useCallback(async (id: number, title: string) => {
        const previousTodos = [...todos];
        setTodos((prev) => prev.map((t) => t.id === id ? { ...t, title } : t));

        try {
            await TodoService.update(id, { title });
            toast.success('Текст оновлено');
        } catch (err) {
            setTodos(previousTodos);
            toast.error('Помилка редагування');
        }
    }, [todos]);

    // --- Фільтрація ---
    const filteredTodos = useMemo(() => {
        return todos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });
    }, [todos, filter]);

    return {
        todos: filteredTodos,
        stats: {
            total: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length
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