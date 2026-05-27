using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class CustomerAddress
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public Customer? Customer { get; set; }

    [Required, MaxLength(120)]
    public string ReceiverName { get; set; } = string.Empty;

    [Required, Phone, MaxLength(24)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(120)]
    public string Province { get; set; } = string.Empty;

    [MaxLength(120)]
    public string District { get; set; } = string.Empty;

    [MaxLength(120)]
    public string Ward { get; set; } = string.Empty;

    [Required, MaxLength(260)]
    public string AddressLine { get; set; } = string.Empty;

    public bool IsDefault { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
