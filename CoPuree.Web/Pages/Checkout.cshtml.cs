using System.ComponentModel.DataAnnotations;
using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CoPuree.Web.Pages;

public class CheckoutModel(
    AppDbContext db,
    CartService cartService,
    IOptions<BankTransferOptions> bankTransferOptions) : PageModel
{
    [BindProperty]
    public CheckoutInput Input { get; set; } = new();

    public CartSummary Cart { get; set; } = new();

    public BankTransferOptions BankTransfer { get; set; } = bankTransferOptions.Value;

    public async Task<IActionResult> OnGetAsync()
    {
        Cart = await cartService.GetCartAsync();

        return Cart.Items.Any() ? Page() : RedirectToPage("/Products");
    }

    public async Task<IActionResult> OnPostAsync()
    {
        Cart = await cartService.GetCartAsync();
        if (!Cart.Items.Any())
        {
            return RedirectToPage("/Products");
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        var productIds = Cart.Items.Select(item => item.Product.Id).ToList();
        var products = await db.Products
            .Where(product => productIds.Contains(product.Id))
            .ToDictionaryAsync(product => product.Id);

        foreach (var item in Cart.Items)
        {
            if (!products.TryGetValue(item.Product.Id, out var product) || product.StockQuantity < item.Quantity)
            {
                ModelState.AddModelError(string.Empty, $"{item.Product.Name} khong du ton kho. Vui long cap nhat gio hang.");
                return Page();
            }
        }

        var orderNumber = $"CP{DateTime.UtcNow:yyMMddHHmmss}";
        var paymentStatus = Input.PaymentMethod == PaymentMethod.BankTransfer
            ? PaymentStatus.AwaitingTransfer
            : PaymentStatus.Pending;
        var transactionCode = $"{orderNumber}-{Input.PaymentMethod}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerName = Input.CustomerName,
            Phone = Input.Phone,
            Email = Input.Email,
            ShippingAddress = Input.ShippingAddress,
            Note = Input.Note,
            Subtotal = Cart.Subtotal,
            ShippingFee = Cart.ShippingFee,
            Total = Cart.Total,
            PaymentMethod = Input.PaymentMethod,
            PaymentStatus = paymentStatus,
            TransactionCode = transactionCode,
            Items = Cart.Items.Select(item => new OrderItem
            {
                ProductId = item.Product.Id,
                ProductName = item.Product.Name,
                Size = item.Product.Size,
                Quantity = item.Quantity,
                UnitPrice = item.Product.Price,
                LineTotal = item.LineTotal
            }).ToList()
        };

        foreach (var item in Cart.Items)
        {
            products[item.Product.Id].StockQuantity -= item.Quantity;
        }

        db.Orders.Add(order);
        db.PaymentTransactions.Add(new PaymentTransaction
        {
            Order = order,
            Code = transactionCode,
            Method = Input.PaymentMethod,
            Status = paymentStatus,
            Amount = Cart.Total,
            Provider = Input.PaymentMethod == PaymentMethod.BankTransfer ? "Bank transfer" : "COD"
        });

        await db.SaveChangesAsync();
        cartService.Clear();

        return RedirectToPage("/OrderSuccess", new { orderNumber });
    }
}

public class CheckoutInput
{
    [Required(ErrorMessage = "Nhap ho ten nguoi nhan")]
    [Display(Name = "Ho ten")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhap so dien thoai")]
    [Phone(ErrorMessage = "So dien thoai chua hop le")]
    [Display(Name = "So dien thoai")]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Email chua hop le")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Nhap dia chi giao hang")]
    [Display(Name = "Dia chi giao hang")]
    public string ShippingAddress { get; set; } = string.Empty;

    [Display(Name = "Ghi chu")]
    public string? Note { get; set; }

    [Display(Name = "Thanh toan")]
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
}
