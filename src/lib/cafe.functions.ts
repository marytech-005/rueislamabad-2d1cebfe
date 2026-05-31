import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ---------- Menu ----------
export const getMenu = createServerFn({ method: "GET" }).handler(async () => {
  const [{ data: categories, error: catErr }, { data: items, error: itemErr }] =
    await Promise.all([
      supabaseAdmin
        .from("menu_categories")
        .select("id, name, sort_order")
        .order("sort_order"),
      supabaseAdmin
        .from("menu_items")
        .select("id, category_id, name, description, price_pkr, sort_order")
        .eq("is_available", true)
        .order("sort_order"),
    ]);
  if (catErr) throw new Error(catErr.message);
  if (itemErr) throw new Error(itemErr.message);
  return { categories: categories ?? [], items: items ?? [] };
});

// ---------- Orders ----------
const orderItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  price: z.number().int().nonnegative().max(100000),
  quantity: z.number().int().min(1).max(50),
});

const orderSchema = z
  .object({
    fulfillment_type: z.enum(["delivery", "pickup"]),
    customer_name: z.string().trim().min(2).max(80),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
    address: z.string().trim().max(300).optional(),
    area: z.string().trim().max(80).optional(),
    pickup_time: z.string().trim().max(40).optional(),
    notes: z.string().trim().max(500).optional(),
    items: z.array(orderItemSchema).min(1).max(50),
  })
  .refine(
    (d) => d.fulfillment_type !== "delivery" || (d.address && d.address.length >= 5),
    { message: "Delivery address required", path: ["address"] },
  );

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = data.fulfillment_type === "delivery" ? 200 : 0;
    const total = subtotal + deliveryFee;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        fulfillment_type: data.fulfillment_type,
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address ?? null,
        area: data.area ?? null,
        pickup_time: data.pickup_time ?? null,
        notes: data.notes ?? null,
        items: data.items,
        subtotal_pkr: subtotal,
        delivery_fee_pkr: deliveryFee,
        total_pkr: total,
      })
      .select("id, total_pkr")
      .single();

    if (error) throw new Error(error.message);
    return { orderId: order.id, total: order.total_pkr };
  });

// ---------- Reservations ----------
const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  party_size: z.number().int().min(1).max(20),
  reserve_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  reserve_time: z.string().trim().min(3).max(20),
  notes: z.string().trim().max(500).optional(),
});

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reservationSchema.parse(input))
  .handler(async ({ data }) => {
    // Future date guard
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reserveDate = new Date(data.reserve_date + "T00:00:00");
    if (reserveDate < today) throw new Error("Reservation date must be today or later");

    const { data: row, error } = await supabaseAdmin
      .from("reservations")
      .insert({
        name: data.name,
        phone: data.phone,
        party_size: data.party_size,
        reserve_date: data.reserve_date,
        reserve_time: data.reserve_time,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { reservationId: row.id };
  });
