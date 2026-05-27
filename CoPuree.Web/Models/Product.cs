using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(160)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(180)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(280)]
    public string ShortDescription { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Size { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal? CompareAtPrice { get; set; }

    public int StockQuantity { get; set; }

    public int LowStockThreshold { get; set; } = 10;

    [MaxLength(420)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Badge { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; } = true;
}
