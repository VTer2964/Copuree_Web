using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class PaymentTransaction
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    [Required, MaxLength(80)]
    public string Code { get; set; } = string.Empty;

    public PaymentMethod Method { get; set; }

    public PaymentStatus Status { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(120)]
    public string Provider { get; set; } = "Manual";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
