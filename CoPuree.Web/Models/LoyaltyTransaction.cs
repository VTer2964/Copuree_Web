using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public enum LoyaltyTransactionType
{
    Earn = 0,
    Redeem = 1,
    Adjust = 2
}

public class LoyaltyTransaction
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public Customer? Customer { get; set; }

    public int? OrderId { get; set; }

    public Order? Order { get; set; }

    public int Points { get; set; }

    public LoyaltyTransactionType Type { get; set; }

    [MaxLength(300)]
    public string Note { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
