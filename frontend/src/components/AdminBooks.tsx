import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

const API = 'https://mission13-fdddcxgkcpbsa0gx.centralus-01.azurewebsites.net/api/books';

const emptyForm = (): Omit<Book, 'bookId'> => ({
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
});

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBooks = () => {
    fetch(`${API}?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=asc`)
      .then((r) => r.json())
      .then((data) => {
        setBooks(data.books);
        setTotal(data.total);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, [pageNum]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      await fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: editingId, ...form }),
      });
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.bookId);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this book?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(false);
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0">Admin — Manage Books</h1>
        <a href="/" className="btn btn-outline-secondary">Back to Store</a>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header fw-bold">
            {editingId !== null ? 'Edit Book' : 'Add New Book'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {(['title', 'author', 'publisher', 'isbn', 'classification', 'category'] as const).map((field) => (
                  <div className="col-md-4" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      className="form-control"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <div className="col-md-4">
                  <label className="form-label">Page Count</label>
                  <input
                    className="form-control"
                    type="number"
                    name="pageCount"
                    value={form.pageCount}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                    required
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId !== null ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="btn btn-success mb-3" onClick={handleAddNew}>
          + Add New Book
        </button>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>${book.price.toFixed(2)}</td>
              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(book)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination flex-wrap">
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${pageNum === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(page)}>{page}</button>
            </li>
          ))}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum((p) => p + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminBooks;
