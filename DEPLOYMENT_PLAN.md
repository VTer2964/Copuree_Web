# CoPuree Web Implementation Plan

## Goal

Build a deployable direct-to-consumer website for CoPuree coconut oil: attractive storefront, product catalog, cart, checkout, order storage, and a foundation for payment, CRM, ads, and repeat purchase.

## Current MVP

- ASP.NET Core Razor Pages on .NET 10.
- SQLite database for quick deployment and local testing.
- Product model with seeded CoPuree coconut oil SKUs.
- Session cart with add, update, remove, subtotal, shipping fee, and total.
- Checkout flow with customer info, COD, bank transfer, order creation, and payment transaction records.
- Responsive storefront UI for homepage, product listing, product detail, cart, checkout, and order success.
- Storefront direction now follows the exported Figma references: navy/cream palette, branded logo, product imagery, ecommerce header/search, product cards, gallery detail layout, and clearer checkout summary.

## Phase 1: Public Demo

- Replace placeholder Unsplash images with real CoPuree product photos, logo, and brand colors from Figma.
- Add Vietnamese copy with accents and final brand claims after legal/product approval.
- Basic SEO is now scaffolded: title, meta description, Open Graph image, sitemap, robots.txt.
- Privacy, return policy, and shipping policy pages are now scaffolded.
- Deploy app to Azure App Service, Render, Fly.io, or VPS.
- Point Tenten DNS to the host after deployment.

## Phase 2: Real Commerce

- Admin order viewing is scaffolded. Next: product, inventory, order status, and transaction management.
- Integrate online payment gateway such as VNPay, MoMo, ZaloPay, Stripe, or OnePay.
- Add webhook endpoint to update `PaymentTransaction` and `Order.PaymentStatus`.
- Add email/SMS/Zalo notification after order placement and payment success.
- Add coupon, bundle, free shipping rules, and repeat-purchase campaigns.

## Phase 3: Growth System

- Add analytics pixels: Google Analytics, Meta Pixel, TikTok Pixel.
- Add landing pages for ad campaigns and product benefits.
- Add customer accounts, saved addresses, order history, and reorder.
- Add CRM export or integration for remarketing.
- Add review/testimonial system and UGC sections.

## Phase 4: Production Hardening

- Move from SQLite to SQL Server or PostgreSQL.
- Add migrations and deployment pipeline.
- Add structured logging, health checks, backups, and monitoring.
- Add automated tests for cart, checkout, pricing, and payment webhook behavior.
- Add rate limiting and fraud/spam protection on checkout.
