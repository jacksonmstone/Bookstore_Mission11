import { useEffect, useState } from 'react';
import type { Book, BooksResponse } from '../types/Book';
import { useCart } from '../context/CartContext';

interface BookListProps {
  onViewCart: () => void;
}

// BookList fetches books from the API and renders them in a paginated,
// sortable, filterable table with add-to-cart functionality.
function BookList({ onViewCart }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // Bootstrap Spinner: track loading state to show spinner while fetching
  const [loading, setLoading] = useState(false);

  const { addToCart, cartCount, cartTotal } = useCart();

  const totalPages = Math.ceil(total / pageSize);

  // Fetch the list of distinct categories once on mount
  useEffect(() => {
    fetch('http://localhost:5017/api/books/categories')
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data));
  }, []);

  // Re-fetch books whenever page, page size, sort order, or category changes
  useEffect(() => {
    setLoading(true);
    const categoryParam = selectedCategory
      ? `&category=${encodeURIComponent(selectedCategory)}`
      : '';
    fetch(
      `http://localhost:5017/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotal(data.total);
        setLoading(false);
      });
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNum(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  };

  // Reset to page 1 when switching categories so we don't land on a nonexistent page
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPageNum(1);
  };

  return (
    <div className="container my-4">

      {/* Cart summary bar — Bootstrap Badge shows item count */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="mb-0">Bookstore</h1>
        </div>
        <div className="col-auto">
          <button className="btn btn-success position-relative" onClick={onViewCart}>
            Cart
            {/* Bootstrap Badge: displays cart item count as an overlaid pill */}
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartCount}
              <span className="visually-hidden">items in cart</span>
            </span>
          </button>
          {cartCount > 0 && (
            <span className="ms-3 text-muted">
              {cartCount} item{cartCount !== 1 ? 's' : ''} — Total: ${cartTotal.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="row">
        {/* Category filter sidebar */}
        <div className="col-md-2 mb-3">
          <h6 className="fw-bold">Filter by Category</h6>
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content column */}
        <div className="col-md-10">

          {/* Toolbar */}
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
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

            <span className="text-muted ms-auto">
              {selectedCategory && (
                <span className="badge bg-secondary me-2">{selectedCategory}</span>
              )}
              Showing {books.length ? (pageNum - 1) * pageSize + 1 : 0}–
              {Math.min(pageNum * pageSize, total)} of {total} books
            </span>
          </div>

          {/* Bootstrap Spinner: shown while fetching books from the API */}
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
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
                    <th></th>
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
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => addToCart(book)}
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bootstrap pagination */}
              <nav>
                <ul className="pagination flex-wrap">
                  <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>
                      Previous
                    </button>
                  </li>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookList;
