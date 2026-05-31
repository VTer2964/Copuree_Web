using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Collections.Concurrent;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
const string StorefrontCorsPolicy = "StorefrontCors";

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.Configure<BrandOptions>(builder.Configuration.GetSection("Brand"));
builder.Services.Configure<BankTransferOptions>(builder.Configuration.GetSection("BankTransfer"));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=copuree.db"));
builder.Services.AddDistributedMemoryCache();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<AdminSession>();
builder.Services.AddCors(options =>
{
    var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    var allowedOrigins = configuredOrigins.Length > 0
        ? configuredOrigins
        : builder.Environment.IsDevelopment()
            ? ["http://localhost:3000", "http://localhost:3001", "https://localhost:3000", "https://localhost:3001"]
            : [];

    options.AddPolicy(StorefrontCorsPolicy, policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins);
        }
        else
        {
            policy.SetIsOriginAllowed(_ => false);
        }

        policy.AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("otp", limiter =>
    {
        limiter.PermitLimit = 5;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 0;
    });
    options.AddFixedWindowLimiter("orders", limiter =>
    {
        limiter.PermitLimit = 20;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 0;
    });
    options.AddFixedWindowLimiter("lookup", limiter =>
    {
        limiter.PermitLimit = 60;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 0;
    });
});
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".CoPuree.Cart";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromDays(14);
});

var app = builder.Build();
var phoneOtpStore = new ConcurrentDictionary<string, PhoneOtpChallenge>();

await SeedData.InitializeAsync(app.Services);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

var uploadsPath = app.Configuration["Storage:UploadsPath"];
if (!string.IsNullOrWhiteSpace(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(uploadsPath),
        RequestPath = "/uploads"
    });
}

app.UseRouting();

app.UseSession();

app.UseCors(StorefrontCorsPolicy);

app.UseRateLimiter();

app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "CoPuree.Web",
    checkedAtUtc = DateTime.UtcNow
}));

app.MapGet("/robots.txt", (HttpContext context) =>
{
    var origin = $"{context.Request.Scheme}://{context.Request.Host}";
    var robots = $"""
        User-agent: *
        Allow: /

        Sitemap: {origin}/sitemap.xml
        """;

    return Results.Text(robots, "text/plain", Encoding.UTF8);
});

app.MapGet("/sitemap.xml", async (HttpContext context, AppDbContext db) =>
{
    var origin = $"{context.Request.Scheme}://{context.Request.Host}";
    var products = await db.Products.AsNoTracking().Select(product => product.Slug).ToListAsync();
    var urls = new List<string>
    {
        "",
        "/san-pham",
        "/chinh-sach-bao-mat",
        "/chinh-sach-van-chuyen",
        "/doi-tra-hoan-tien"
    };
    urls.AddRange(products.Select(slug => $"/san-pham/{slug}"));

    var items = string.Join(Environment.NewLine, urls.Select(url =>
        $"""
          <url>
            <loc>{origin}{url}</loc>
            <changefreq>weekly</changefreq>
            <priority>{(url == "" ? "1.0" : "0.8")}</priority>
          </url>
        """));

    var xml = $"""
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        {items}
        </urlset>
        """;

    return Results.Text(xml, "application/xml", Encoding.UTF8);
});

app.MapGet("/api/products", async (AppDbContext db) =>
{
    var products = await db.Products
        .AsNoTracking()
        .Where(product => product.IsPublished)
        .OrderByDescending(product => product.IsFeatured)
        .ThenBy(product => product.Name)
        .Select(product => new ProductResponse(
            product.Id,
            product.Name,
            product.Slug,
            product.ShortDescription,
            product.Description,
            product.Size,
            product.Price,
            product.CompareAtPrice,
            product.StockQuantity,
            product.ImageUrl,
            product.Badge,
            product.IsFeatured))
        .ToListAsync();

    return Results.Ok(products);
});

app.MapGet("/api/products/{slug}", async (string slug, AppDbContext db) =>
{
    var product = await db.Products
        .AsNoTracking()
        .Where(product => product.Slug == slug && product.IsPublished)
        .Select(product => new ProductResponse(
            product.Id,
            product.Name,
            product.Slug,
            product.ShortDescription,
            product.Description,
            product.Size,
            product.Price,
            product.CompareAtPrice,
            product.StockQuantity,
            product.ImageUrl,
            product.Badge,
            product.IsFeatured))
        .FirstOrDefaultAsync();

    return product is null ? Results.NotFound() : Results.Ok(product);
});

