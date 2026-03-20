namespace backend.Models;

// Represents a single book record in the Bookstore database.
// Property names use C# conventions but are mapped to the actual
// SQLite column names in BookstoreContext.OnModelCreating.
public class Book
{
    public int BookId { get; set; }           // Primary key (auto-incremented)
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;          // e.g. "978-0451419439"
    public string Classification { get; set; } = string.Empty; // e.g. "Fiction" or "Non-Fiction"
    public string Category { get; set; } = string.Empty;       // e.g. "Biography", "Self-Help"
    public int PageCount { get; set; }
    public decimal Price { get; set; }
}
