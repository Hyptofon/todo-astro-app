import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../domain/todo.types';
import { TodoService } from '../api/todo.service';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Завантаження початкових даних
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await TodoService.getAll();
                setTodos(data);
            } catch (err) {
                setError('Не вдалося завантажити завдання');
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    // Додавання
    const addTodo = async (title: string) => {
        setIsAdding(true);
        const tempId = Date.now();
        const optimisticTodo: Todo = { id: tempId, title, completed: false, userId: 1 };
        setTodos((prev) => [optimisticTodo, ...prev]);

        try {
            const newTodo = await TodoService.create({ title, completed: false, userId: 1 });
            setTodos((prev) => prev.map(t => t.id === tempId ? { ...newTodo, id: tempId } : t));
        } catch (err) {
            setTodos((prev) => prev.filter(t => t.id !== tempId));
            alert('Помилка при створенні');
        } finally {
            setIsAdding(false);
        }
    };

    // Видалення
    const deleteTodo = useCallback(async (id: number) => {
        const previousTodos = [...todos];
        setTodos((prev) => prev.filter((t) => t.id !== id));

        try {
            await TodoService.delete(id);
        } catch (err) {
            setTodos(previousTodos); // Відкат
            alert('Не вдалося видалити');
        }
    }, [todos]);

    // Перемикання статусу
    const toggleTodo = useCallback(async (id: number, completed: boolean) => {
        const previousTodos = [...todos];

        setTodos((prev) =>
            prev.map((t) => t.id === id ? { ...t, completed } : t)
        );

        try {
            await TodoService.update(id, { completed });
        } catch (err) {
            setTodos(previousTodos);
        }
    }, [todos]);

    // Редагування назви
    const updateTodoTitle = useCallback(async (id: number, title: string) => {
        const previousTodos = [...todos];

        setTodos((prev) =>
            prev.map((t) => t.id === id ? { ...t, title } : t)
        );

        try {
            await TodoService.update(id, { title });
        } catch (err) {
            setTodos(previousTodos);
        }
    }, [todos]);

    return {
        todos,
        loading,
        error,
        isAdding,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    };
};