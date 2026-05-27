# Deploy CoPuree with a Tenten Domain

This project is an ASP.NET Core Razor Pages app. Tenten can be used for the domain/DNS. The website itself still needs a .NET-capable host such as Azure App Service, Render, Fly.io, a VPS, or any hosting provider that supports ASP.NET Core.

## Recommended First Production Setup

- Buy domain at Tenten, for example `copuree.vn` or `copuree.com.vn`.
- Deploy the app to a .NET host.
- Start with SQLite for launch demo, then move to SQL Server/PostgreSQL when orders become real.
- Enable HTTPS on the hosting platform.
- Point Tenten DNS to the hosting platform.

## Required Environment Variables

Set these on the production host:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Data Source=/app/data/copuree.db
Admin__Password=<strong-admin-password>
BankTransfer__BankName=<bank-name>
BankTransfer__AccountNumber=<account-number>
BankTransfer__AccountName=<account-name>
BankTransfer__QrImageUrl=<https-url-to-real-bank-qr>
```

For Windows/IIS hosting, the SQLite path can be a writable absolute path, for example:

```text
ConnectionStrings__DefaultConnection=Data Source=D:\home\site\data\copuree.db
```

## Publish Locally

```powershell
dotnet publish .\CoPuree.Web\CoPuree.Web.csproj -c Release -o .\publish
```

Upload the `publish` folder to the hosting provider, or connect the repo to a CI/CD pipeline.

## Docker Deploy Option

Build:

```powershell
docker build -t copuree-web .
```

Run:

```powershell
docker run -d --name copuree-web -p 8080:8080 `
  -e ASPNETCORE_ENVIRONMENT=Production `
  -e ConnectionStrings__DefaultConnection="Data Source=/app/data/copuree.db" `
  -e Admin__Password="<strong-admin-password>" `
  -e BankTransfer__BankName="MB Bank" `
  -e BankTransfer__AccountNumber="<account-number>" `
  -e BankTransfer__AccountName="COPUREE" `
  -e BankTransfer__QrImageUrl="<https-url-to-real-bank-qr>" `
  -v copuree-data:/app/data `
  copuree-web
```

Then put Nginx/Caddy/hosting reverse proxy in front of port `8080` and enable HTTPS.

## Tenten DNS Steps

After the hosting provider gives you a target domain/IP:

1. Open Tenten domain management.
2. Go to DNS management for your domain.
3. Add or update these records:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | Server public IP, if using VPS/static IP |
| CNAME | `www` | Host-provided domain, if using App Service/Render/Fly |

Use the exact DNS target from your host. Some platforms require CNAME for both root and `www`, while VPS usually uses A record.

## After DNS Points Correctly

- Add the custom domain in the hosting provider dashboard.
- Enable HTTPS/SSL certificate.
- Test:
  - `https://your-domain/`
  - `https://your-domain/san-pham`
  - `https://your-domain/health`
  - `https://your-domain/sitemap.xml`
  - `https://your-domain/admin/don-hang`

## Launch Checklist

- Replace placeholder product photos with real CoPuree assets.
- Replace hotline/email in layout footer.
- Change `Admin__Password`.
- Confirm shipping price and free-shipping threshold.
- Add payment gateway credentials before enabling online payment.
- Run one real test order from mobile and desktop.
- Back up the database before running ads.
