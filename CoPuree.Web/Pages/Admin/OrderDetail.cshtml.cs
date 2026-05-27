using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class OrderDetailModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public int OrderId { get; set; }

    [BindProperty]
    public OrderStatus Status { get; set; }

    [BindProperty]
    public PaymentStatus PaymentStatus { get; set; }

    public Order Order { get; set; } = new();

    public List<PaymentTransaction> Transactions { get; set; } = [];

    public async Task<IActionResult> OnGetAsync(int id)
    {
        if (!adminSession.IsAuthenticated)
        {
            return RedirectToPage("/Admin/Orders");
        }

        var order = await db.Orders
            .Include(item => item.Items)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (order is null)
        {
            return NotFound();
        }

        Order = order;
        Transactions = await db.PaymentTransactions
            .Where(transaction => transaction.OrderId == id)
            .OrderByDescending(transaction => transaction.CreatedAtUtc)
            .ToListAsync();

        return Page();
    }

    public async Task<IActionResult> OnPostUpdateStatusAsync(int id)
    {
        if (!adminSession.IsAuthenticated)
        {
            return RedirectToPage("/Admin/Orders");
        }

        var order = await db.Orders.FirstOrDefaultAsync(item => item.Id == OrderId);
        if (order is null || order.Id != id)
        {
            return NotFound();
        }

        var previousStatus = order.Status;
        order.Status = Status;
        order.PaymentStatus = PaymentStatus;

        var latestTransaction = await db.PaymentTransactions
            .Where(transaction => transaction.OrderId == order.Id)
            .OrderByDescending(transaction => transaction.CreatedAtUtc)
            .FirstOrDefaultAsync();

        if (latestTransaction is not null)
        {
            latestTransaction.Status = PaymentStatus;
        }

        if (previousStatus != OrderStatus.Completed && Status == OrderStatus.Completed)
        {
            await AwardCompletionPointsAsync(order);
        }

        await db.SaveChangesAsync();

        return RedirectToPage(new { id = order.Id });
    }

    private async Task AwardCompletionPointsAsync(Order order)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(item => item.Phone == order.Phone);
        if (customer is null)
        {
            customer = new Customer
            {
                FullName = order.CustomerName,
                Phone = order.Phone,
                Email = order.Email,
                CreatedAtUtc = DateTime.UtcNow
            };
            db.Customers.Add(customer);
            await db.SaveChangesAsync();
            order.CustomerId = customer.Id;
        }

        var alreadyAwarded = await db.LoyaltyTransactions.AnyAsync(transaction =>
            transaction.OrderId == order.Id &&
            transaction.Type == LoyaltyTransactionType.Earn);
        if (alreadyAwarded)
        {
            return;
        }

        var points = Math.Max(1, (int)Math.Floor(order.Total / 10000m));
        customer.LoyaltyPoints += points;
        db.LoyaltyTransactions.Add(new LoyaltyTransaction
        {
            Customer = customer,
            Order = order,
            Points = points,
            Type = LoyaltyTransactionType.Earn,
            Note = $"Tự cộng điểm khi hoàn tất đơn {order.OrderNumber}"
        });
    }
}
