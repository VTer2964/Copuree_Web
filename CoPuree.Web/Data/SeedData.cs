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
                Title = """
                Cách Ủ Tóc Bằng Dầu Dừa Trị Rụng Tóc Hiệu Quả
                """,
                Slug = """
                cach-u-toc-bang-dau-dua-tri-rung-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                Chăm sóc tóc
                """,
                Excerpt = """
                Hướng dẫn chi tiết cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả tại nhà, giúp nang tóc chắc khỏe, giảm gãy rụng và nuôi dưỡng da đầu từ sâu bên trong.
                """,
                ImageUrl = """
                /images/blog/1.1.png
                """,
                ImageAlt = """
                Cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả tại nhà cùng CoPuree
                """,
                Content = """
                ## Vì sao rụng tóc là nỗi lo hàng đầu?

                Rụng tóc sau sinh hoặc do căng thẳng công việc là nỗi ám ảnh lớn của nhiều chị em phụ nữ. Nhiều người thường tìm đến các sản phẩm hóa chất đắt tiền nhưng lại vô tình gây hại thêm cho da đầu nhạy cảm. Để giải quyết tận gốc, chúng ta cần một phương pháp tự nhiên và an sau.

                ## Hướng dẫn ủ tóc bằng dầu dừa phục hồi nang tóc

                Dầu dừa chứa hàm lượng lớn Axit Lauric có khả năng thẩm thấu sâu vào lõi tóc, bảo vệ protein tóc và kích thích nang tóc phát triển. Dưới đây là quy trình trị liệu rụng tóc chuyên sâu:

                ### Bước 1: Chuẩn bị dầu dừa sạch

                Sử dụng dầu dừa ép lạnh tinh khiết. Cho một lượng khoảng 10-15ml dầu dừa ra chén nhỏ. Làm ấm dầu dừa bằng cách ngâm chén vào nước ấm khoảng 2 phút giúp dầu tăng khả năng thẩm thấu.

                ### Bước 2: Thoa dầu dừa lên chân tóc và da đầu

                Tách tóc thành từng phần nhỏ, dùng tăm bông hoặc thìa lấy dầu thoa trực tiếp lên chân tóc và da đầu. Massage nhẹ nhàng bằng đầu ngón tay (không dùng móng tay) trong 5 phút để kích thích tuần hoàn máu.

                ### Bước 3: Ủ tóc trong 20 phút

                Dùng mũ tắm hoặc khăn ấm quấn quanh đầu và ủ trong vòng 20 phút. Tránh ủ quá lâu hoặc để qua đêm vì có thể làm bít tắc nang lông gây gãy rụng.

                ![Cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả](/images/blog/1.2.jpg)

                ## Cách ủ tóc bằng dầu dừa chuẩn và không bị bết

                Nhiều người gặp tình trạng bết tóc sau khi ủ. Bí quyết nằm ở bước gội sạch: sau khi ủ, hãy thoa trực tiếp dầu gội lên tóc khô khi chưa xịt nước, xoa đều rồi mới xả nước ấm. Gội lại lần 2 để đảm bảo dầu thừa được loại bỏ hoàn toàn.

                Để biết thêm các mẹo chăm sóc tóc tối ưu khác, hãy [tham khảo cẩm nang dùng dầu dừa](/tin-tuc/cach-dung-dau-dua-duong-toc) để có mái tóc bồng bềnh khỏe mạnh.
                """,
                IsFeatured = true,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:00:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Cẩm Nang Cách Dùng Dầu Dừa Dưỡng Tóc Chuyên Sâu
                """,
                Slug = """
                cach-dung-dau-dua-duong-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                Chăm sóc tóc
                """,
                Excerpt = """
                Cẩm nang hướng dẫn toàn diện nhất về cách dùng dầu dừa dưỡng tóc và cách dưỡng tóc bằng dầu dừa an toàn, nuôi dưỡng sợi tóc suôn mượt chuẩn khoa học.
                """,
                ImageUrl = """
                /images/blog/2.1.png
                """,
                ImageAlt = """
                Cẩm nang cách dùng dầu dừa dưỡng tóc chuyên sâu CoPuree
                """,
                Content = """
                ## Dưỡng tóc bằng dầu dừa: Lựa chọn tự nhiên thông minh

                Tóc khô xơ, chẻ ngọn do uốn nhuộm liên tục là vấn đề phổ biến. Sử dụng dầu dừa nguyên chất ép lạnh là liệu pháp phục hồi tự nhiên vừa tiết kiệm lại cực kỳ hiệu quả nếu áp dụng đúng cách.

                ## Cách dưỡng tóc bằng dầu dừa

                Tùy theo tình trạng tóc, bạn có thể áp dụng 2 cách dưỡng tóc bằng dầu dừa sau:

                ### Cách 1: Dưỡng xả khô (Leaving-in conditioner)

                Sau khi gội đầu sạch và sấy tóc khô khoảng 80%, lấy 1-2 giọt dầu dừa ép lạnh xoa đều trong lòng bàn tay rồi vuốt nhẹ lên phần đuôi tóc khô xơ. Cách này giúp giữ ẩm và bảo vệ tóc khỏi tia UV, nhiệt độ cao.

                ### Cách 2: Ủ tóc chuyên sâu trước khi gội

                Áp dụng phương pháp Pre-shampoo: Thoa dầu dừa lên tóc khô, massage da đầu và ủ trong 20 phút trước khi bước vào bồn gội. Phương pháp này giúp tóc không bị mất nước khi tiếp xúc với hóa chất tẩy rửa mạnh trong dầu gội.

                ![Ủ tóc bằng dầu dừa dưỡng tóc suôn mượt](/images/blog/2.2.png)

                ## Cách sử dụng dầu dừa cho tóc an toàn nhất

                Tránh thoa quá nhiều dầu dừa trực tiếp lên da đầu nếu bạn có tuyến bã nhờn hoạt động mạnh. Hãy tập trung dưỡng phần thân và đuôi tóc - nơi chịu nhiều hư tổn nhất.

                Layout [tìm hiểu tác dụng của dầu dừa](/tin-tuc/tac-dung-cua-dau-dua-voi-toc) để hiểu rõ hơn về mặt khoa học tại sao dầu dừa lại có công dụng vượt trội so với các loại dầu thực vật khác.
                """,
                IsFeatured = true,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:05:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Giải Mã Tác Dụng Của Dầu Dừa Với Tóc
                """,
                Slug = """
                tac-dung-cua-dau-dua-voi-toc
                """,
                CategorySlug = """
                cham-soc-toc
                """,
                CategoryName = """
                Chăm sóc tóc
                """,
                Excerpt = """
                Phân tích khoa học chuyên sâu về tác dụng của dầu dừa với tóc và cơ chế phục hồi lõi tóc từ Axit Lauric tự nhiên khi duy trì thói quen ủ tóc thường xuyên.
                """,
                ImageUrl = """
                /images/blog/3.1.png
                """,
                ImageAlt = """
                Cơ chế khoa học của tác dụng của dầu dừa với tóc cùng CoPuree
                """,
                Content = """
                ## Khoa học đằng sau tác dụng của dầu dừa với tóc

                Không phải ngẫu nhiên mà dầu dừa được xem là thần dược cho mái tóc. Các nghiên cứu sinh học chỉ ra rằng dầu dừa có cấu trúc hóa học độc đáo giúp nó vượt trội hơn các loại dầu khoáng hay dầu hạt khác trong việc bảo vệ tóc khỏi hư tổn.

                ![Tác dụng của dầu dừa phục hồi lõi tóc](/images/blog/3.2.png)

                ## Cơ chế Axit Lauric phục hồi lõi tóc khi ủ tóc với dầu dừa

                Dầu dừa rất giàu Axit Lauric (một loại axit béo chuỗi trung bình). Nhờ phân tử lượng thấp và cấu trúc dạng chuỗi thẳng, Axit Lauric dễ dàng xuyên qua lớp biểu bì tóc bên ngoài để đi sâu vào trong lõi tóc (cortex).

                Ủ tóc với dầu dừa thường xuyên sẽ tạo một lớp màng lipid bảo vệ lõi tóc, hạn chế sự trương nở của sợi tóc khi gặp nước (hygral fatigue) - nguyên nhân chính gây gãy rụng tóc khi gội đầu. Đồng thời ngăn chặn việc thất thoát protein tự nhiên của sợi tóc.

                Để sở hữu mái tóc chắc khỏe từ gốc tới ngọn, hãy [xem các sản phẩm dầu dừa ủ tóc](/san-pham) ép lạnh nguyên chất CoPuree với thiết kế hũ miệng rộng thông minh chống đông đặc hiệu quả.
                """,
                IsFeatured = false,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:10:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Hướng Dẫn Cách Làm Dầu Dừa Ép Lạnh Tại Nhà
                """,
                Slug = """
                cach-lam-dau-dua-ep-lanh-tai-nha
                """,
                CategorySlug = """
                nau-an-lam-banh
                """,
                CategoryName = """
                Nấu ăn và làm bánh
                """,
                Excerpt = """
                Hướng dẫn chi tiết cách làm dầu dừa ép lạnh tại nhà đơn giản bằng máy ép cơ học và so sánh ưu nhược điểm với phương pháp nấu nóng truyền thống.
                """,
                ImageUrl = """
                /images/copuree-pdf/pdf-page5-image2.png
                """,
                ImageAlt = """
                So sánh cách làm dầu dừa ép lạnh tại nhà và đun nóng truyền thống
                """,
                Content = """
                ## Xu hướng tự làm (DIY) mỹ phẩm thiên nhiên

                Gen Z hiện nay rất ưa chuộng các phương pháp làm đẹp DIY tự nhiên vì sợ hóa chất bảo quản. Tự làm dầu dừa ép lạnh tại nhà là một trong những trải nghiệm thú vị giúp bạn có nguồn nguyên liệu sạch để dưỡng da và chế biến món ăn.

                ## So sánh cách làm dầu dừa ép lạnh và phương pháp nấu dầu dừa truyền thống

                ### Phương pháp nấu dầu dừa nhiệt truyền thống

                Là phương pháp đun sôi nước cốt dừa trên bếp lửa cho đến khi dầu dừa tách ra và phần bã dừa chuyển màu vàng. Phương pháp này dễ làm nhưng nhiệt độ cao làm biến tính một số vitamin và làm mất đi mùi thơm dịu nhẹ nguyên bản của dừa tươi.

                ### Cách làm dầu dừa ép lạnh cơ học

                Sử dụng máy ép trục vít mini để ép cơm dừa đã sấy lạnh. Dầu dừa thu được sẽ được lọc qua màng siêu mịn. Phương pháp này hoàn toàn không dùng nhiệt, giúp giữ trọn vẹn 100% vitamin E tự nhiên, màu dầu trong suốt và có mùi hương dịu ngọt như kẹo dừa.

                Tuy nhiên, tự làm tại nhà thường khó kiểm soát độ ẩm, khiến dầu dừa dễ bị ôi thiu sau vài tuần. Nếu bạn bận rộn và cần một sản phẩm chuẩn kiểm định, hãy [tìm hiểu dầu dừa nguyên chất](/) ép lạnh CoPuree với cam kết minh bạch 100% không hương liệu.
                """,
                IsFeatured = false,
                CreatedAtUtc = DateTime.Parse("""
                2026-06-10T04:15:00Z
                """, null, System.Globalization.DateTimeStyles.AdjustToUniversal)
            },
            new
            {
                Title = """
                Bí Quyết Dưỡng Da Bằng Dầu Dừa Sáng Khỏe Tự Nhiên
                """,
                Slug = """
                duong-da-bang-dau-dua
                """,
                CategorySlug = """
                cham-soc-da
                """,
                CategoryName = """
                Chăm sóc da
                """,
                Excerpt = """
                Khám phá bí quyết dưỡng da bằng dầu dừa nguyên chất ép lạnh giúp cấp ẩm vượt trội, làm dịu da khô và chống lão hóa da an toàn hiệu quả ngay tại nhà.
                """,
                ImageUrl = """
                /images/copuree-pdf/pdf-page6-image1.png
                """,
                ImageAlt = """
                Bí quyết dưỡng da bằng dầu dừa ép lạnh CoPuree hiệu quả tại nhà
                """,
                Content = """
                ## Dưỡng ẩm tối giản cùng dầu dừa

                Trong thời tiết hanh khô hoặc môi trường điều hòa văn phòng, làn da dễ bị mất nước, trở nên bong tróc và thô ráp. Thay vì dùng các loại kem dưỡng phức tạp nhiều thành phần hóa học, dưỡng da bằng dầu dừa là một giải pháp cấp ẩm lành tính tuyệt vời.

                ## Tận dụng dầu dừa nguyên chất và dầu dừa ép lạnh để cấp ẩm

                Dầu dừa chứa các axit béo tự nhiên tương đồng với lớp lipid trên da, giúp củng cố hàng rào bảo vệ da, ngăn ngừa mất nước biểu bì.

                ### Dưỡng ẩm body và vùng da khô ráp

                Sau khi tắm xong, thoa một lớp mỏng dầu dừa lên các vùng da dễ bị khô như khuỷu tay, đầu gối, gót chân. Dầu dừa giúp làm mềm các tế bào sừng nhanh chóng, trả lại làn da mịn màng.

                ### Massage da mặt thải độc

                Lấy 2-3 giọt dầu dừa xoa ấm, massage nhẹ nhàng lên da mặt theo chuyển động tròn từ dưới lên trên trong 3 phút. Sau đó dùng khăn ấm lau sạch và rửa lại bằng sữa rửa mặt nhẹ dịu. Phương pháp này giúp làm sạch sâu lỗ chân lông và cấp ẩm tức thì cho da khô.

                Nếu bạn muốn trải nghiệm dòng dầu dừa ép lạnh tinh khiết đạt chuẩn kiểm định lab test, hãy [liên hệ để mua sản phẩm](/lien-he) CoPuree chính hãng để được tư vấn tận tình nhất.
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
            product.Badge = "Đã ẩn";
        }
    }
}
