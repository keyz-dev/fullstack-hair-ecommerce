import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, page, setPage, total, limit = 5 }) => {
  const currentPageValue = currentPage || page;
  const handlePageChange = onPageChange || setPage;
  if (totalPages <= 1) return null;

  const handlePrev = () => handlePageChange(currentPageValue > 1 ? currentPageValue - 1 : 1);
  const handleNext = () => handlePageChange(currentPageValue < totalPages ? currentPageValue + 1 : totalPages);

  // Calculate the range of items being shown
  const startItem = (currentPageValue - 1) * limit + 1;
  const endItem = Math.min(currentPageValue * limit, total);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPageValue) <= 1) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 rounded transition-colors ${
              i === currentPageValue 
                ? "bg-accent text-white border-accent" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } border`}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPageValue}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPageValue - 2 && currentPageValue > 3) ||
        (i === currentPageValue + 2 && currentPageValue < totalPages - 2)
      ) {
        pages.push(
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-6">
      {/* Information text */}
      <div className="text-sm text-gray-600">
        Showing {startItem} - {endItem} from a total of {total} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handlePrev} 
          disabled={currentPageValue === 1} 
          className={`px-3 py-1 rounded border transition-colors ${
            currentPageValue === 1
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-accent"
          }`}
        >
          Previous
        </button>
        {renderPages()}
        <button 
          onClick={handleNext} 
          disabled={currentPageValue === totalPages} 
          className={`px-3 py-1 rounded border transition-colors ${
            currentPageValue === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-accent"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;