import { apiClient } from '@/shared/lib/api-client';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../domain/todo.types';

export const TodoService = {
    // GET: Отримати список (ліміт 10 для зручності)
    getAll: async (): Promise<Todo[]> => {
        const response = await apiClient.get<Todo[]>('/todos?_limit=10');
        return response.data;
    },

    // POST: Створити
    create: async (data: CreateTodoDto): Promise<Todo> => {
        const response = await apiClient.post<Todo>('/todos', data);
        return response.data;
    },

    // PUT/PATCH: Оновити
    update: async (id: number, data: UpdateTodoDto): Promise<Todo> => {
        const response = await apiClient.patch<Todo>(`/todos/${id}`, data);
        return response.data;
    },

    // DELETE: Видалити
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/todos/${id}`);
    }
};