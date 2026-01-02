export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
}

export interface CreateTodoDto {
    title: string;
    userId: number;
    completed: boolean;
}

export interface UpdateTodoDto {
    title?: string;
    completed?: boolean;
}