app.MapGet("/api/articles/categories", async (AppDbContext db) =>
{
    var articles = await db.Articles
        .AsNoTracking()
        .Where(article => article.IsPublished)
        .Select(article => new { article.CategorySlug, article.CategoryName })
        .ToListAsync();

    var categories = articles
        .GroupBy(article => new { article.CategorySlug, article.CategoryName })
        .Select(group => new ArticleCategoryResponse(
            group.Key.CategorySlug,
            group.Key.CategoryName,
            group.Count()))
        .OrderBy(category => category.Name)
        .ToList();

    return Results.Ok(categories);
});

app.MapGet("/api/articles", async (string? category, AppDbContext db) =>
{
    var query = db.Articles
        .AsNoTracking()
        .Where(article => article.IsPublished);

    if (!string.IsNullOrWhiteSpace(category))
    {
        query = query.Where(article => article.CategorySlug == category.Trim());
    }

    var articles = await query
        .OrderByDescending(article => article.IsFeatured)
        .ThenByDescending(article => article.CreatedAtUtc)
        .Select(article => new ArticleSummaryResponse(
            article.Id,
            article.Title,
            article.Slug,
            article.CategorySlug,
            article.CategoryName,
            article.Excerpt,
            article.ImageUrl,
            article.ImageAlt,
            article.IsFeatured,
            article.CreatedAtUtc))
        .ToListAsync();

    return Results.Ok(articles);
});

app.MapGet("/api/articles/{slug}", async (string slug, AppDbContext db) =>
{
    var article = await db.Articles
        .AsNoTracking()
        .Where(article => article.Slug == slug && article.IsPublished)
        .Select(article => new ArticleDetailResponse(
            article.Id,
            article.Title,
            article.Slug,
            article.CategorySlug,
            article.CategoryName,
            article.Excerpt,
            article.Content,
            article.ImageUrl,
            article.ImageAlt,
            article.IsFeatured,
            article.CreatedAtUtc,
            article.UpdatedAtUtc))
        .FirstOrDefaultAsync();

    return article is null ? Results.NotFound() : Results.Ok(article);
});

app.MapGet("/api/payment-settings/bank-transfer", async (AppDbContext db) =>
{
    var setting = await db.BankTransferSettings.AsNoTracking().FirstOrDefaultAsync();
    setting ??= new BankTransferSetting();

    return Results.Ok(new BankTransferSettingResponse(
        setting.BankName,
        setting.AccountNumber,
        setting.AccountName,
        setting.Branch,
        setting.QrImageUrl,
        setting.TransferContentPrefix));
});

