using CoPuree.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.EnsureCreatedAsync();
        await EnsureCustomerSchemaAsync(db);
        await EnsureProductSchemaAsync(db);
        await EnsureBankTransferSchemaAsync(db);

        await EnsureCatalogProductsAsync(db);
        await EnsureBankTransferSettingAsync(db);
        await RemoveLegacyDemoProductsAsync(db);

        await db.SaveChangesAsync();
    }

    private static async Task EnsureCustomerSchemaAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "Customers" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_Customers" PRIMARY KEY AUTOINCREMENT,
                "FullName" TEXT NOT NULL,
                "Phone" TEXT NOT NULL,
                "Email" TEXT NULL,
                "GoogleId" TEXT NULL,
                "AvatarUrl" TEXT NULL,
                "LoyaltyPoints" INTEGER NOT NULL DEFAULT 0,
                "CreatedAtUtc" TEXT NOT NULL,
                "LastLoginAtUtc" TEXT NULL
            );
            """);

        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "CustomerAddresses" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_CustomerAddresses" PRIMARY KEY AUTOINCREMENT,
                "CustomerId" INTEGER NOT NULL,
                "ReceiverName" TEXT NOT NULL,
                "Phone" TEXT NOT NULL,
                "Province" TEXT NOT NULL,
                "District" TEXT NOT NULL,
                "Ward" TEXT NOT NULL,
                "AddressLine" TEXT NOT NULL,
                "IsDefault" INTEGER NOT NULL DEFAULT 0,
                "CreatedAtUtc" TEXT NOT NULL,
                CONSTRAINT "FK_CustomerAddresses_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE CASCADE
            );
            """);

        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "LoyaltyTransactions" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_LoyaltyTransactions" PRIMARY KEY AUTOINCREMENT,
                "CustomerId" INTEGER NOT NULL,
                "OrderId" INTEGER NULL,
                "Points" INTEGER NOT NULL,
                "Type" INTEGER NOT NULL,
                "Note" TEXT NOT NULL,
                "CreatedAtUtc" TEXT NOT NULL,
                CONSTRAINT "FK_LoyaltyTransactions_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_LoyaltyTransactions_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE SET NULL
            );
            """);

        if (!await HasColumnAsync(db, "Orders", "CustomerId"))
        {
            await db.Database.ExecuteSqlRawAsync("""ALTER TABLE "Orders" ADD COLUMN "CustomerId" INTEGER NULL;""");
        }

        await db.Database.ExecuteSqlRawAsync("""CREATE UNIQUE INDEX IF NOT EXISTS "IX_Customers_Phone" ON "Customers" ("Phone");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_Customers_Email" ON "Customers" ("Email");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_Customers_GoogleId" ON "Customers" ("GoogleId");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_CustomerAddresses_CustomerId" ON "CustomerAddresses" ("CustomerId");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_LoyaltyTransactions_CustomerId" ON "LoyaltyTransactions" ("CustomerId");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_LoyaltyTransactions_OrderId" ON "LoyaltyTransactions" ("OrderId");""");
    }

    private static async Task EnsureProductSchemaAsync(AppDbContext db)
    {
        if (!await HasColumnAsync(db, "Products", "LowStockThreshold"))
        {
            await db.Database.ExecuteSqlRawAsync("""ALTER TABLE "Products" ADD COLUMN "LowStockThreshold" INTEGER NOT NULL DEFAULT 10;""");
        }

        if (!await HasColumnAsync(db, "Products", "IsPublished"))
        {
            await db.Database.ExecuteSqlRawAsync("""ALTER TABLE "Products" ADD COLUMN "IsPublished" INTEGER NOT NULL DEFAULT 1;""");
        }
    }

    private static async Task EnsureBankTransferSchemaAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "BankTransferSettings" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_BankTransferSettings" PRIMARY KEY,
                "BankName" TEXT NOT NULL,
                "AccountNumber" TEXT NOT NULL,
                "AccountName" TEXT NOT NULL,
                "Branch" TEXT NOT NULL,
                "QrImageUrl" TEXT NOT NULL,
                "TransferContentPrefix" TEXT NOT NULL,
                "UpdatedAtUtc" TEXT NOT NULL
            );
            """);

        if (!await HasColumnAsync(db, "BankTransferSettings", "TransferContentPrefix"))
        {
            await db.Database.ExecuteSqlRawAsync("""ALTER TABLE "BankTransferSettings" ADD COLUMN "TransferContentPrefix" TEXT NOT NULL DEFAULT 'COPUREE';""");
        }
    }

    private static async Task<bool> HasColumnAsync(AppDbContext db, string tableName, string columnName)
    {
        await using var connection = db.Database.GetDbConnection();
        if (connection.State != System.Data.ConnectionState.Open)
        {
            await connection.OpenAsync();
        }

        await using var command = connection.CreateCommand();
        command.CommandText = $"PRAGMA table_info('{tableName}')";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            if (string.Equals(reader.GetString(1), columnName, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static async Task EnsureCatalogProductsAsync(AppDbContext db)
    {
        var catalogProducts = new[]
        {
            new
            {
                Slug = "copuree-dau-dua-ep-lanh-100ml",
                LegacySlug = string.Empty,
                Name = "CoPuree - Dầu Dừa Ép Lạnh 100ml",
                Size = "100ml",
                Price = 59000m,
                Badge = "Dùng thử",
                Featured = false
            },
            new
            {
                Slug = "copuree-dau-dua-ep-lanh-300ml",
                LegacySlug = "copuree-dau-dua-tinh-khiet-ep-lanh",
                Name = "CoPuree - Dầu Dừa Ép Lạnh 300ml",
                Size = "300ml",
                Price = 159000m,
                Badge = "Sản phẩm chính",
                Featured = true
            },
            new
            {
                Slug = "copuree-dau-dua-ep-lanh-500ml",
                LegacySlug = string.Empty,
                Name = "CoPuree - Dầu Dừa Ép Lạnh 500ml",
                Size = "500ml",
                Price = 199000m,
                Badge = "Tiết kiệm",
                Featured = false
            }
        };

        foreach (var item in catalogProducts)
        {
            var product = await db.Products.FirstOrDefaultAsync(product =>
                product.Slug == item.Slug || product.Slug == item.LegacySlug);
            if (product is null)
            {
                product = new Product
                {
                    Slug = item.Slug,
                    StockQuantity = 100,
                    LowStockThreshold = 10
                };
                db.Products.Add(product);
            }

            product.Slug = item.Slug;
            product.Name = item.Name;
            product.ShortDescription = "Dầu dừa ép lạnh hương dịu, chất dầu trong, dễ dùng cho tóc, da khô và những phút chăm sóc hằng ngày.";
            product.Description = "CoPuree được làm từ trái dừa Việt Nam bằng phương pháp ép lạnh, giữ lại cảm giác nguyên chất và hương dừa nhẹ tự nhiên. Một chai dầu dừa gọn đẹp để bạn đặt cạnh bàn trang điểm, góc phòng tắm hoặc mang theo trong những ngày cần chăm mình nhiều hơn.";
            product.Size = item.Size;
            product.Price = item.Price;
            product.CompareAtPrice = null;
            product.LowStockThreshold = product.LowStockThreshold <= 0 ? 10 : product.LowStockThreshold;
            product.IsPublished = true;
            product.IsFeatured = item.Featured;
            product.Badge = item.Badge;
            product.ImageUrl = "/images/catalog/catalog-page2-image2.png";
        }
    }

    private static async Task EnsureBankTransferSettingAsync(AppDbContext db)
    {
        if (await db.BankTransferSettings.AnyAsync())
        {
            return;
        }

        db.BankTransferSettings.Add(new BankTransferSetting
        {
            Id = 1,
            BankName = "MB Bank",
            AccountNumber = "0000000000",
            AccountName = "COPUREE",
            Branch = "Ho Chi Minh",
            QrImageUrl = string.Empty,
            TransferContentPrefix = "COPUREE",
            UpdatedAtUtc = DateTime.UtcNow
        });
    }

    private static async Task RemoveLegacyDemoProductsAsync(AppDbContext db)
    {
        var legacySlugs = new[]
        {
            "copuree-virgin-coconut-oil",
            "copuree-coconut-oil-mini",
            "copuree-family-pack"
        };

        var legacyProducts = await db.Products
            .Where(product => legacySlugs.Contains(product.Slug))
            .ToListAsync();

        foreach (var product in legacyProducts)
        {
            var hasOrderItems = await db.OrderItems.AnyAsync(item => item.ProductId == product.Id);
            if (!hasOrderItems)
            {
                db.Products.Remove(product);
                continue;
            }

            product.IsPublished = false;
            product.IsFeatured = false;
            product.Badge = "Đã ẩn";
        }
    }
}
