using CoPuree.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    public DbSet<PaymentTransaction> PaymentTransactions => Set<PaymentTransaction>();

    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();

    public DbSet<LoyaltyTransaction> LoyaltyTransactions => Set<LoyaltyTransaction>();

    public DbSet<BankTransferSetting> BankTransferSettings => Set<BankTransferSetting>();

    public DbSet<Article> Articles => Set<Article>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .HasIndex(product => product.Slug)
            .IsUnique();

        modelBuilder.Entity<Article>()
            .HasIndex(article => article.Slug)
            .IsUnique();

        modelBuilder.Entity<Article>()
            .HasIndex(article => article.CategorySlug);

        modelBuilder.Entity<Product>()
            .Property(product => product.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Product>()
            .Property(product => product.CompareAtPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .HasIndex(order => order.OrderNumber)
            .IsUnique();

        modelBuilder.Entity<Customer>()
            .HasIndex(customer => customer.Phone)
            .IsUnique();

        modelBuilder.Entity<Customer>()
            .HasIndex(customer => customer.Email);

        modelBuilder.Entity<Customer>()
            .HasIndex(customer => customer.GoogleId);

        modelBuilder.Entity<Order>()
            .HasOne(order => order.Customer)
            .WithMany(customer => customer.Orders)
            .HasForeignKey(order => order.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<CustomerAddress>()
            .HasOne(address => address.Customer)
            .WithMany(customer => customer.Addresses)
            .HasForeignKey(address => address.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LoyaltyTransaction>()
            .HasOne(transaction => transaction.Customer)
            .WithMany(customer => customer.LoyaltyTransactions)
            .HasForeignKey(transaction => transaction.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LoyaltyTransaction>()
            .HasOne(transaction => transaction.Order)
            .WithMany()
            .HasForeignKey(transaction => transaction.OrderId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Order>()
            .Property(order => order.Subtotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.ShippingFee)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.Total)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(item => item.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(item => item.LineTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<PaymentTransaction>()
            .Property(transaction => transaction.Amount)
            .HasPrecision(18, 2);
    }
}
