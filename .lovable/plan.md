# Rue — Aesthetic Cafe Website

A calm, dark, editorial site for Rue (F-6 Markaz, Islamabad) with browsing, cart-based ordering, real card payments, and table reservations.

## Visual direction

Dark and quiet — not loud luxury. Think candlelit dining room at dusk:
- Background: warm near-black (`oklch(0.16 0.01 60)`), surface a touch lighter
- Foreground: soft warm cream, never pure white
- Accent: muted brass / dim gold for hover states and key CTAs only
- Type: an elegant serif display (Cormorant or Instrument Serif) paired with a quiet sans (Inter / Work Sans) for body
- Generous whitespace, slow fades, no bouncy motion, no gradient meshes
- Photography-led — large image-forward sections, your uploads do the heavy lifting

## Pages (separate routes, each with its own SEO)

```
/                 Home — hero image, intro line, signature dishes, hours, CTA
/menu             Full menu by category, "Add to cart" on each item
/gallery          Photo grid of your uploads
/story            About Rue, the space, location, Instagram
/reserve          Reservation form (date, time, party size, name, phone)
/order            Cart review → checkout (delivery or pickup) → Stripe
/order/success    Order confirmation
/order/cancel     Returned-from-Stripe cancel screen
```

Header: logo, Menu, Gallery, Story, Reserve, cart icon with count.
Footer: address, hours, phone (0337 6502222), Instagram (@rue_isb).

## Functionality

**Cart** — client state via Zustand, persisted to localStorage. Add / remove / change quantity. Item modifiers kept simple (notes field per item).

**Checkout** — fulfillment toggle (Delivery / Pickup). Delivery collects name, phone, address, area, notes. Pickup collects name, phone, pickup time. Submits to a server function that creates an order row and a Stripe Checkout session, then redirects.

**Payments** — Lovable's built-in seamless Stripe integration (no Stripe account needed to start; test mode immediately, live after you verify). PKR currency. I'll set up products from the menu you paste.

**Reservations** — server function inserts into `reservations` table. You'll see them in the admin view (a simple `/admin` page gated by a password env var; full auth can come later if you want).

**Orders** — saved to `orders` + `order_items`. Stripe webhook marks them `paid`. Same `/admin` view lists incoming orders.

## Data model (Lovable Cloud / Supabase)

- `menu_categories` (id, name, sort_order)
- `menu_items` (id, category_id, name, description, price_pkr, image_url, is_available)
- `orders` (id, fulfillment_type, customer_name, phone, address, area, notes, pickup_time, subtotal, total, status, stripe_session_id, created_at)
- `order_items` (id, order_id, menu_item_id, name_snapshot, price_snapshot, quantity, notes)
- `reservations` (id, name, phone, party_size, date, time, notes, status, created_at)

RLS: public can `INSERT` orders/reservations; only service role can read. Menu is publicly readable.

## Technical details

- TanStack Start with file-based routes under `src/routes/`
- `createServerFn` for: `createOrder`, `createCheckoutSession`, `createReservation`, `listMenu`
- Server route `src/routes/api/public/stripe-webhook.ts` verifies signature and updates order status
- Zod validation on every server fn input (lengths, phone format, party size 1–20, future dates only)
- Image-placeholder approach for hero/section images until you upload yours, then swapped in `src/assets/`
- Design tokens in `src/styles.css` (oklch), no hardcoded colors in components

## What I need from you (after the plan is approved)

1. Upload your Rue photos in a follow-up message (hero shot, interior, 2–3 dishes, exterior)
2. Paste the menu (categories → items → prices in PKR; descriptions optional)
3. Confirm you're on a Pro plan so I can enable Stripe payments (test mode works right away; live needs your verification later)

## Build order

1. Enable Lovable Cloud + create tables with RLS
2. Theme + layout shell (header, footer, fonts, tokens)
3. Home, Story, Gallery (with placeholder imagery first)
4. Menu page driven by DB (seeded once you paste it)
5. Cart store + Order/checkout flow
6. Enable seamless Stripe + wire checkout session + webhook
7. Reservations page + server fn
8. Lightweight `/admin` for orders + reservations
9. Swap in your real photos, polish, SEO meta on every route
