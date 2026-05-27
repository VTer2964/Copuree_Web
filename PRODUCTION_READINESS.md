# CoPuree production readiness

## Backend status

- Product catalog API is ready for one or more published products.
- Order flow supports stock check, COD/bank transfer, transaction record, order lookup, and customer history by phone.
- Customer address storage is available and can be reused by phone number.
- Admin can review orders, export CSV, update order status, update payment status, manage products, customers, and bank transfer settings.
- Loyalty points are already modeled and awarded when an order is marked completed.
- Health check, robots.txt, and sitemap.xml endpoints are available.

## Hardening already added

- Storefront CORS origins are now configurable via `Cors:AllowedOrigins`.
- Production admin login no longer accepts the default development password.
- OTP, order creation, customer lookup, address, and order lookup endpoints have rate limits.
- Admin order labels and loyalty notes have been cleaned to proper Vietnamese text in backend code.

## Data needed before public launch

- Domain name and final production storefront/API URLs.
- Real product data: name, size, price, compare-at price, SKU, stock quantity, ingredients, usage instructions, caution text, and warranty/return notes.
- Final product images as actual files: transparent packshot, lifestyle photos, social proof/review images, and any certification/label images.
- Shipping rules: fee by region, free-shipping threshold, processing time, carrier options, and unsupported locations if any.
- Bank transfer details: bank name, account number, account holder, branch, QR image, and transfer content prefix.
- Customer policies: privacy, shipping, return/refund, terms of sale.
- Authentication providers: SMS/Zalo OTP provider credentials and Google OAuth client ID/secret if Google login is enabled.
- Tracking IDs: GA4, Facebook Pixel, TikTok Pixel, and conversion events if ads will be used.
- Legal/commercial info: business owner/company name, tax info if invoices are needed, support email, hotline, and warehouse address.

## Recommended next backend work

- Replace the in-memory development OTP with a real SMS/Zalo OTP provider.
- Add a proper customer session/JWT after OTP or Google login instead of relying only on phone lookup.
- Move production data to PostgreSQL or SQL Server if order volume grows beyond a small pilot.
- Add database migrations and backup/restore scripts before launch.
- Add audit fields for admin order updates: who changed status, when, and note.
- Add payment confirmation flow for bank transfer: upload/reference proof, manual paid marking, and transaction history.
- Add notification hooks for new order, paid order, shipping update, and cancelled order.
- Add structured logging and error monitoring for production incidents.
