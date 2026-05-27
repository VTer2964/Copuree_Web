using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public enum OrderStatus
{
    Pending = 0,
    Confirmed = 1,
    Packing = 2,
    Shipping = 3,
    Completed = 4,
    Cancelled = 5
}

public enum PaymentMethod
{
    CashOnDelivery = 0,
    BankTransfer = 1,
    OnlineGateway = 2
}

public enum PaymentStatus
{
    Pending = 0,
    AwaitingTransfer = 1,
    Authorized = 2,
    Paid = 3,
    Failed = 4,
    Refunded = 5
}

public class Order
{
    public int Id { get; set; }

    public int? CustomerId { get; set; }

    public Customer? Customer { get; set; }

    [Required, MaxLength(32)]
    public string OrderNumber { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string CustomerName { get; set; } = string.Empty;

    [Required, Phone, MaxLength(24)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress, MaxLength(160)]
    public string? Email { get; set; }

    [Required, MaxLength(260)]
    public string ShippingAddress { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Note { get; set; }

    public decimal Subtotal { get; set; }

    public decimal ShippingFee { get; set; }

    public decimal Total { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    [MaxLength(80)]
    public string? TransactionCode { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = [];
}
