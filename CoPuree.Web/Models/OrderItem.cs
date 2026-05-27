using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }

    [Required, MaxLength(160)]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Size { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal LineTotal { get; set; }
}
