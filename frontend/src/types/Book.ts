// Shape of a single book record returned by the API.
// Property names match the camelCase JSON the ASP.NET Core serializer produces.
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string; // broad grouping, e.g. "Fiction" or "Non-Fiction"
  category: string;       // specific genre, e.g. "Biography" or "Self-Help"
  pageCount: number;
  price: number;
}

// Shape of the paginated response from GET /api/books
export interface BooksResponse {
  books: Book[];  // the current page of books
  total: number;  // total number of books in the database (used to calculate page count)
}
