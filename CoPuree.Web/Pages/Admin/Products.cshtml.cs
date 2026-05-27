using System.ComponentModel.DataAnnotations;
using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class ProductsModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public string Password { get; set; } = string.Empty;

    [BindProperty]
    public ProductInput Input { get; set; } = new();

    public List<Product> Products { get; set; } = [];

    public int PublishedCount { get; set; }

    public int HiddenCount { get; set; }

    public int LowStockCount { get; set; }

    public int TotalStockQuantity { get; set; }

    public bool IsAuthenticated => adminSession.IsAuthenticated;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync(int? editId)
    {
        if (!IsAuthenticated)
        {
            return;
        }

        await LoadProductsAsync();

        if (editId is not null)
        {
            var product = Products.FirstOrDefault(item => item.Id == editId.Value);
            if (product is not null)
            {
                Input = ProductInput.FromProduct(product);
            }
        }
    }

    public async Task<IActionResult> OnPostLoginAsync()
    {
        if (!adminSession.SignIn(Password))
        {
            ErrorMessage = "Mật khẩu admin không đúng.";
            return Page();
        }

        await LoadProductsAsync();
        return Page();
    }

    public IActionResult OnPostLogout()
    {
        adminSession.SignOut();

        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostSaveAsync()
    {
        if (!IsAuthenticated)
        {
            return RedirectToPage();
        }

        if (!ModelState.IsValid)
        {
            await LoadProductsAsync();
            return Page();
        }

        var slug = Slugify(Input.Slug);
        if (string.IsNullOrWhiteSpace(slug))
        {
            slug = Slugify(Input.Name);
        }

        var slugExists = await db.Products.AnyAsync(product =>
            product.Slug == slug && product.Id != Input.Id);

        if (slugExists)
        {
            ModelState.AddModelError("Input.Slug", "Slug nay da ton tai.");
            await LoadProductsAsync();
            return Page();
        }

        Product product;
        if (Input.Id == 0)
        {
            product = new Product();
            db.Products.Add(product);
        }
        else
        {
            product = await db.Products.FirstOrDefaultAsync(item => item.Id == Input.Id)
                ?? throw new InvalidOperationException("Product not found.");
        }

        product.Name = Input.Name.Trim();
        product.Slug = slug;
        product.ShortDescription = Input.ShortDescription.Trim();
        product.Description = Input.Description.Trim();
        product.Size = Input.Size.Trim();
        product.Price = Input.Price;
        product.CompareAtPrice = Input.CompareAtPrice;
        product.StockQuantity = Input.StockQuantity;
        product.LowStockThreshold = Input.LowStockThreshold;
        product.ImageUrl = Input.ImageUrl.Trim();
        product.Badge = Input.Badge.Trim();
        product.IsFeatured = Input.IsFeatured;
        product.IsPublished = Input.IsPublished;

        await db.SaveChangesAsync();

        return RedirectToPage();
    }

    private async Task LoadProductsAsync()
    {
        Products = await db.Products
            .OrderByDescending(product => product.IsFeatured)
            .ThenBy(product => product.Price)
            .ToListAsync();
        PublishedCount = Products.Count(product => product.IsPublished);
        HiddenCount = Products.Count(product => !product.IsPublished);
        LowStockCount = Products.Count(product => product.StockQuantity <= product.LowStockThreshold);
        TotalStockQuantity = Products.Sum(product => product.StockQuantity);
    }

    private static string Slugify(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        var chars = normalized.Select(ch =>
            char.IsLetterOrDigit(ch) ? ch : '-').ToArray();
        var slug = new string(chars);

        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        return slug.Trim('-');
    }
}

public class ProductInput
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nhập tên sản phẩm")]
    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập mô tả ngắn")]
    public string ShortDescription { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Size { get; set; } = string.Empty;

    [Range(0, 999999999, ErrorMessage = "Giá chưa hợp lệ")]
    public decimal Price { get; set; }

    [Range(0, 999999999, ErrorMessage = "Giá so sánh chưa hợp lệ")]
    public decimal? CompareAtPrice { get; set; }

    [Range(0, 999999, ErrorMessage = "Tồn kho chưa hợp lệ")]
    public int StockQuantity { get; set; }

    [Range(0, 999999, ErrorMessage = "Ngưỡng cảnh báo chưa hợp lệ")]
    public int LowStockThreshold { get; set; } = 10;

    public string ImageUrl { get; set; } = string.Empty;

    public string Badge { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; } = true;

    public static ProductInput FromProduct(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Slug = product.Slug,
        ShortDescription = product.ShortDescription,
        Description = product.Description,
        Size = product.Size,
        Price = product.Price,
        CompareAtPrice = product.CompareAtPrice,
        StockQuantity = product.StockQuantity,
        LowStockThreshold = product.LowStockThreshold,
        ImageUrl = product.ImageUrl,
        Badge = product.Badge,
        IsFeatured = product.IsFeatured,
        IsPublished = product.IsPublished
    };
}
