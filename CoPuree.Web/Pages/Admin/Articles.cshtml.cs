using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text;
using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class ArticlesModel(AppDbContext db, AdminSession adminSession, IWebHostEnvironment environment, IConfiguration configuration) : PageModel
{
    private static readonly ArticleCategoryOption[] CategoryOptions =
    [
        new("cham-soc-toc", "Chăm sóc tóc"),
        new("cham-soc-da", "Chăm sóc da"),
        new("cham-soc-rang-mieng", "Chăm sóc răng miệng"),
        new("nau-an-lam-banh", "Nấu ăn và làm bánh"),
        new("hoat-dong-thuong-hieu", "Hoạt động thương hiệu")
    ];

    [BindProperty]
    public string Password { get; set; } = string.Empty;

    [BindProperty]
    public ArticleInput Input { get; set; } = new();

    public List<Article> Articles { get; set; } = [];

    public IReadOnlyList<ArticleCategoryOption> Categories => CategoryOptions;

    public int PublishedCount { get; set; }

    public int HiddenCount { get; set; }

    public int FeaturedCount { get; set; }

    public bool IsAuthenticated => adminSession.IsAuthenticated;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync(int? editId)
    {
        if (!IsAuthenticated)
        {
            return;
        }

        await LoadArticlesAsync();

        if (editId is not null)
        {
            var article = Articles.FirstOrDefault(item => item.Id == editId.Value);
            if (article is not null)
            {
                Input = ArticleInput.FromArticle(article);
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

        await LoadArticlesAsync();
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

        var selectedCategory = CategoryOptions.FirstOrDefault(category => category.Slug == Input.CategorySlug);
        if (selectedCategory is null)
        {
            ModelState.AddModelError("Input.CategorySlug", "Chọn chuyên mục bài viết.");
        }

        if (!ModelState.IsValid)
        {
            await LoadArticlesAsync();
            return Page();
        }

        var slug = Slugify(Input.Slug);
        if (string.IsNullOrWhiteSpace(slug))
        {
            slug = Slugify(Input.Title);
        }

        var slugExists = await db.Articles.AnyAsync(article =>
            article.Slug == slug && article.Id != Input.Id);
        if (slugExists)
        {
            ModelState.AddModelError("Input.Slug", "Slug này đã tồn tại.");
            await LoadArticlesAsync();
            return Page();
        }

        var imageUrl = Input.ImageUrl.Trim();
        if (Input.ImageFile is not null && Input.ImageFile.Length > 0)
        {
            imageUrl = await SaveImageAsync(Input.ImageFile);
        }

        Article article;
        if (Input.Id == 0)
        {
            article = new Article
            {
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Articles.Add(article);
        }
        else
        {
            article = await db.Articles.FirstOrDefaultAsync(item => item.Id == Input.Id)
                ?? throw new InvalidOperationException("Article not found.");
        }

        article.Title = Input.Title.Trim();
        article.Slug = slug;
        article.CategorySlug = selectedCategory!.Slug;
        article.CategoryName = selectedCategory.Name;
        article.Excerpt = Input.Excerpt.Trim();
        article.Content = Input.Content.Trim();
        article.ImageUrl = imageUrl;
        article.ImageAlt = string.IsNullOrWhiteSpace(Input.ImageAlt)
            ? Input.Title.Trim()
            : Input.ImageAlt.Trim();
        article.IsFeatured = Input.IsFeatured;
        article.IsPublished = Input.IsPublished;
        article.UpdatedAtUtc = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return RedirectToPage();
    }

    private async Task LoadArticlesAsync()
    {
        Articles = await db.Articles
            .OrderByDescending(article => article.CreatedAtUtc)
            .ToListAsync();
        PublishedCount = Articles.Count(article => article.IsPublished);
        HiddenCount = Articles.Count(article => !article.IsPublished);
        FeaturedCount = Articles.Count(article => article.IsFeatured);
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowedTypes.Contains(image.ContentType, StringComparer.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF.");
        }

        var configuredUploadsPath = configuration["Storage:UploadsPath"];
        var uploadsRoot = string.IsNullOrWhiteSpace(configuredUploadsPath)
            ? Path.Combine(environment.WebRootPath, "uploads")
            : configuredUploadsPath;
        var uploadsDirectory = Path.Combine(uploadsRoot, "articles");
        Directory.CreateDirectory(uploadsDirectory);

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        var fileName = $"{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsDirectory, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await image.CopyToAsync(stream);

        return $"/uploads/articles/{fileName}";
    }

    private static string Slugify(string value)
    {
        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);

        foreach (var ch in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category == UnicodeCategory.NonSpacingMark)
            {
                continue;
            }

            if (char.IsLetterOrDigit(ch))
            {
                builder.Append(ch);
                continue;
            }

            builder.Append('-');
        }

        var slug = builder.ToString().Normalize(NormalizationForm.FormC);
        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        return slug.Trim('-');
    }
}

public record ArticleCategoryOption(string Slug, string Name);

public class ArticleInput
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nhập tiêu đề bài viết")]
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    [Required(ErrorMessage = "Chọn chuyên mục")]
    public string CategorySlug { get; set; } = "hoat-dong-thuong-hieu";

    [Required(ErrorMessage = "Nhập mô tả ngắn")]
    public string Excerpt { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập nội dung bài viết")]
    public string Content { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string ImageAlt { get; set; } = string.Empty;

    public IFormFile? ImageFile { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; } = true;

    public static ArticleInput FromArticle(Article article) => new()
    {
        Id = article.Id,
        Title = article.Title,
        Slug = article.Slug,
        CategorySlug = article.CategorySlug,
        Excerpt = article.Excerpt,
        Content = article.Content,
        ImageUrl = article.ImageUrl,
        ImageAlt = article.ImageAlt,
        IsFeatured = article.IsFeatured,
        IsPublished = article.IsPublished
    };
}
