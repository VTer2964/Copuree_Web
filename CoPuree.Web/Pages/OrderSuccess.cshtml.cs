using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CoPuree.Web.Pages;

public class OrderSuccessModel(AppDbContext db, IOptions<BankTransferOptions> bankTransferOptions) : PageModel
{
    public Order Order { get; set; } = new();

    public BankTransferOptions BankTransfer { get; set; } = bankTransferOptions.Value;

    public async Task<IActionResult> OnGetAsync(string orderNumber)
    {
        var order = await db.Orders
            .Include(item => item.Items)
            .FirstOrDefaultAsync(item => item.OrderNumber == orderNumber);

        if (order is null)
        {
            return NotFound();
        }

        Order = order;
        return Page();
    }
}