app.MapPost("/api/orders", async (CreateOrderRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.CustomerName) ||
        string.IsNullOrWhiteSpace(request.Phone) ||
        string.IsNullOrWhiteSpace(request.ShippingAddress) ||
        string.IsNullOrWhiteSpace(request.ProductSlug) ||
        request.Quantity <= 0)
    {
        return Results.BadRequest(new { message = "Thông tin đặt hàng chưa hợp lệ." });
    }

    var product = await db.Products.FirstOrDefaultAsync(item =>
        item.Slug == request.ProductSlug && item.IsPublished);
    if (product is null)
    {
        return Results.NotFound(new { message = "Không tìm thấy sản phẩm." });
    }

    if (product.StockQuantity < request.Quantity)
    {
        return Results.BadRequest(new { message = "Sản phẩm không đủ tồn kho." });
    }

    var paymentMethod = request.PaymentMethod?.Equals("bank_transfer", StringComparison.OrdinalIgnoreCase) == true
        ? PaymentMethod.BankTransfer
        : PaymentMethod.CashOnDelivery;
    var paymentStatus = paymentMethod == PaymentMethod.BankTransfer
        ? PaymentStatus.AwaitingTransfer
        : PaymentStatus.Pending;
    var subtotal = product.Price * request.Quantity;
    var shippingFee = 0m;
    var orderNumber = $"CP{DateTime.UtcNow:yyMMddHHmmss}";
    var transactionCode = $"{orderNumber}-{paymentMethod}";
    var customer = await FindOrCreateCustomerAsync(
        db,
        request.CustomerName.Trim(),
        request.Phone.Trim(),
        string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim());

    var order = new Order
    {
        OrderNumber = orderNumber,
        CustomerId = customer.Id,
        CustomerName = request.CustomerName.Trim(),
        Phone = request.Phone.Trim(),
        Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim(),
        ShippingAddress = request.ShippingAddress.Trim(),
        Note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),
        Subtotal = subtotal,
        ShippingFee = shippingFee,
        Total = subtotal + shippingFee,
        PaymentMethod = paymentMethod,
        PaymentStatus = paymentStatus,
        TransactionCode = transactionCode,
        Items =
        [
            new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Size = product.Size,
                Quantity = request.Quantity,
                UnitPrice = product.Price,
                LineTotal = subtotal
            }
        ]
    };

    product.StockQuantity -= request.Quantity;
    db.Orders.Add(order);
    db.PaymentTransactions.Add(new PaymentTransaction
    {
        Order = order,
        Code = transactionCode,
        Method = paymentMethod,
        Status = paymentStatus,
        Amount = order.Total,
        Provider = paymentMethod == PaymentMethod.BankTransfer ? "Bank transfer" : "COD"
    });
    await SaveCustomerAddressFromOrderAsync(db, customer, request);

    await db.SaveChangesAsync();

    return Results.Created($"/api/orders/{order.OrderNumber}", new CreateOrderResponse(
        order.OrderNumber,
        order.Total,
        order.PaymentMethod.ToString(),
        order.PaymentStatus.ToString()));
}).RequireRateLimiting("orders");

app.MapPost("/api/auth/phone/request-otp", (PhoneOtpRequest request, IWebHostEnvironment environment) =>
{
    if (string.IsNullOrWhiteSpace(request.Phone))
    {
        return Results.BadRequest(new { message = "Nhap so dien thoai de nhan OTP." });
    }

    var normalizedPhone = request.Phone.Trim();
    var code = environment.IsDevelopment()
        ? "123456"
        : Random.Shared.Next(100000, 999999).ToString();
    var expiresAtUtc = DateTime.UtcNow.AddMinutes(5);

    phoneOtpStore[normalizedPhone] = new PhoneOtpChallenge(code, expiresAtUtc, 0);

    return Results.Ok(new PhoneOtpResponse(
        normalizedPhone,
        expiresAtUtc,
        environment.IsDevelopment() ? code : null));
}).RequireRateLimiting("otp");

app.MapPost("/api/auth/phone/verify-otp", async (PhoneOtpVerifyRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Phone) || string.IsNullOrWhiteSpace(request.Code))
    {
        return Results.BadRequest(new { message = "Nhap so dien thoai va ma OTP." });
    }

    var normalizedPhone = request.Phone.Trim();
    if (!phoneOtpStore.TryGetValue(normalizedPhone, out var challenge))
    {
        return Results.BadRequest(new { message = "Ma OTP khong ton tai hoac da het han." });
    }

    if (challenge.ExpiresAtUtc < DateTime.UtcNow)
    {
        phoneOtpStore.TryRemove(normalizedPhone, out _);
        return Results.BadRequest(new { message = "Ma OTP da het han." });
    }

    if (challenge.Attempts >= 5)
    {
        phoneOtpStore.TryRemove(normalizedPhone, out _);
        return Results.BadRequest(new { message = "Ban da nhap sai OTP qua nhieu lan." });
    }

    if (!string.Equals(challenge.Code, request.Code.Trim(), StringComparison.Ordinal))
    {
        phoneOtpStore[normalizedPhone] = challenge with { Attempts = challenge.Attempts + 1 };
        return Results.BadRequest(new { message = "Ma OTP khong dung." });
    }

    phoneOtpStore.TryRemove(normalizedPhone, out _);
    var customer = await FindOrCreateCustomerFromPhoneAsync(db, normalizedPhone);

    return Results.Ok(new PhoneOtpVerifyResponse(
        true,
        new CustomerResponse(
            customer.Id,
            customer.FullName,
            customer.Phone,
            customer.Email,
            customer.AvatarUrl,
            customer.LoyaltyPoints,
            customer.CreatedAtUtc)));
}).RequireRateLimiting("otp");

