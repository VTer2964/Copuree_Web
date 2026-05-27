namespace CoPuree.Web.Models;

public class CartLine
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}

public class CartItem
{
    public Product Product { get; set; } = new();

    public int Quantity { get; set; }

    public decimal LineTotal => Product.Price * Quantity;
}

public class CartSummary
{
    public List<CartItem> Items { get; set; } = [];

    public int TotalQuantity => Items.Sum(item => item.Quantity);

    public decimal Subtotal => Items.Sum(item => item.LineTotal);

    public decimal ShippingFee => Subtotal >= 500000 || Subtotal == 0 ? 0 : 30000;

    public decimal Total => Subtotal + ShippingFee;
}
