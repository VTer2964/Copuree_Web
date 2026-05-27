using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class CustomerDetailModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public int Points { get; set; }

    [BindProperty]
    public string Note { get; set; } = string.Empty;

    public Customer? Customer { get; set; }

    public string Phone { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public int LoyaltyPoints { get; set; }

    public List<Order> Orders { get; set; } = [];

    public List<CustomerAddress> Addresses { get; set; } = [];

    public List<LoyaltyTransaction> LoyaltyTransactions { get; set; } = [];

    public async Task<IActionResult> OnGetAsync(string phone)
    {
        if (!adminSession.IsAuthenticated)
        {
            return RedirectToPage("/Admin/Orders");
        }

        await LoadAsync(phone);
        return string.IsNullOrWhiteSpace(Phone) ? NotFound() : Page();
    }

    public async Task<IActionResult> OnPostAdjustPointsAsync(string phone)
    {
        if (!adminSession.IsAuthenticated)
        {
            return RedirectToPage("/Admin/Orders");
        }

        if (Points == 0)
        {
            await LoadAsync(phone);
            ModelState.AddModelError(string.Empty, "Nhập số điểm khác 0.");
            return Page();
        }

        var customer = await FindOrCreateCustomerFromPhoneAsync(phone);
        customer.LoyaltyPoints += Points;
        if (customer.LoyaltyPoints < 0)
        {
            customer.LoyaltyPoints = 0;
        }

        db.LoyaltyTransactions.Add(new LoyaltyTransaction
        {
            Customer = customer,
            Points = Points,
            Type = LoyaltyTransactionType.Adjust,
            Note = string.IsNullOrWhiteSpace(Note) ? "Admin điều chỉnh điểm" : Note.Trim()
        });

        await db.SaveChangesAsync();
        return RedirectToPage(new { phone });
    }

    private async Task LoadAsync(string phone)
    {
        Phone = phone.Trim();
        if (string.IsNullOrWhiteSpace(Phone))
        {
            return;
        }

        Customer = await db.Customers.FirstOrDefaultAsync(customer => customer.Phone == Phone);
        Orders = await db.Orders
            .Include(order => order.Items)
            .Where(order => order.Phone == Phone)
            .OrderByDescending(order => order.CreatedAtUtc)
            .ToListAsync();

        if (Customer is null && !Orders.Any())
        {
            Phone = string.Empty;
            return;
        }

        DisplayName = Customer?.FullName ?? Orders.First().CustomerName;
        Email = Customer?.Email ?? Orders.FirstOrDefault(order => !string.IsNullOrWhiteSpace(order.Email))?.Email;
        LoyaltyPoints = Customer?.LoyaltyPoints ?? 0;

        if (Customer is not null)
        {
            Addresses = await db.CustomerAddresses
                .Where(address => address.CustomerId == Customer.Id)
                .OrderByDescending(address => address.IsDefault)
                .ThenByDescending(address => address.CreatedAtUtc)
                .ToListAsync();

            LoyaltyTransactions = await db.LoyaltyTransactions
                .Where(transaction => transaction.CustomerId == Customer.Id)
                .OrderByDescending(transaction => transaction.CreatedAtUtc)
                .ToListAsync();
        }
    }

    private async Task<Customer> FindOrCreateCustomerFromPhoneAsync(string phone)
    {
        var normalizedPhone = phone.Trim();
        var customer = await db.Customers.FirstOrDefaultAsync(item => item.Phone == normalizedPhone);
        if (customer is not null)
        {
            return customer;
        }

        var latestOrder = await db.Orders
            .Where(order => order.Phone == normalizedPhone)
            .OrderByDescending(order => order.CreatedAtUtc)
            .FirstOrDefaultAsync();

        if (latestOrder is null)
        {
            throw new InvalidOperationException("Không tìm thấy khách hàng.");
        }

        customer = new Customer
        {
            FullName = latestOrder.CustomerName,
            Phone = latestOrder.Phone,
            Email = latestOrder.Email,
            CreatedAtUtc = DateTime.UtcNow
        };

        db.Customers.Add(customer);
        await db.SaveChangesAsync();

        var oldOrders = await db.Orders
            .Where(order => order.Phone == normalizedPhone && order.CustomerId == null)
            .ToListAsync();
        foreach (var order in oldOrders)
        {
            order.CustomerId = customer.Id;
        }

        return customer;
    }
}
