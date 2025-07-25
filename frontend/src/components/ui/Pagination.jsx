import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => setPage(page > 1 ? page - 1 : 1);
  const handleNext = () => setPage(page < totalPages ? page + 1 : totalPages);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 rounded ${i === page ? "bg-accent text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setPage(i)}
            disabled={i === page}
          >
            {i}
          </button>
        );
      } else if (
        (i === page - 2 && page > 3) ||
        (i === page + 2 && page < totalPages - 2)
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
      <button onClick={handlePrev} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 text-gray-700">
        Previous
      </button>
      {renderPages()}
      <button onClick={handleNext} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-100 text-gray-700">
        Next
      </button>
    </div>
  );
};

export default Pagination;