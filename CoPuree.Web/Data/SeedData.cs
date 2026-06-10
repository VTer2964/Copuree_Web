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
                Name = "CoPuree - Dáº§u Dá»«a Ã‰p Láº¡nh 100ml",
                Size = "100ml",
                Price = 59000m,
                Badge = "DÃ¹ng thá»­",
                Featured = false
            },
            new
            {
                Slug = "copuree-dau-dua-ep-lanh-300ml",
                LegacySlug = "copuree-dau-dua-tinh-khiet-ep-lanh",
                Name = "CoPuree - Dáº§u Dá»«a Ã‰p Láº¡nh 300ml",
                Size = "300ml",
                Price = 159000m,
                Badge = "Sáº£n pháº©m chÃ­nh",
                Featured = true
            },
            new
            {
                Slug = "copuree-dau-dua-ep-lanh-500ml",
                LegacySlug = string.Empty,
                Name = "CoPuree - Dáº§u Dá»«a Ã‰p Láº¡nh 500ml",
                Size = "500ml",
                Price = 199000m,
                Badge = "Tiáº¿t kiá»‡m",
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
            product.ShortDescription = "Dáº§u dá»«a Ã©p láº¡nh hÆ°Æ¡ng dá»‹u, cháº¥t dáº§u trong, dá»… dÃ¹ng cho tÃ³c, da khÃ´ vÃ  nhá»¯ng phÃºt chÄƒm sÃ³c háº±ng ngÃ y.";
            product.Description = "CoPuree Ä‘Æ°á»£c lÃ m tá»« trÃ¡i dá»«a Viá»‡t Nam báº±ng phÆ°Æ¡ng phÃ¡p Ã©p láº¡nh, giá»¯ láº¡i cáº£m giÃ¡c nguyÃªn cháº¥t vÃ  hÆ°Æ¡ng dá»«a nháº¹ tá»± nhiÃªn. Má»™t chai dáº§u dá»«a gá»n Ä‘áº¹p Ä‘á»ƒ báº¡n Ä‘áº·t cáº¡nh bÃ n trang Ä‘iá»ƒm, gÃ³c phÃ²ng táº¯m hoáº·c mang theo trong nhá»¯ng ngÃ y cáº§n chÄƒm mÃ¬nh nhiá»u hÆ¡n.";
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
                Title = """
                CÃ¡ch á»¦ TÃ³c Báº±ng Dáº§u Dá»«a Trá»‹ Rá»¥ng TÃ³c Hiá»‡u Quáº£
                """,
                Slug = """
                cach-u-toc-bang-dau-dua-tri-rung-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                ChÄƒm sÃ³c tÃ³c
                """,
                Excerpt = """
                HÆ°á»›ng dáº«n chi tiáº¿t cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c hiá»‡u quáº£ táº¡i nhÃ , giÃºp nang tÃ³c cháº¯c khá»e, giáº£m gÃ£y rá»¥ng vÃ  nuÃ´i dÆ°á»¡ng da Ä‘áº§u tá»« sÃ¢u bÃªn trong.
                """,
                ImageUrl = """
                /images/áº¢nh Blog/1.1.png
                """,
                ImageAlt = """
                CÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c hiá»‡u quáº£ táº¡i nhÃ  cÃ¹ng CoPuree
                """,
                Content = """
                ## VÃ¬ sao rá»¥ng tÃ³c lÃ  ná»—i lo hÃ ng Ä‘áº§u?

                Rá»¥ng tÃ³c sau sinh hoáº·c do cÄƒng tháº³ng cÃ´ng viá»‡c lÃ  ná»—i Ã¡m áº£nh lá»›n cá»§a nhiá»u chá»‹ em phá»¥ ná»¯. Nhiá»u ngÆ°á»i thÆ°á»ng tÃ¬m Ä‘áº¿n cÃ¡c sáº£n pháº©m hÃ³a cháº¥t Ä‘áº¯t tiá»n nhÆ°ng láº¡i vÃ´ tÃ¬nh gÃ¢y háº¡i thÃªm cho da Ä‘áº§u nháº¡y cáº£m. Äá»ƒ giáº£i quyáº¿t táº­n gá»‘c, chÃºng ta cáº§n má»™t phÆ°Æ¡ng phÃ¡p tá»± nhiÃªn vÃ  an sau.

                ## HÆ°á»›ng dáº«n á»§ tÃ³c báº±ng dáº§u dá»«a phá»¥c há»“i nang tÃ³c

                Dáº§u dá»«a chá»©a hÃ m lÆ°á»£ng lá»›n Axit Lauric cÃ³ kháº£ nÄƒng tháº©m tháº¥u sÃ¢u vÃ o lÃµi tÃ³c, báº£o vá»‡ protein tÃ³c vÃ  kÃ­ch thÃ­ch nang tÃ³c phÃ¡t triá»ƒn. DÆ°á»›i Ä‘Ã¢y lÃ  quy trÃ¬nh trá»‹ liá»‡u rá»¥ng tÃ³c chuyÃªn sÃ¢u:

                ### BÆ°á»›c 1: Chuáº©n bá»‹ dáº§u dá»«a sáº¡ch

                Sá»­ dá»¥ng dáº§u dá»«a Ã©p láº¡nh tinh khiáº¿t. Cho má»™t lÆ°á»£ng khoáº£ng 10-15ml dáº§u dá»«a ra chÃ©n nhá». LÃ m áº¥m dáº§u dá»«a báº±ng cÃ¡ch ngÃ¢m chÃ©n vÃ o nÆ°á»›c áº¥m khoáº£ng 2 phÃºt giÃºp dáº§u tÄƒng kháº£ nÄƒng tháº©m tháº¥u.

                ### BÆ°á»›c 2: Thoa dáº§u dá»«a lÃªn chÃ¢n tÃ³c vÃ  da Ä‘áº§u

                TÃ¡ch tÃ³c thÃ nh tá»«ng pháº§n nhá», dÃ¹ng tÄƒm bÃ´ng hoáº·c thÃ¬a láº¥y dáº§u thoa trá»±c tiáº¿p lÃªn chÃ¢n tÃ³c vÃ  da Ä‘áº§u. Massage nháº¹ nhÃ ng báº±ng Ä‘áº§u ngÃ³n tay (khÃ´ng dÃ¹ng mÃ³ng tay) trong 5 phÃºt Ä‘á»ƒ kÃ­ch thÃ­ch tuáº§n hoÃ n mÃ¡u.

                ### BÆ°á»›c 3: á»¦ tÃ³c trong 20 phÃºt

                DÃ¹ng mÅ© táº¯m hoáº·c khÄƒn áº¥m quáº¥n quanh Ä‘áº§u vÃ  á»§ trong vÃ²ng 20 phÃºt. TrÃ¡nh á»§ quÃ¡ lÃ¢u hoáº·c Ä‘á»ƒ qua Ä‘Ãªm vÃ¬ cÃ³ thá»ƒ lÃ m bÃ­t táº¯c nang lÃ´ng gÃ¢y gÃ£y rá»¥ng.

                ![CÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c hiá»‡u quáº£](/images/áº¢nh Blog/1.2.jpg)

                ## CÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a chuáº©n vÃ  khÃ´ng bá»‹ báº¿t

                Nhiá»u ngÆ°á»i gáº·p tÃ¬nh tráº¡ng báº¿t tÃ³c sau khi á»§. BÃ­ quyáº¿t náº±m á»Ÿ bÆ°á»›c gá»™i sáº¡ch: sau khi á»§, hÃ£y thoa trá»±c tiáº¿p dáº§u gá»™i lÃªn tÃ³c khÃ´ khi chÆ°a xá»‹t nÆ°á»›c, xoa Ä‘á»u rá»“i má»›i xáº£ nÆ°á»›c áº¥m. Gá»™i láº¡i láº§n 2 Ä‘á»ƒ Ä‘áº£m báº£o dáº§u thá»«a Ä‘Æ°á»£c loáº¡i bá» hoÃ n toÃ n.

                Äá»ƒ biáº¿t thÃªm cÃ¡c máº¹o chÄƒm sÃ³c tÃ³c tá»‘i Æ°u khÃ¡c, hÃ£y [tham kháº£o cáº©m nang dÃ¹ng dáº§u dá»«a](/tin-tuc/cach-dung-dau-dua-duong-toc) Ä‘á»ƒ cÃ³ mÃ¡i tÃ³c bá»“ng bá»nh khá»e máº¡nh.
                """,
                IsFeatured = true,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:00:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Cáº©m Nang CÃ¡ch DÃ¹ng Dáº§u Dá»«a DÆ°á»¡ng TÃ³c ChuyÃªn SÃ¢u
                """,
                Slug = """
                cach-dung-dau-dua-duong-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                ChÄƒm sÃ³c tÃ³c
                """,
                Excerpt = """
                Cáº©m nang hÆ°á»›ng dáº«n toÃ n diá»‡n nháº¥t vá» cÃ¡ch dÃ¹ng dáº§u dá»«a dÆ°á»¡ng tÃ³c vÃ  cÃ¡ch dÆ°á»¡ng tÃ³c báº±ng dáº§u dá»«a an toÃ n, nuÃ´i dÆ°á»¡ng sá»£i tÃ³c suÃ´n mÆ°á»£t chuáº©n khoa há»c.
                """,
                ImageUrl = """
                /images/áº¢nh Blog/2.1.png
                """,
                ImageAlt = """
                Cáº©m nang cÃ¡ch dÃ¹ng dáº§u dá»«a dÆ°á»¡ng tÃ³c chuyÃªn sÃ¢u CoPuree
                """,
                Content = """
                ## DÆ°á»¡ng tÃ³c báº±ng dáº§u dá»«a: Lá»±a chá»n tá»± nhiÃªn thÃ´ng minh

                TÃ³c khÃ´ xÆ¡, cháº» ngá»n do uá»‘n nhuá»™m liÃªn tá»¥c lÃ  váº¥n Ä‘á» phá»• biáº¿n. Sá»­ dá»¥ng dáº§u dá»«a nguyÃªn cháº¥t Ã©p láº¡nh lÃ  liá»‡u phÃ¡p phá»¥c há»“i tá»± nhiÃªn vá»«a tiáº¿t kiá»‡m láº¡i cá»±c ká»³ hiá»‡u quáº£ náº¿u Ã¡p dá»¥ng Ä‘Ãºng cÃ¡ch.

                ## CÃ¡ch dÆ°á»¡ng tÃ³c báº±ng dáº§u dá»«a

                TÃ¹y theo tÃ¬nh tráº¡ng tÃ³c, báº¡n cÃ³ thá»ƒ Ã¡p dá»¥ng 2 cÃ¡ch dÆ°á»¡ng tÃ³c báº±ng dáº§u dá»«a sau:

                ### CÃ¡ch 1: DÆ°á»¡ng xáº£ khÃ´ (Leaving-in conditioner)

                Sau khi gá»™i Ä‘áº§u sáº¡ch vÃ  sáº¥y tÃ³c khÃ´ khoáº£ng 80%, láº¥y 1-2 giá»t dáº§u dá»«a Ã©p láº¡nh xoa Ä‘á»u trong lÃ²ng bÃ n tay rá»“i vuá»‘t nháº¹ lÃªn pháº§n Ä‘uÃ´i tÃ³c khÃ´ xÆ¡. CÃ¡ch nÃ y giÃºp giá»¯ áº©m vÃ  báº£o vá»‡ tÃ³c khá»i tia UV, nhiá»‡t Ä‘á»™ cao.

                ### CÃ¡ch 2: á»¦ tÃ³c chuyÃªn sÃ¢u trÆ°á»›c khi gá»™i

                Ãp dá»¥ng phÆ°Æ¡ng phÃ¡p Pre-shampoo: Thoa dáº§u dá»«a lÃªn tÃ³c khÃ´, massage da Ä‘áº§u vÃ  á»§ trong 20 phÃºt trÆ°á»›c khi bÆ°á»›c vÃ o bá»“n gá»™i. PhÆ°Æ¡ng phÃ¡p nÃ y giÃºp tÃ³c khÃ´ng bá»‹ máº¥t nÆ°á»›c khi tiáº¿p xÃºc vá»›i hÃ³a cháº¥t táº©y rá»­a máº¡nh trong dáº§u gá»™i.

                ![á»¦ tÃ³c báº±ng dáº§u dá»«a dÆ°á»¡ng tÃ³c suÃ´n mÆ°á»£t](/images/áº¢nh Blog/2.2.png)

                ## CÃ¡ch sá»­ dá»¥ng dáº§u dá»«a cho tÃ³c an toÃ n nháº¥t

                TrÃ¡nh thoa quÃ¡ nhiá»u dáº§u dá»«a trá»±c tiáº¿p lÃªn da Ä‘áº§u náº¿u báº¡n cÃ³ tuyáº¿n bÃ£ nhá»n hoáº¡t Ä‘á»™ng máº¡nh. HÃ£y táº­p trung dÆ°á»¡ng pháº§n thÃ¢n vÃ  Ä‘uÃ´i tÃ³c - nÆ¡i chá»‹u nhiá»u hÆ° tá»•n nháº¥t.

                Layout [tÃ¬m hiá»ƒu tÃ¡c dá»¥ng cá»§a dáº§u dá»«a](/tin-tuc/tac-dung-cua-dau-dua-voi-toc) Ä‘á»ƒ hiá»ƒu rÃµ hÆ¡n vá» máº·t khoa há»c táº¡i sao dáº§u dá»«a láº¡i cÃ³ cÃ´ng dá»¥ng vÆ°á»£t trá»™i so vá»›i cÃ¡c loáº¡i dáº§u thá»±c váº­t khÃ¡c.
                """,
                IsFeatured = true,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:05:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Giáº£i MÃ£ TÃ¡c Dá»¥ng Cá»§a Dáº§u Dá»«a Vá»›i TÃ³c
                """,
                Slug = """
                tac-dung-cua-dau-dua-voi-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                ChÄƒm sÃ³c tÃ³c
                """,
                Excerpt = """
                PhÃ¢n tÃ­ch khoa há»c chuyÃªn sÃ¢u vá» tÃ¡c dá»¥ng cá»§a dáº§u dá»«a vá»›i tÃ³c vÃ  cÆ¡ cháº¿ phá»¥c há»“i lÃµi tÃ³c tá»« Axit Lauric tá»± nhiÃªn khi duy trÃ¬ thÃ³i quen á»§ tÃ³c thÆ°á»ng xuyÃªn.
                """,
                ImageUrl = """
                /images/áº¢nh Blog/3.1.png
                """,
                ImageAlt = """
                CÆ¡ cháº¿ khoa há»c cá»§a tÃ¡c dá»¥ng cá»§a dáº§u dá»«a vá»›i tÃ³c cÃ¹ng CoPuree
                """,
                Content = """
                ## Khoa há»c Ä‘áº±ng sau tÃ¡c dá»¥ng cá»§a dáº§u dá»«a vá»›i tÃ³c

                KhÃ´ng pháº£i ngáº«u nhiÃªn mÃ  dáº§u dá»«a Ä‘Æ°á»£c xem lÃ  tháº§n dÆ°á»£c cho mÃ¡i tÃ³c. CÃ¡c nghiÃªn cá»©u sinh há»c chá»‰ ra ráº±ng dáº§u dá»«a cÃ³ cáº¥u trÃºc hÃ³a há»c Ä‘á»™c Ä‘Ã¡o giÃºp nÃ³ vÆ°á»£t trá»™i hÆ¡n cÃ¡c loáº¡i dáº§u khoÃ¡ng hay dáº§u háº¡t khÃ¡c trong viá»‡c báº£o vá»‡ tÃ³c khá»i hÆ° tá»•n.

                ![TÃ¡c dá»¥ng cá»§a dáº§u dá»«a phá»¥c há»“i lÃµi tÃ³c](/images/áº¢nh Blog/3.2.png)

                ## CÆ¡ cháº¿ Axit Lauric phá»¥c há»“i lÃµi tÃ³c khi á»§ tÃ³c vá»›i dáº§u dá»«a

                Dáº§u dá»«a ráº¥t giÃ u Axit Lauric (má»™t loáº¡i axit bÃ©o chuá»—i trung bÃ¬nh). Nhá» phÃ¢n tá»­ lÆ°á»£ng tháº¥p vÃ  cáº¥u trÃºc dáº¡ng chuá»—i tháº³ng, Axit Lauric dá»… dÃ ng xuyÃªn qua lá»›p biá»ƒu bÃ¬ tÃ³c bÃªn ngoÃ i Ä‘á»ƒ Ä‘i sÃ¢u vÃ o trong lÃµi tÃ³c (cortex).

                á»¦ tÃ³c vá»›i dáº§u dá»«a thÆ°á»ng xuyÃªn sáº½ táº¡o má»™t lá»›p mÃ ng lipid báº£o vá»‡ lÃµi tÃ³c, háº¡n cháº¿ sá»± trÆ°Æ¡ng ná»Ÿ cá»§a sá»£i tÃ³c khi gáº·p nÆ°á»›c (hygral fatigue) - nguyÃªn nhÃ¢n chÃ­nh gÃ¢y gÃ£y rá»¥ng tÃ³c khi gá»™i Ä‘áº§u. Äá»“ng thá»i ngÄƒn cháº·n viá»‡c tháº¥t thoÃ¡t protein tá»± nhiÃªn cá»§a sá»£i tÃ³c.

                Äá»ƒ sá»Ÿ há»¯u mÃ¡i tÃ³c cháº¯c khá»e tá»« gá»‘c tá»›i ngá»n, hÃ£y [xem cÃ¡c sáº£n pháº©m dáº§u dá»«a á»§ tÃ³c](/san-pham) Ã©p láº¡nh nguyÃªn cháº¥t CoPuree vá»›i thiáº¿t káº¿ hÅ© miá»‡ng rá»™ng thÃ´ng minh chá»‘ng Ä‘Ã´ng Ä‘áº·c hiá»‡u quáº£.
                """,
                IsFeatured = false,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:10:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                HÆ°á»›ng Dáº«n CÃ¡ch LÃ m Dáº§u Dá»«a Ã‰p Láº¡nh Táº¡i NhÃ 
                """,
                Slug = """
                cach-lam-dau-dua-ep-lanh-tai-nha
                """,
                CategorySlug = """
                nau-an-lam-banh
                """,
                CategoryName = """
                Náº¥u Äƒn vÃ  lÃ m bÃ¡nh
                """,
                Excerpt = """
                HÆ°á»›ng dáº«n chi tiáº¿t cÃ¡ch lÃ m dáº§u dá»«a Ã©p láº¡nh táº¡i nhÃ  Ä‘Æ¡n giáº£n báº±ng mÃ¡y Ã©p cÆ¡ há»c vÃ  so sÃ¡nh Æ°u nhÆ°á»£c Ä‘iá»ƒm vá»›i phÆ°Æ¡ng phÃ¡p náº¥u nÃ³ng truyá»n thá»‘ng.
                """,
                ImageUrl = """
                /images/copuree-pdf/pdf-page5-image2.png
                """,
                ImageAlt = """
                So sÃ¡nh cÃ¡ch lÃ m dáº§u dá»«a Ã©p láº¡nh táº¡i nhÃ  vÃ  Ä‘un nÃ³ng truyá»n thá»‘ng
                """,
                Content = """
                ## Xu hÆ°á»›ng tá»± lÃ m (DIY) má»¹ pháº©m thiÃªn nhiÃªn

                Gen Z hiá»‡n nay ráº¥t Æ°a chuá»™ng cÃ¡c phÆ°Æ¡ng phÃ¡p lÃ m Ä‘áº¹p DIY tá»± nhiÃªn vÃ¬ sá»£ hÃ³a cháº¥t báº£o quáº£n. Tá»± lÃ m dáº§u dá»«a Ã©p láº¡nh táº¡i nhÃ  lÃ  má»™t trong nhá»¯ng tráº£i nghiá»‡m thÃº vá»‹ giÃºp báº¡n cÃ³ nguá»“n nguyÃªn liá»‡u sáº¡ch Ä‘á»ƒ dÆ°á»¡ng da vÃ  cháº¿ biáº¿n mÃ³n Äƒn.

                ## So sÃ¡nh cÃ¡ch lÃ m dáº§u dá»«a Ã©p láº¡nh vÃ  phÆ°Æ¡ng phÃ¡p náº¥u dáº§u dá»«a truyá»n thá»‘ng

                ### PhÆ°Æ¡ng phÃ¡p náº¥u dáº§u dá»«a nhiá»‡t truyá»n thá»‘ng

                LÃ  phÆ°Æ¡ng phÃ¡p Ä‘un sÃ´i nÆ°á»›c cá»‘t dá»«a trÃªn báº¿p lá»­a cho Ä‘áº¿n khi dáº§u dá»«a tÃ¡ch ra vÃ  pháº§n bÃ£ dá»«a chuyá»ƒn mÃ u vÃ ng. PhÆ°Æ¡ng phÃ¡p nÃ y dá»… lÃ m nhÆ°ng nhiá»‡t Ä‘á»™ cao lÃ m biáº¿n tÃ­nh má»™t sá»‘ vitamin vÃ  lÃ m máº¥t Ä‘i mÃ¹i thÆ¡m dá»‹u nháº¹ nguyÃªn báº£n cá»§a dá»«a tÆ°Æ¡i.

                ### CÃ¡ch lÃ m dáº§u dá»«a Ã©p láº¡nh cÆ¡ há»c

                Sá»­ dá»¥ng mÃ¡y Ã©p trá»¥c vÃ­t mini Ä‘á»ƒ Ã©p cÆ¡m dá»«a Ä‘Ã£ sáº¥y láº¡nh. Dáº§u dá»«a thu Ä‘Æ°á»£c sáº½ Ä‘Æ°á»£c lá»c qua mÃ ng siÃªu má»‹n. PhÆ°Æ¡ng phÃ¡p nÃ y hoÃ n toÃ n khÃ´ng dÃ¹ng nhiá»‡t, giÃºp giá»¯ trá»n váº¹n 100% vitamin E tá»± nhiÃªn, mÃ u dáº§u trong suá»‘t vÃ  cÃ³ mÃ¹i hÆ°Æ¡ng dá»‹u ngá»t nhÆ° káº¹o dá»«a.

                Tuy nhiÃªn, tá»± lÃ m táº¡i nhÃ  thÆ°á»ng khÃ³ kiá»ƒm soÃ¡t Ä‘á»™ áº©m, khiáº¿n dáº§u dá»«a dá»… bá»‹ Ã´i thiu sau vÃ i tuáº§n. Náº¿u báº¡n báº­n rá»™n vÃ  cáº§n má»™t sáº£n pháº©m chuáº©n kiá»ƒm Ä‘á»‹nh, hÃ£y [tÃ¬m hiá»ƒu dáº§u dá»«a nguyÃªn cháº¥t](/) Ã©p láº¡nh CoPuree vá»›i cam káº¿t minh báº¡ch 100% khÃ´ng hÆ°Æ¡ng liá»‡u.
                """,
                IsFeatured = false,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:15:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                BÃ­ Quyáº¿t DÆ°á»¡ng Da Báº±ng Dáº§u Dá»«a SÃ¡ng Khá»e Tá»± NhiÃªn
                """,
                Slug = """
                duong-da-bang-dau-dua
                """,
                CategorySlug = """
                cham-soc-da
                """,
                CategoryName = """
                ChÄƒm sÃ³c da
                """,
                Excerpt = """
                KhÃ¡m phÃ¡ bÃ­ quyáº¿t dÆ°á»¡ng da báº±ng dáº§u dá»«a nguyÃªn cháº¥t Ã©p láº¡nh giÃºp cáº¥p áº©m vÆ°á»£t trá»™i, lÃ m dá»‹u da khÃ´ vÃ  chá»‘ng lÃ£o hÃ³a da an toÃ n hiá»‡u quáº£ ngay táº¡i nhÃ .
                """,
                ImageUrl = """
                /images/copuree-pdf/pdf-page6-image1.png
                """,
                ImageAlt = """
                BÃ­ quyáº¿t dÆ°á»¡ng da báº±ng dáº§u dá»«a Ã©p láº¡nh CoPuree hiá»‡u quáº£ táº¡i nhÃ 
                """,
                Content = """
                ## DÆ°á»¡ng áº©m tá»‘i giáº£n cÃ¹ng dáº§u dá»«a

                Trong thá»i tiáº¿t hanh khÃ´ hoáº·c mÃ´i trÆ°á»ng Ä‘iá»u hÃ²a vÄƒn phÃ²ng, lÃ n da dá»… bá»‹ máº¥t nÆ°á»›c, trá»Ÿ nÃªn bong trÃ³c vÃ  thÃ´ rÃ¡p. Thay vÃ¬ dÃ¹ng cÃ¡c loáº¡i kem dÆ°á»¡ng phá»©c táº¡p nhiá»u thÃ nh pháº§n hÃ³a há»c, dÆ°á»¡ng da báº±ng dáº§u dá»«a lÃ  má»™t giáº£i phÃ¡p cáº¥p áº©m lÃ nh tÃ­nh tuyá»‡t vá»i.

                ## Táº­n dá»¥ng dáº§u dá»«a nguyÃªn cháº¥t vÃ  dáº§u dá»«a Ã©p láº¡nh Ä‘á»ƒ cáº¥p áº©m

                Dáº§u dá»«a chá»©a cÃ¡c axit bÃ©o tá»± nhiÃªn tÆ°Æ¡ng Ä‘á»“ng vá»›i lá»›p lipid trÃªn da, giÃºp cá»§ng cá»‘ hÃ ng rÃ o báº£o vá»‡ da, ngÄƒn ngá»«a máº¥t nÆ°á»›c biá»ƒu bÃ¬.

                ### DÆ°á»¡ng áº©m body vÃ  vÃ¹ng da khÃ´ rÃ¡p

                Sau khi táº¯m xong, thoa má»™t lá»›p má»ng dáº§u dá»«a lÃªn cÃ¡c vÃ¹ng da dá»… bá»‹ khÃ´ nhÆ° khuá»·u tay, Ä‘áº§u gá»‘i, gÃ³t chÃ¢n. Dáº§u dá»«a giÃºp lÃ m má»m cÃ¡c táº¿ bÃ o sá»«ng nhanh chÃ³ng, tráº£ láº¡i lÃ n da má»‹n mÃ ng.

                ### Massage da máº·t tháº£i Ä‘á»™c

                Láº¥y 2-3 giá»t dáº§u dá»«a xoa áº¥m, massage nháº¹ nhÃ ng lÃªn da máº·t theo chuyá»ƒn Ä‘á»™ng trÃ²n tá»« dÆ°á»›i lÃªn trÃªn trong 3 phÃºt. Sau Ä‘Ã³ dÃ¹ng khÄƒn áº¥m lau sáº¡ch vÃ  rá»­a láº¡i báº±ng sá»¯a rá»­a máº·t nháº¹ dá»‹u. PhÆ°Æ¡ng phÃ¡p nÃ y giÃºp lÃ m sáº¡ch sÃ¢u lá»— chÃ¢n lÃ´ng vÃ  cáº¥p áº©m tá»©c thÃ¬ cho da khÃ´.

                Náº¿u báº¡n muá»‘n tráº£i nghiá»‡m dÃ²ng dáº§u dá»«a Ã©p láº¡nh tinh khiáº¿t Ä‘áº¡t chuáº©n kiá»ƒm Ä‘á»‹nh lab test, hÃ£y [liÃªn há»‡ Ä‘á»ƒ mua sáº£n pháº©m](/lien-he) CoPuree chÃ­nh hÃ£ng Ä‘á»ƒ Ä‘Æ°á»£c tÆ° váº¥n táº­n tÃ¬nh nháº¥t.
                """,
                IsFeatured = false,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:20:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            }
        };

        var seedSlugs = articles.Select(item => item.Slug).ToArray();
        var legacySeedSlugs = new[]
        {
            "cach-dung-dau-dua-ep-lanh-cho-toc-kho-xo",
            "duong-am-vung-da-kho-bang-dau-dua",
            "oil-pulling-voi-dau-dua-ep-lanh",
            "dung-dau-dua-trong-nau-an-va-lam-banh",
            "copuree-co-mat-tai-cac-cua-hang-doi-tac-dau-tien"
        };

        var legacyArticles = await db.Articles
            .Where(article => legacySeedSlugs.Contains(article.Slug) && !seedSlugs.Contains(article.Slug))
            .ToListAsync();
        foreach (var legacyArticle in legacyArticles)
        {
            legacyArticle.IsPublished = false;
            legacyArticle.IsFeatured = false;
            legacyArticle.UpdatedAtUtc = DateTime.UtcNow;
        }

        foreach (var item in articles)
        {
            var article = await db.Articles.FirstOrDefaultAsync(article => article.Slug == item.Slug);
            if (article is null)
            {
                article = new Article
                {
                    Slug = item.Slug,
                    CreatedAtUtc = item.CreatedAtUtc
                };
                db.Articles.Add(article);
            }

            article.Title = item.Title;
            article.CategorySlug = item.CategorySlug;
            article.CategoryName = item.CategoryName;
            article.Excerpt = item.Excerpt;
            article.Content = item.Content;
            article.ImageUrl = item.ImageUrl;
            article.ImageAlt = item.ImageAlt;
            article.IsPublished = true;
            article.IsFeatured = item.IsFeatured;
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
            product.Badge = "ÄÃ£ áº©n";
        }
    }
}
