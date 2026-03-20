import { useEffect, useState } from 'react';
import type { Book, BooksResponse } from '../types/Book';

// BookList fetches books from the API and renders them in a paginated,
// sortable table. Pagination and sort state live here so any change
// automatically triggers a new fetch via the useEffect dependency array.
function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);        // total books in the DB (for page count)
  const [pageNum, setPageNum] = useState(1);    // current page (1-based)
  const [pageSize, setPageSize] = useState(5);  // how many rows to show per page
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Derived value — recalculated whenever total or pageSize changes
  const totalPages = Math.ceil(total / pageSize);

  // Re-fetch whenever the user changes page, page size, or sort direction
  useEffect(() => {
    fetch(
      `http://localhost:5017/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotal(data.total);
      });
  }, [pageNum, pageSize, sortOrder]);

  // When the user picks a new page size, jump back to page 1 so we don't
  // land on a page that no longer exists with the smaller page count
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNum(1);
  };

  // Toggle sort direction between ascending and descending, and reset to
  // page 1 so the user sees the first page in the new order
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Bookstore</h1>

      {/* Toolbar: sort button, page-size selector, and result count summary */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <button className="btn btn-outline-secondary" onClick={handleSortToggle}>
          Sort by Title {sortOrder === 'asc' ? '▲' : '▼'}
        </button>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSizeSelect" className="mb-0">Results per page:</label>
          <select
            id="pageSizeSelect"
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        {/* Shows e.g. "Showing 6–10 of 16 books" */}
        <span className="text-muted ms-auto">
          Showing {books.length ? (pageNum - 1) * pageSize + 1 : 0}–
          {Math.min(pageNum * pageSize, total)} of {total} books
        </span>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Classification</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.category}</td>
              <td>{book.classification}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap pagination — Previous / numbered pages / Next */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>
              Previous
            </button>
          </li>
          {/* Generate one button per page */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${pageNum === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;
