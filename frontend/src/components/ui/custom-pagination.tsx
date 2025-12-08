import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const generatePagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i === 1 || i === totalPages) continue; // Avoid duplicates
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = generatePagination();

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center border rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        {/* Page Numbers */}
        <div className="flex items-center px-2 py-1 gap-1">
          {pages.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 text-gray-400 text-sm">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                    currentPage === page
                      ? "border border-gray-300 bg-white text-black font-bold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-l transition-colors"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
