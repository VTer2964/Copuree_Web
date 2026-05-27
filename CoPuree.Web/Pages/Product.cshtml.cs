using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages;

public class ProductModel(AppDbContext db, CartService cartService) : PageModel
{
    public Product Product { get; set; } = new();

    public async Task<IActionResult> OnGetAsync(string slug)
    {
        var product = await db.Products.FirstOrDefaultAsync(item => item.Slug == slug);
        if (product is null)
        {
            return NotFound();
        }

        Product = product;
        return Page();
    }

    public IActionResult OnPostAddToCart(int productId, int quantity = 1)
    {
        cartService.Add(productId, quantity);

        return RedirectToPage("/Cart");
    }
}
