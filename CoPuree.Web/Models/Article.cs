using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class Article
{
    public int Id { get; set; }

    [Required, MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string CategorySlug { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(320)]
    public string Excerpt { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    [MaxLength(420)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(180)]
    public string ImageAlt { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = true;

    public bool IsFeatured { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
