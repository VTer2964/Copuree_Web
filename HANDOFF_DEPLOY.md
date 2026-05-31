# CoPuree deploy and handoff

## Current scope

CoPuree is currently a brand/product introduction website, not an online checkout website.

- Frontend: Next.js app in `copuree-storefront`
- Backend/admin/API: ASP.NET Core app in `CoPuree.Web`
- Database: SQLite at launch/pilot scale
- Admin CMS:
  - `/admin/san-pham`: edit product introduction content
  - `/admin/bai-viet`: add/edit/delete-style publishing by hiding/unpublishing articles
  - `/admin/thanh-toan`, `/admin/don-hang`, `/admin/khach-hang`: legacy commerce/admin surfaces still exist for data compatibility, but online selling is not the current public flow

## Recommended deploy model

Use two services:

1. Backend/API/admin on a .NET-capable host.
2. Frontend on Vercel, VPS, or any Node/Next.js host.

Recommended URLs:

```text
https://admin-api.your-domain.com
https://www.your-domain.com
```

The frontend must know the backend URL through:

```text
NEXT_PUBLIC_COPUREE_API_URL=https://admin-api.your-domain.com
```

The backend must allow the frontend origin through:

```text
Cors__AllowedOrigins__0=https://www.your-domain.com
Cors__AllowedOrigins__1=https://your-domain.com
```

## Railway demo deploy

Railway can host the full demo as two services in one project:

1. `copuree-backend`
   - Source: this repository
   - Root directory: repository root
   - Build: Dockerfile
   - Public URL enabled
   - Add a persistent volume mounted at `/app/data`
2. `copuree-storefront`
   - Source: this repository
   - Root directory: `copuree-storefront`
   - Build: Nixpacks
   - Uses `copuree-storefront/railway.toml`
   - Public URL enabled

Backend variables for Railway:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Data Source=/app/data/copuree.db
Admin__Password=<strong-password>
Cors__AllowedOrigins__0=https://<frontend>.up.railway.app
Storage__UploadsPath=/app/data/uploads
Brand__Hotline=0339818937
Brand__Email=<client-email>
Brand__FacebookUrl=<facebook-url>
```

Frontend variables for Railway:

```text
NEXT_PUBLIC_COPUREE_API_URL=https://<backend>.up.railway.app
```

After both services are deployed:

- Open backend `/health`.
- Open backend `/admin/bai-viet`.
- Upload one article image.
- Open frontend homepage and article page to confirm API + uploaded images work.

For demo this is acceptable. Uploaded article images are stored under `/app/data/uploads` when `Storage__UploadsPath=/app/data/uploads` is configured. For long-term production, keep Railway volume backups or move the database/uploads to managed storage.

## Backend production environment variables

Set these on the backend host:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Data Source=/app/data/copuree.db
Admin__Password=<strong-password>
Cors__AllowedOrigins__0=https://www.your-domain.com
Cors__AllowedOrigins__1=https://your-domain.com
Brand__Hotline=0339818937
Brand__Email=your-email@example.com
Brand__FacebookUrl=https://facebook.com/your-page
Storage__UploadsPath=/app/data/uploads
```

If using Windows/IIS hosting, use a writable absolute SQLite path:

```text
ConnectionStrings__DefaultConnection=Data Source=D:\home\site\data\copuree.db
```

## Backend deploy commands

```powershell
dotnet publish .\CoPuree.Web\CoPuree.Web.csproj -c Release -o .\publish\backend
```

Upload `publish/backend` to the .NET host.

Important:

- The SQLite folder must be writable.
- Back up `copuree.db` regularly.
- Change `Admin__Password` before handing to the client.
- Ensure `/uploads/articles` persists across deploys, because admin article images are stored there.

## Frontend deploy commands

```powershell
cd .\copuree-storefront
npm ci
npm run build
npm run start
```

On Vercel or another Next host, set:

```text
NEXT_PUBLIC_COPUREE_API_URL=https://admin-api.your-domain.com
```

Then deploy the `copuree-storefront` folder.

## Editable after deploy

Client can edit without code:

- Article title, category, excerpt, content, hero image, image alt, featured flag, publish status.
- Product name, slug, description, size, price/reference fields, image URL, featured/published state.
- Bank transfer/admin legacy settings if needed.

Client still needs code/developer support for:

- Changing homepage layout/design.
- Adding new homepage sections.
- Adding a new article category to the fixed admin category dropdown if it is not already available.
- Changing navigation labels/structure.
- Adding analytics pixels, SEO schema, or new integrations.
- Migrating database from SQLite to PostgreSQL/SQL Server.

## Handoff checklist

- [ ] Confirm final domain and API/admin subdomain.
- [ ] Replace admin password with a strong password.
- [ ] Configure frontend `NEXT_PUBLIC_COPUREE_API_URL`.
- [ ] Configure backend `Cors__AllowedOrigins`.
- [ ] Confirm backend `/health` returns OK.
- [ ] Log in to `/admin/bai-viet` and upload one test article image.
- [ ] Confirm article image appears on frontend.
- [ ] Back up `copuree.db` after final content entry.
- [ ] Give client admin URL, password, and short content editing instructions.
