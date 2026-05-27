using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class Customer
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    [Required, Phone, MaxLength(24)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress, MaxLength(160)]
    public string? Email { get; set; }

    [MaxLength(120)]
    public string? GoogleId { get; set; }

    [MaxLength(420)]
    public string? AvatarUrl { get; set; }

    public int LoyaltyPoints { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAtUtc { get; set; }

    public List<CustomerAddress> Addresses { get; set; } = [];

    public List<Order> Orders { get; set; } = [];

    public List<LoyaltyTransaction> LoyaltyTransactions { get; set; } = [];
}
