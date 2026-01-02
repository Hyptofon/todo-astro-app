import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface TodoPaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export const TodoPagination: React.FC<TodoPaginationProps> = ({
                                                                  currentPage,
                                                                  totalPages,
                                                                  itemsPerPage,
                                                                  onPageChange,
                                                                  onLimitChange
                                                              }) => {
    if (totalPages <= 1 && itemsPerPage >= 10) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100">

            {/* Вибір кількості на сторінці */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Показувати по:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer text-gray-700"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Кнопки навігації */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                    aria-label="Попередня сторінка"
                >
                    <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
          Стор. {currentPage} з {totalPages || 1}
        </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                    aria-label="Наступна сторінка"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};