app.MapGet("/api/customers/by-phone/{phone}", async (string phone, AppDbContext db) =>
{
    var normalizedPhone = phone.Trim();
    var customer = await db.Customers
        .AsNoTracking()
        .Where(item => item.Phone == normalizedPhone)
        .Select(item => new CustomerResponse(
            item.Id,
            item.FullName,
            item.Phone,
            item.Email,
            item.AvatarUrl,
            item.LoyaltyPoints,
            item.CreatedAtUtc))
        .FirstOrDefaultAsync();

    if (customer is not null)
    {
        return Results.Ok(customer);
    }

    var latestOrder = await db.Orders
        .AsNoTracking()
        .Where(order => order.Phone == normalizedPhone)
        .OrderByDescending(order => order.CreatedAtUtc)
        .Select(order => new CustomerResponse(
            0,
            order.CustomerName,
            order.Phone,
            order.Email,
            null,
            0,
            order.CreatedAtUtc))
        .FirstOrDefaultAsync();

    return latestOrder is null ? Results.NotFound(new { message = "Không tìm thấy khách hàng." }) : Results.Ok(latestOrder);
}).RequireRateLimiting("lookup");

app.MapGet("/api/customers/by-phone/{phone}/orders", async (string phone, AppDbContext db) =>
{
    var normalizedPhone = phone.Trim();
    var orders = await db.Orders
        .AsNoTracking()
        .Include(order => order.Items)
        .Where(order => order.Phone == normalizedPhone)
        .OrderByDescending(order => order.CreatedAtUtc)
        .Select(order => new CustomerOrderResponse(
            order.OrderNumber,
            order.Total,
            order.Status.ToString(),
            order.PaymentStatus.ToString(),
            order.CreatedAtUtc,
            order.Items.Select(item => new OrderLookupItemResponse(
                item.ProductName,
                item.Size,
                item.Quantity,
                item.UnitPrice,
                item.LineTotal)).ToList()))
        .ToListAsync();

    return Results.Ok(orders);
}).RequireRateLimiting("lookup");

app.MapGet("/api/customers/by-phone/{phone}/addresses", async (string phone, AppDbContext db) =>
{
    var normalizedPhone = phone.Trim();
    var addresses = await db.CustomerAddresses
        .AsNoTracking()
        .Where(address => address.Customer != null && address.Customer.Phone == normalizedPhone)
        .OrderByDescending(address => address.IsDefault)
        .ThenByDescending(address => address.CreatedAtUtc)
        .Select(address => new CustomerAddressResponse(
            address.Id,
            address.ReceiverName,
            address.Phone,
            address.Province,
            address.District,
            address.Ward,
            address.AddressLine,
            address.IsDefault))
        .ToListAsync();

    return Results.Ok(addresses);
}).RequireRateLimiting("lookup");

app.MapPost("/api/customers/by-phone/{phone}/addresses", async (string phone, CreateCustomerAddressRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.ReceiverName) ||
        string.IsNullOrWhiteSpace(request.Phone) ||
        string.IsNullOrWhiteSpace(request.AddressLine))
    {
        return Results.BadRequest(new { message = "Thông tin địa chỉ chưa hợp lệ." });
    }

    var customer = await db.Customers.FirstOrDefaultAsync(customer => customer.Phone == phone.Trim());
    if (customer is null)
    {
        customer = new Customer
        {
            FullName = request.ReceiverName.Trim(),
            Phone = phone.Trim(),
            Email = null,
            CreatedAtUtc = DateTime.UtcNow
        };
        db.Customers.Add(customer);
    }

    if (request.IsDefault)
    {
        var existingDefaults = await db.CustomerAddresses
            .Where(address => address.CustomerId == customer.Id && address.IsDefault)
            .ToListAsync();
        foreach (var address in existingDefaults)
        {
            address.IsDefault = false;
        }
    }

    var newAddress = new CustomerAddress
    {
        Customer = customer,
        ReceiverName = request.ReceiverName.Trim(),
        Phone = request.Phone.Trim(),
        Province = request.Province?.Trim() ?? string.Empty,
        District = request.District?.Trim() ?? string.Empty,
        Ward = request.Ward?.Trim() ?? string.Empty,
        AddressLine = request.AddressLine.Trim(),
        IsDefault = request.IsDefault
    };

    db.CustomerAddresses.Add(newAddress);
    await db.SaveChangesAsync();

    return Results.Created($"/api/customers/by-phone/{customer.Phone}/addresses/{newAddress.Id}", new CustomerAddressResponse(
        newAddress.Id,
        newAddress.ReceiverName,
        newAddress.Phone,
        newAddress.Province,
        newAddress.District,
        newAddress.Ward,
        newAddress.AddressLine,
        newAddress.IsDefault));
}).RequireRateLimiting("orders");

