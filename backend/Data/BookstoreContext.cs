using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

// EF Core DbContext that connects to the Bookstore SQLite database.
// Registered in Program.cs via AddDbContext and injected into API endpoints.
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // Represents the Books table — EF Core uses this to build queries
    public DbSet<Book> Books { get; set; }

    // Map C# property names to the exact column names used in the SQLite schema,
    // since EF Core's default conventions don't match the existing column casing.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId);
            entity.Property(e => e.BookId).HasColumnName("BookID");   // DB uses "BookID"
            entity.Property(e => e.Isbn).HasColumnName("ISBN");       // DB uses "ISBN"
            entity.Property(e => e.PageCount).HasColumnName("PageCount");
        });
    }
}
