import { useMemo } from 'react';
import type { PaginationProps } from '../types';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  const pages = useMemo(() => {
    const pagesArray: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination" id="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        Prev
      </button>

      {pages[0] > 1 && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={isLoading}
          >
            1
          </button>
          {pages[0] > 2 && <span className="pagination-dots">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? 'pagination-btn-active' : ''}`}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="pagination-dots">...</span>
          )}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={isLoading}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