app.MapGet("/api/orders/{orderNumber}", async (string orderNumber, string phone, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(orderNumber) || string.IsNullOrWhiteSpace(phone))
    {
        return Results.BadRequest(new { message = "Nhập mã đơn hàng và số điện thoại." });
    }

    var normalizedOrderNumber = orderNumber.Trim();
    var normalizedPhone = phone.Trim();
    var order = await db.Orders
        .AsNoTracking()
        .Include(item => item.Items)
        .Where(item => item.OrderNumber == normalizedOrderNumber && item.Phone == normalizedPhone)
        .Select(item => new OrderLookupResponse(
            item.OrderNumber,
            item.CustomerName,
            item.Phone,
            item.ShippingAddress,
            item.Subtotal,
            item.ShippingFee,
            item.Total,
            item.Status.ToString(),
            item.PaymentMethod.ToString(),
            item.PaymentStatus.ToString(),
            item.CreatedAtUtc,
            item.Items.Select(orderItem => new OrderLookupItemResponse(
                orderItem.ProductName,
                orderItem.Size,
                orderItem.Quantity,
                orderItem.UnitPrice,
                orderItem.LineTotal)).ToList()))
        .FirstOrDefaultAsync();

    return order is null ? Results.NotFound(new { message = "Không tìm thấy đơn hàng." }) : Results.Ok(order);
}).RequireRateLimiting("lookup");

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();

static async Task<Customer> FindOrCreateCustomerAsync(AppDbContext db, string fullName, string phone, string? email)
{
    var customer = await db.Customers.FirstOrDefaultAsync(item => item.Phone == phone);
    if (customer is null)
    {
        customer = new Customer
        {
            FullName = fullName,
            Phone = phone,
            Email = email,
            CreatedAtUtc = DateTime.UtcNow,
            LastLoginAtUtc = DateTime.UtcNow
        };
        db.Customers.Add(customer);
        await db.SaveChangesAsync();
        return customer;
    }

    customer.FullName = string.IsNullOrWhiteSpace(fullName) ? customer.FullName : fullName;
    if (!string.IsNullOrWhiteSpace(email))
    {
        customer.Email = email;
    }

    customer.LastLoginAtUtc = DateTime.UtcNow;
    return customer;
}

static async Task<Customer> FindOrCreateCustomerFromPhoneAsync(AppDbContext db, string phone)
{
    var customer = await db.Customers.FirstOrDefaultAsync(item => item.Phone == phone);
    if (customer is not null)
    {
        customer.LastLoginAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return customer;
    }

    var latestOrder = await db.Orders
        .AsNoTracking()
        .Where(order => order.Phone == phone)
        .OrderByDescending(order => order.CreatedAtUtc)
        .FirstOrDefaultAsync();

    customer = new Customer
    {
        FullName = latestOrder?.CustomerName ?? "Khach CoPuree",
        Phone = phone,
        Email = latestOrder?.Email,
        CreatedAtUtc = DateTime.UtcNow,
        LastLoginAtUtc = DateTime.UtcNow
    };

    db.Customers.Add(customer);
    await db.SaveChangesAsync();
    return customer;
}

