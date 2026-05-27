using System.Text.Json;
using CoPuree.Web.Data;
using CoPuree.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Services;

public class CartService(IHttpContextAccessor httpContextAccessor, AppDbContext db)
{
    private const string CartSessionKey = "copuree.cart";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<CartSummary> GetCartAsync()
    {
        var lines = GetLines();
        if (lines.Count == 0)
        {
            return new CartSummary();
        }

        var productIds = lines.Select(line => line.ProductId).ToList();
        var products = await db.Products
            .Where(product => productIds.Contains(product.Id))
            .ToDictionaryAsync(product => product.Id);

        return new CartSummary
        {
            Items = lines
                .Where(line => products.ContainsKey(line.ProductId))
                .Select(line => new CartItem
                {
                    Product = products[line.ProductId],
                    Quantity = Math.Clamp(line.Quantity, 1, Math.Min(99, Math.Max(1, products[line.ProductId].StockQuantity)))
                })
                .ToList()
        };
    }

    public void Add(int productId, int quantity)
    {
        var lines = GetLines();
        var existing = lines.FirstOrDefault(line => line.ProductId == productId);

        if (existing is null)
        {
            lines.Add(new CartLine { ProductId = productId, Quantity = Math.Clamp(quantity, 1, 99) });
        }
        else
        {
            existing.Quantity = Math.Clamp(existing.Quantity + quantity, 1, 99);
        }

        SaveLines(lines);
    }

    public void Update(int productId, int quantity)
    {
        var lines = GetLines();
        var existing = lines.FirstOrDefault(line => line.ProductId == productId);

        if (existing is null)
        {
            return;
        }

        if (quantity <= 0)
        {
            lines.Remove(existing);
        }
        else
        {
            existing.Quantity = Math.Clamp(quantity, 1, 99);
        }

        SaveLines(lines);
    }

    public void Remove(int productId)
    {
        var lines = GetLines();
        lines.RemoveAll(line => line.ProductId == productId);
        SaveLines(lines);
    }

    public void Clear() => SaveLines([]);

    private List<CartLine> GetLines()
    {
        var session = httpContextAccessor.HttpContext?.Session;
        var json = session?.GetString(CartSessionKey);

        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        return JsonSerializer.Deserialize<List<CartLine>>(json, JsonOptions) ?? [];
    }

    private void SaveLines(List<CartLine> lines)
    {
        var session = httpContextAccessor.HttpContext?.Session;
        session?.SetString(CartSessionKey, JsonSerializer.Serialize(lines, JsonOptions));
    }
}
