
-- Menu categories
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_pkr integer NOT NULL CHECK (price_pkr >= 0),
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fulfillment_type text NOT NULL CHECK (fulfillment_type IN ('delivery','pickup')),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text,
  area text,
  pickup_time text,
  notes text,
  subtotal_pkr integer NOT NULL,
  delivery_fee_pkr integer NOT NULL DEFAULT 0,
  total_pkr integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  party_size int NOT NULL CHECK (party_size BETWEEN 1 AND 20),
  reserve_date date NOT NULL,
  reserve_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT ON public.menu_categories TO anon, authenticated;
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT ALL ON public.menu_categories TO service_role;
GRANT ALL ON public.menu_items TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.reservations TO service_role;

-- RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_categories_public_read" ON public.menu_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "menu_items_public_read" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_available = true);
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "reservations_public_insert" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