static async Task SaveCustomerAddressFromOrderAsync(AppDbContext db, Customer customer, CreateOrderRequest request)
{
    var addressLine = string.IsNullOrWhiteSpace(request.AddressLine)
        ? request.ShippingAddress.Trim()
        : request.AddressLine.Trim();
    var province = request.Province?.Trim() ?? string.Empty;
    var district = request.District?.Trim() ?? string.Empty;
    var ward = request.Ward?.Trim() ?? string.Empty;
    var receiverPhone = request.Phone.Trim();

    var duplicateAddress = await db.CustomerAddresses.AnyAsync(address =>
        address.CustomerId == customer.Id &&
        address.Phone == receiverPhone &&
        address.AddressLine == addressLine &&
        address.Province == province &&
        address.District == district &&
        address.Ward == ward);

    if (duplicateAddress)
    {
        return;
    }

    var hasExistingAddress = await db.CustomerAddresses.AnyAsync(address => address.CustomerId == customer.Id);
    db.CustomerAddresses.Add(new CustomerAddress
    {
        Customer = customer,
        ReceiverName = request.CustomerName.Trim(),
        Phone = receiverPhone,
        Province = province,
        District = district,
        Ward = ward,
        AddressLine = addressLine,
        IsDefault = !hasExistingAddress
    });
}

public record PhoneOtpChallenge(
    string Code,
    DateTime ExpiresAtUtc,
    int Attempts);

public record PhoneOtpRequest(string Phone);

public record PhoneOtpVerifyRequest(string Phone, string Code);

public record PhoneOtpResponse(
    string Phone,
    DateTime ExpiresAtUtc,
    string? DevOtp);

public record PhoneOtpVerifyResponse(
    bool Verified,
    CustomerResponse Customer);

public record ProductResponse(
    int Id,
    string Name,
    string Slug,
    string ShortDescription,
    string Description,
    string Size,
    decimal Price,
    decimal? CompareAtPrice,
    int StockQuantity,
    string ImageUrl,
    string Badge,
    bool IsFeatured);

public record ArticleCategoryResponse(
    string Slug,
    string Name,
    int Count);

public record ArticleSummaryResponse(
    int Id,
    string Title,
    string Slug,
    string CategorySlug,
    string CategoryName,
    string Excerpt,
    string ImageUrl,
    string ImageAlt,
    bool IsFeatured,
    DateTime CreatedAtUtc);

public record ArticleDetailResponse(
    int Id,
    string Title,
    string Slug,
    string CategorySlug,
    string CategoryName,
    string Excerpt,
    string Content,
    string ImageUrl,
    string ImageAlt,
    bool IsFeatured,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc);

public record BankTransferSettingResponse(
    string BankName,
    string AccountNumber,
    string AccountName,
    string Branch,
    string QrImageUrl,
    string TransferContentPrefix);

public record CreateOrderRequest(
    string ProductSlug,
    int Quantity,
    string CustomerName,
    string Phone,
    string? Email,
    string ShippingAddress,
    string? Province,
    string? District,
    string? Ward,
    string? AddressLine,
    string? Note,
    string? PaymentMethod);

public record CreateOrderResponse(
    string OrderNumber,
    decimal Total,
    string PaymentMethod,
    string PaymentStatus);

public record OrderLookupResponse(
    string OrderNumber,
    string CustomerName,
    string Phone,
    string ShippingAddress,
    decimal Subtotal,
    decimal ShippingFee,
    decimal Total,
    string Status,
    string PaymentMethod,
    string PaymentStatus,
    DateTime CreatedAtUtc,
    List<OrderLookupItemResponse> Items);

public record OrderLookupItemResponse(
    string ProductName,
    string Size,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal);

public record CustomerResponse(
    int Id,
    string FullName,
    string Phone,
    string? Email,
    string? AvatarUrl,
    int LoyaltyPoints,
    DateTime CreatedAtUtc);

public record CustomerOrderResponse(
    string OrderNumber,
    decimal Total,
    string Status,
    string PaymentStatus,
    DateTime CreatedAtUtc,
    List<OrderLookupItemResponse> Items);

public record CustomerAddressResponse(
    int Id,
    string ReceiverName,
    string Phone,
    string Province,
    string District,
    string Ward,
    string AddressLine,
    bool IsDefault);

public record CreateCustomerAddressRequest(
    string ReceiverName,
    string Phone,
    string? Province,
    string? District,
    string? Ward,
    string AddressLine,
    bool IsDefault);
