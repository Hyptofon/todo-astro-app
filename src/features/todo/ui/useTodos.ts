import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useTodoOperations } from '@/features/todo/ui/hooks/useTodoOperations';
import { useTodoFiltering } from '@/features/todo/ui/hooks/useTodoFiltering';

export const useTodos = () => {
    const {
        todos: allTodos,
        loading,
        isAdding,
        addTodo: createTodo,
        deleteTodo,
        toggleTodo,
        updateTodoTitle
    } = useTodoOperations();

    const {
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        filteredTodos,
        stats
    } = useTodoFiltering(allTodos);

    const {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        paginatedItems: paginatedTodos
    } = usePagination(filteredTodos, 5);

    const addTodo = async (title: string) => {
        await createTodo(title);
        setSearchQuery('');
        setFilter('all');
        setCurrentPage(1);
    };

    return {
        todos: paginatedTodos,
        stats,
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