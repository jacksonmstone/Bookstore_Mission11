using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register the EF Core DbContext using the SQLite connection string from appsettings.json
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Allow the React dev server to call this API without being blocked by CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowReact");
app.UseHttpsRedirection();

// GET /api/books
// Returns a paginated, sorted page of books plus the total record count.
// Query parameters:
//   pageNum   - which page to return (1-based, default: 1)
//   pageSize  - how many books per page (default: 5)
//   sortOrder - "asc" or "desc" to sort by title (default: "asc")
//   category  - filter to a specific category (optional)
app.MapGet("/api/books", async (
    BookstoreContext db,
    int pageNum = 1,
    int pageSize = 5,
    string sortOrder = "asc",
    string? category = null) =>
{
    var query = db.Books.AsQueryable();

    // Filter by category when provided
    if (!string.IsNullOrEmpty(category))
        query = query.Where(b => b.Category == category);

    // Apply title sort before paging so each page is in the correct order
    query = sortOrder == "desc"
        ? query.OrderByDescending(b => b.Title)
        : query.OrderBy(b => b.Title);

    // Count total matching records so the frontend can calculate page count
    var total = await query.CountAsync();

    // Skip records from previous pages, then take only the current page
    var books = await query
        .Skip((pageNum - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Results.Ok(new { books, total });
});

// GET /api/books/categories
// Returns a sorted list of all distinct book categories in the database.
app.MapGet("/api/books/categories", async (BookstoreContext db) =>
{
    var categories = await db.Books
        .Select(b => b.Category)
        .Distinct()
        .OrderBy(c => c)
        .ToListAsync();
    return Results.Ok(categories);
});

app.Run();
