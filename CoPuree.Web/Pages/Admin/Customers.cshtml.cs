using CoPuree.Web.Data;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class CustomersModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public string Password { get; set; } = string.Empty;

    public List<CustomerListItem> Customers { get; set; } = [];

    public bool IsAuthenticated => adminSession.IsAuthenticated;

    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync()
    {
        if (IsAuthenticated)
        {
            await LoadCustomersAsync();
        }
    }

    public async Task<IActionResult> OnPostLoginAsync()
    {
        if (!adminSession.SignIn(Password))
        {
            ErrorMessage = "Mật khẩu admin không đúng.";
            return Page();
        }

        await LoadCustomersAsync();
        return Page();
    }

    public IActionResult OnPostLogout()
    {
        adminSession.SignOut();
        return RedirectToPage();
    }

    private async Task LoadCustomersAsync()
    {
        var registeredCustomers = await db.Customers
            .AsNoTracking()
            .Select(customer => new CustomerListItem
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Email = customer.Email,
                LoyaltyPoints = customer.LoyaltyPoints,
                CreatedAtUtc = customer.CreatedAtUtc,
                OrderCount = db.Orders.Count(order => order.Phone == customer.Phone),
                TotalSpent = db.Orders
                    .Where(order => order.Phone == customer.Phone)
                    .Sum(order => (decimal?)order.Total) ?? 0
            })
            .ToListAsync();

        var knownPhones = registeredCustomers.Select(customer => customer.Phone).ToHashSet();
        var guestCustomers = await db.Orders
            .AsNoTracking()
            .Where(order => !knownPhones.Contains(order.Phone))
            .GroupBy(order => new { order.Phone, order.CustomerName, order.Email })
            .Select(group => new CustomerListItem
            {
                Id = 0,
                FullName = group.Key.CustomerName,
                Phone = group.Key.Phone,
                Email = group.Key.Email,
                LoyaltyPoints = 0,
                CreatedAtUtc = group.Min(order => order.CreatedAtUtc),
                OrderCount = group.Count(),
                TotalSpent = group.Sum(order => order.Total)
            })
            .ToListAsync();

        Customers = registeredCustomers
            .Concat(guestCustomers)
            .OrderByDescending(customer => customer.CreatedAtUtc)
            .Take(200)
            .ToList();
    }
}

public class CustomerListItem
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public int LoyaltyPoints { get; set; }

    public int OrderCount { get; set; }

    public decimal TotalSpent { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
