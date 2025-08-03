import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, page, setPage }) => {
  const currentPageValue = currentPage || page;
  const handlePageChange = onPageChange || setPage;
  if (totalPages <= 1) return null;

  const handlePrev = () => handlePageChange(currentPageValue > 1 ? currentPageValue - 1 : 1);
  const handleNext = () => handlePageChange(currentPageValue < totalPages ? currentPageValue + 1 : totalPages);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPageValue) <= 1) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 rounded ${i === currentPageValue ? "bg-accent text-white" : "bg-gray-100 text-gray-700"}`}
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
          <span key={`ellipsis-${i}`} className="px-2">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button onClick={handlePrev} disabled={currentPageValue === 1} className="px-3 py-1 rounded bg-gray-100 text-gray-700">
        Previous
      </button>
      {renderPages()}
      <button onClick={handleNext} disabled={currentPageValue === totalPages} className="px-3 py-1 rounded bg-gray-100 text-gray-700">
        Next
      </button>
    </div>
  );
};

export default Pagination;