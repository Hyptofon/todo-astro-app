import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Todo } from '@/features/todo/domain/todo.types';
import { TodoService } from '@/features/todo/api/todo.service';

export const useTodoOperations = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await TodoService.getAll();
                setTodos(response.sort((a, b) => b.id - a.id));
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

        setTodos((prev) => [optimisticTodo, ...prev]);

        try {
            await TodoService.create({ title, completed: false, userId: 1 });
            toast.success('Завдання створено', { description: `"${title}" додано до списку.` });
        } catch (err) {
            setTodos((prev) => prev.filter(t => t.id !== tempId));
            toast.error('Не вдалося створити задачу');
        } finally {
            setIsAdding(false);
        }
    };

    const deleteTodo = useCallback(async (id: number) => {
        const previousTodos = [...todos];
        setTodos((prev) => prev.filter((t) => t.id !== id));

        try {
            await TodoService.delete(id);
            toast.info('Завдання видалено');
        } catch (err) {
            setTodos(previousTodos);
            toast.error('Помилка видалення');
        }
    }, [todos]);

    const toggleTodo = useCallback(async (id: number, completed: boolean) => {
        const previousTodos = [...todos];
        setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed } : t));

        try {
            await TodoService.update(id, { completed });
            const message = completed ? 'Завдання виконано!' : 'Статус оновлено';
            const desc = completed ? 'Чудова робота, так тримати!' : 'Завдання повернуто в роботу.';
            toast[completed ? 'success' : 'message'](message, { description: desc });
        } catch (err) {
            setTodos(previousTodos);
            toast.error('Помилка оновлення статусу');
        }
    }, [todos]);

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

    return { todos, loading, isAdding, addTodo, deleteTodo, toggleTodo, updateTodoTitle };
};