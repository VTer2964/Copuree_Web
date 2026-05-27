using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages;

public class IndexModel(AppDbContext db, CartService cartService) : PageModel
{
    public List<Product> FeaturedProducts { get; set; } = [];

    public async Task OnGetAsync()
    {
        FeaturedProducts = await db.Products
            .Where(product => product.IsFeatured)
            .OrderBy(product => product.Price)
            .ToListAsync();
    }

    public IActionResult OnPostAddToCart(int productId, int quantity = 1)
    {
        cartService.Add(productId, quantity);

        return RedirectToPage("/Cart");
    }
}
