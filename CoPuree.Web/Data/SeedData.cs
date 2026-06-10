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
        await EnsureArticleSchemaAsync(db);

        await EnsureCatalogProductsAsync(db);
        await EnsureCleanArticleCopyAsync(db);
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

    private static async Task EnsureArticleSchemaAsync(AppDbContext db)
    {
        await db.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS "Articles" (
                "Id" INTEGER NOT NULL CONSTRAINT "PK_Articles" PRIMARY KEY AUTOINCREMENT,
                "Title" TEXT NOT NULL,
                "Slug" TEXT NOT NULL,
                "CategorySlug" TEXT NOT NULL,
                "CategoryName" TEXT NOT NULL,
                "Excerpt" TEXT NOT NULL,
                "Content" TEXT NOT NULL,
                "ImageUrl" TEXT NOT NULL,
                "ImageAlt" TEXT NOT NULL,
                "IsPublished" INTEGER NOT NULL DEFAULT 1,
                "IsFeatured" INTEGER NOT NULL DEFAULT 0,
                "CreatedAtUtc" TEXT NOT NULL,
                "UpdatedAtUtc" TEXT NOT NULL
            );
            """);

        await db.Database.ExecuteSqlRawAsync("""CREATE UNIQUE INDEX IF NOT EXISTS "IX_Articles_Slug" ON "Articles" ("Slug");""");
        await db.Database.ExecuteSqlRawAsync("""CREATE INDEX IF NOT EXISTS "IX_Articles_CategorySlug" ON "Articles" ("CategorySlug");""");
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

    private static async Task EnsureCleanArticleCopyAsync(AppDbContext db)
    {
        var articles = new[]
        {
            new
            {
                Title = "Ủ tóc khô xơ với dầu dừa ép lạnh sao cho tóc mềm mà không bết",
                Slug = "cach-dung-dau-dua-ep-lanh-cho-toc-kho-xo",
                CategorySlug = "cham-soc-toc",
                CategoryName = "Chăm sóc tóc",
                Excerpt = "Bí quyết dùng dầu dừa như một bước ủ trước khi gội để tóc khô xơ có cảm giác mềm, bóng và dễ vào nếp hơn.",
                ImageUrl = "/images/copuree-pdf/pdf-page9-image1.png",
                Content = "Dầu dừa được yêu thích trong chăm sóc tóc vì kết cấu giàu acid béo, dễ bám lên thân tóc và giúp sợi tóc có cảm giác mềm mượt hơn sau khi gội. Với tóc khô xơ, phần cần chăm nhất thường không phải da đầu mà là thân tóc và ngọn tóc - nơi dễ mất độ bóng, dễ rối và dễ gãy khi chải.\n\nCách dùng đẹp nhất là ủ trước khi gội. Lấy một lượng nhỏ dầu dừa CoPuree, làm ấm giữa hai lòng bàn tay rồi vuốt từ giữa thân tóc xuống ngọn tóc. Nếu tóc dày hoặc tẩy nhuộm, có thể tăng lượng từng chút; nếu tóc mỏng, hãy bắt đầu thật ít để tránh nặng tóc. Ủ trong 15-30 phút, sau đó gội sạch bằng dầu gội dịu nhẹ. Với phần ngọn tóc rất khô, bạn có thể xoa một giọt dầu cực mỏng khi tóc gần khô để tạo độ bóng nhẹ.\n\nTần suất phù hợp là 1-2 lần mỗi tuần. Không cần dùng nhiều trong một lần; hiệu quả nằm ở việc dùng đều, đúng vùng tóc cần chăm và xả sạch sau khi ủ. Nếu da đầu dễ dầu hoặc dễ nổi mụn ở viền tóc, hãy tránh thoa sát chân tóc. Một chai dầu dừa ép lạnh nhỏ gọn có thể trở thành bước chăm tóc cuối tuần: không cầu kỳ, không nặng mùi, chỉ vừa đủ để mái tóc nhìn mềm và có sức sống hơn."
            },
            new
            {
                Title = "Làm mềm vùng da khô bằng dầu dừa: ít thôi nhưng đúng lúc",
                Slug = "duong-am-vung-da-kho-bang-dau-dua",
                CategorySlug = "cham-soc-da",
                CategoryName = "Chăm sóc da",
                Excerpt = "Một cách dùng tinh gọn cho khuỷu tay, gót chân, đầu gối và những vùng da thường khô ráp khi thời tiết thay đổi.",
                ImageUrl = "/images/copuree-pdf/pdf-page6-image1.png",
                Content = "Dầu dừa không cần xuất hiện như một bước chăm da phức tạp. Khi dùng đúng lượng, dầu dừa hoạt động như một lớp làm mềm và khóa ẩm nhẹ trên bề mặt, đặc biệt phù hợp với những vùng da dày, dễ khô như khuỷu tay, đầu gối, gót chân hoặc mu bàn tay.\n\nThời điểm lý tưởng là sau khi tắm hoặc rửa tay, khi da còn hơi ẩm. Lấy một lượng rất nhỏ dầu dừa CoPuree, xoa đều trong lòng bàn tay rồi massage mỏng lên vùng da khô trong 30-60 giây. Với gót chân, có thể thoa trước khi ngủ và mang vớ mỏng để dầu có thời gian thấm vào lớp da khô. Với tay, chỉ cần một lớp thật mỏng để da mềm hơn mà không để lại cảm giác trơn nặng.\n\nDầu dừa có thể không phù hợp với mọi loại da mặt, đặc biệt là da dễ bít tắc hoặc đang có mụn. Vì vậy, CoPuree khuyên bạn bắt đầu ở vùng da cơ thể trước, thử trên một vùng nhỏ và quan sát phản ứng của da. Khi dùng đúng chỗ, đúng lượng, dầu dừa trở thành một chi tiết nhỏ nhưng dễ thương trong góc chăm sóc cá nhân: vừa đủ mềm, vừa đủ thơm, vừa đủ tự nhiên."
            },
            new
            {
                Title = "Oil pulling với dầu dừa: thói quen buổi sáng cần hiểu đúng",
                Slug = "oil-pulling-voi-dau-dua-ep-lanh",
                CategorySlug = "cham-soc-rang-mieng",
                CategoryName = "Chăm sóc răng miệng",
                Excerpt = "Oil pulling có thể là một nghi thức chăm sóc cá nhân, nhưng không thay thế đánh răng, dùng chỉ nha khoa hay khám răng định kỳ.",
                ImageUrl = "/images/copuree-pdf/pdf-page8-image1.png",
                Content = "Oil pulling là thói quen súc một lượng nhỏ dầu ăn được trong khoang miệng trong vài phút. Nhiều người chọn dầu dừa vì hương dễ chịu và cảm giác sạch miệng sau khi súc. Tuy vậy, các khuyến nghị nha khoa hiện nay vẫn nhấn mạnh rằng oil pulling không thay thế việc đánh răng hai lần mỗi ngày với kem đánh răng có fluoride, làm sạch kẽ răng và khám nha khoa định kỳ.\n\nNếu muốn thử, hãy bắt đầu nhẹ nhàng. Dùng khoảng 1 thìa cà phê dầu dừa CoPuree, súc chậm trong 3-5 phút rồi nhổ vào khăn giấy hoặc thùng rác, không nhổ xuống bồn rửa vì dầu có thể gây bám đường ống. Sau đó súc miệng lại bằng nước và đánh răng như bình thường. Khi đã quen, bạn có thể tăng thời gian, nhưng không cần ép bản thân phải súc quá lâu.\n\nĐiều quan trọng nhất là không nuốt dầu sau khi súc và không dùng oil pulling để xử lý đau răng, viêm nướu, sâu răng hoặc hơi thở có mùi kéo dài. Những trường hợp đó cần được nha sĩ kiểm tra. Hãy xem oil pulling như một nghi thức chậm rãi vào buổi sáng: thêm cảm giác tươi mới, thêm mùi dừa dịu, nhưng vẫn đứng sau các bước chăm sóc răng miệng đã được chứng minh."
            },
            new
            {
                Title = "Dầu dừa trong căn bếp: thêm hương béo nhẹ cho món quen",
                Slug = "dung-dau-dua-trong-nau-an-va-lam-banh",
                CategorySlug = "nau-an-lam-banh",
                CategoryName = "Nấu ăn và làm bánh",
                Excerpt = "Từ bánh chuối, granola đến món áp chảo nhẹ, dầu dừa giúp căn bếp có thêm một lớp hương thơm ấm và tự nhiên.",
                ImageUrl = "/images/copuree-pdf/pdf-page5-image2.png",
                Content = "Trong nấu ăn, dầu dừa hấp dẫn nhất ở hương thơm. Chỉ một lượng nhỏ cũng có thể làm món bánh, granola, khoai lang nướng, pancake hoặc món áp chảo nhẹ có cảm giác béo ấm và gần gũi hơn. Với những công thức có chuối, yến mạch, cacao, mè, đậu phộng hoặc trái cây nhiệt đới, hương dừa thường hòa vào rất tự nhiên.\n\nBạn có thể dùng dầu dừa CoPuree để thay một phần chất béo trong bánh hoặc dùng một lớp mỏng khi áp chảo ở nhiệt độ vừa. Với món nướng, hãy làm tan dầu dừa trước nếu công thức cần chất béo dạng lỏng; với granola, trộn dầu cùng mật ong hoặc đường nâu để yến mạch áo đều và thơm hơn. Vì dầu dừa có hương riêng, hãy bắt đầu bằng lượng nhỏ, nếm và điều chỉnh theo khẩu vị gia đình.\n\nDầu dừa nguyên chất thường phù hợp hơn với nướng bánh, trộn granola hoặc áp chảo nhẹ, không phải lựa chọn tối ưu cho chiên ngập dầu hay nhiệt quá cao trong thời gian dài. Khi được dùng đúng món, dầu dừa không lấn át nguyên liệu mà chỉ để lại một hậu vị mềm, thơm và có chút gợi nhớ đến căn bếp nhiệt đới."
            },
            new
            {
                Title = "CoPuree có mặt tại các cửa hàng đối tác đầu tiên",
                Slug = "copuree-co-mat-tai-cac-cua-hang-doi-tac-dau-tien",
                CategorySlug = "hoat-dong-thuong-hieu",
                CategoryName = "Hoạt động thương hiệu",
                Excerpt = "Một cột mốc mới khi CoPuree bắt đầu được trưng bày trực tiếp tại các điểm bán chọn lọc.",
                ImageUrl = "/images/copuree-pdf/pdf-page11-image1.png",
                Content = "CoPuree bắt đầu xuất hiện tại những điểm bán đối tác đầu tiên để khách hàng có thể nhìn bao bì, cầm sản phẩm trên tay và cảm nhận trực tiếp tinh thần của thương hiệu: sạch, tinh gọn và gần gũi với đời sống hằng ngày.\n\nVới CoPuree, mỗi điểm bán không chỉ là nơi trưng bày một chai dầu dừa ép lạnh. Đó còn là cơ hội để khách hàng hỏi thêm về cách dùng cho tóc, da, răng miệng hoặc căn bếp; là nơi sản phẩm bước ra khỏi màn hình và trở thành một lựa chọn thật trong nhịp mua sắm thường ngày.\n\nSự hiện diện đầu tiên này là một cột mốc nhỏ nhưng có ý nghĩa. CoPuree sẽ tiếp tục chọn lọc các đối tác phù hợp, ưu tiên không gian bán hàng chỉn chu và có khả năng tư vấn đúng tinh thần sản phẩm, để dầu dừa ép lạnh đến gần hơn với những người yêu lối sống tự nhiên."
            }
        };

        foreach (var item in articles)
        {
            var article = await db.Articles.FirstOrDefaultAsync(article => article.Slug == item.Slug);
            if (article is null)
            {
                article = new Article
                {
                    Slug = item.Slug,
                    CreatedAtUtc = DateTime.UtcNow
                };
                db.Articles.Add(article);
            }

            article.Title = item.Title;
            article.CategorySlug = item.CategorySlug;
            article.CategoryName = item.CategoryName;
            article.Excerpt = item.Excerpt;
            article.Content = item.Content;
            article.ImageUrl = item.ImageUrl;
            article.ImageAlt = item.Title;
            article.IsPublished = true;
            article.IsFeatured = true;
            article.UpdatedAtUtc = DateTime.UtcNow;
        }
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
