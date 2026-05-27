using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CoPuree.Web.Pages;

public class CartModel(CartService cartService) : PageModel
{
    public CartSummary Cart { get; set; } = new();

    public async Task OnGetAsync()
    {
        Cart = await cartService.GetCartAsync();
    }

    public IActionResult OnPostUpdate(int productId, int quantity)
    {
        cartService.Update(productId, quantity);

        return RedirectToPage();
    }

    public IActionResult OnPostRemove(int productId)
    {
        cartService.Remove(productId);

        return RedirectToPage();
    }
}
