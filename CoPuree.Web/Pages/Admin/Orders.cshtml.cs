using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace CoPuree.Web.Pages.Admin;

public class OrdersModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public string Password { get; set; } = string.Empty;

    [BindProperty]
    public int OrderId { get; set; }

    [BindProperty]
    public OrderStatus Status { get; set; }

    [BindProperty]
    public PaymentStatus PaymentStatus { get; set; }

    [BindProperty(SupportsGet = true)]
    public string? Query { get; set; }

    [BindProperty(SupportsGet = true)]
    public OrderStatus? StatusFilter { get; set; }

    [BindProperty(SupportsGet = true)]
    public PaymentStatus? PaymentStatusFilter { get; set; }

    public List<Order> Orders { get; set; } = [];

    public int TotalMatchingOrders { get; set; }

    public decimal TotalMatchingRevenue { get; set; }

    public int PendingCount { get; set; }

    public int ShippingCount { get; set; }

    public bool IsAuthenticated => adminSession.IsAuthenticated;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync()
    {
        if (IsAuthenticated)
        {
            await LoadOrdersAsync();
        }
    }

    public async Task<IActionResult> OnPostLoginAsync()
    {
        if (!adminSession.SignIn(Password))
        {
            ErrorMessage = "Mật khẩu admin không đúng hoặc chưa được cấu hình cho production.";
            return Page();
        }

        await LoadOrdersAsync();
        return Page();
    }

    public IActionResult OnPostLogout()
    {
        adminSession.SignOut();
        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostUpdateStatusAsync()
    {
        if (!IsAuthenticated)
        {
            return RedirectToPage();
        }

        var order = await db.Orders.FirstOrDefaultAsync(item => item.Id == OrderId);
        if (order is null)
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

        return RedirectToPage(new
        {
            Query,
            StatusFilter,
            PaymentStatusFilter
        });
    }

    public async Task<IActionResult> OnGetExportAsync()
    {
        if (!IsAuthenticated)
        {
            return RedirectToPage();
        }

        var orders = await ApplyFilters(db.Orders.Include(order => order.Items))
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("OrderNumber,CreatedAt,CustomerName,Phone,Email,Address,Items,Subtotal,ShippingFee,Total,OrderStatus,PaymentMethod,PaymentStatus,Note");

        foreach (var order in orders)
        {
            var items = string.Join(" | ", order.Items.Select(item =>
                $"{item.ProductName} x {item.Quantity}"));

            csv.AppendLine(string.Join(",", new[]
            {
                Escape(order.OrderNumber),
                Escape(order.CreatedAtUtc.ToLocalTime().ToString("yyyy-MM-dd HH:mm")),
                Escape(order.CustomerName),
                Escape(order.Phone),
                Escape(order.Email ?? ""),
                Escape(order.ShippingAddress),
                Escape(items),
                Escape(order.Subtotal.ToString("0")),
                Escape(order.ShippingFee.ToString("0")),
                Escape(order.Total.ToString("0")),
                Escape(GetOrderStatusLabel(order.Status)),
                Escape(GetPaymentMethodLabel(order.PaymentMethod)),
                Escape(GetPaymentStatusLabel(order.PaymentStatus)),
                Escape(order.Note ?? "")
            }));
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        var fileName = $"copuree-orders-{DateTime.Now:yyyyMMdd-HHmm}.csv";

        return File(bytes, "text/csv; charset=utf-8", fileName);
    }

    private async Task LoadOrdersAsync()
    {
        var filteredOrders = ApplyFilters(db.Orders.Include(order => order.Items));

        TotalMatchingOrders = await filteredOrders.CountAsync();
        TotalMatchingRevenue = await filteredOrders.SumAsync(order => order.Total);
        PendingCount = await db.Orders.CountAsync(order => order.Status == OrderStatus.Pending);
        ShippingCount = await db.Orders.CountAsync(order =>
            order.Status == OrderStatus.Packing || order.Status == OrderStatus.Shipping);

        Orders = await filteredOrders
            .OrderByDescending(order => order.CreatedAtUtc)
            .Take(100)
            .ToListAsync();
    }

    private IQueryable<Order> ApplyFilters(IQueryable<Order> query)
    {
        if (!string.IsNullOrWhiteSpace(Query))
        {
            var keyword = Query.Trim();
            query = query.Where(order =>
                order.OrderNumber.Contains(keyword) ||
                order.CustomerName.Contains(keyword) ||
                order.Phone.Contains(keyword) ||
                (order.Email != null && order.Email.Contains(keyword)));
        }

        if (StatusFilter is not null)
        {
            query = query.Where(order => order.Status == StatusFilter);
        }

        if (PaymentStatusFilter is not null)
        {
            query = query.Where(order => order.PaymentStatus == PaymentStatusFilter);
        }

        return query;
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

    public static string GetOrderStatusLabel(OrderStatus status) =>
        status switch
        {
            OrderStatus.Pending => "Chờ xác nhận",
            OrderStatus.Confirmed => "Đã xác nhận",
            OrderStatus.Packing => "Đang đóng gói",
            OrderStatus.Shipping => "Đang giao",
            OrderStatus.Completed => "Hoàn tất",
            OrderStatus.Cancelled => "Đã hủy",
            _ => status.ToString()
        };

    public static string GetPaymentStatusLabel(PaymentStatus status) =>
        status switch
        {
            PaymentStatus.Pending => "Chờ thanh toán",
            PaymentStatus.AwaitingTransfer => "Chờ chuyển khoản",
            PaymentStatus.Authorized => "Đã giữ tiền",
            PaymentStatus.Paid => "Đã thanh toán",
            PaymentStatus.Failed => "Thất bại",
            PaymentStatus.Refunded => "Đã hoàn tiền",
            _ => status.ToString()
        };

    public static string GetPaymentMethodLabel(PaymentMethod method) =>
        method switch
        {
            PaymentMethod.CashOnDelivery => "COD",
            PaymentMethod.BankTransfer => "Chuyển khoản",
            PaymentMethod.OnlineGateway => "Cổng online",
            _ => method.ToString()
        };

    private static string Escape(string value)
    {
        var escaped = value.Replace("\"", "\"\"", StringComparison.Ordinal);
        return $"\"{escaped}\"";
    }
}
