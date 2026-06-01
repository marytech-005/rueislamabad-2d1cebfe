import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const authSchema = z.object({ passcode: z.string().min(1).max(200) });

function checkPasscode(passcode: string) {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) throw new Error("Admin passcode not configured");
  if (passcode !== expected) throw new Error("Invalid passcode");
}

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => authSchema.parse(input))
  .handler(async ({ data }) => {
    checkPasscode(data.passcode);
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { orders: orders ?? [] };
  });

export const adminListReservations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => authSchema.parse(input))
  .handler(async ({ data }) => {
    checkPasscode(data.passcode);
    const { data: rows, error } = await supabaseAdmin
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { reservations: rows ?? [] };
  });

const statusSchema = z.object({
  passcode: z.string().min(1).max(200),
  id: z.string().uuid(),
  table: z.enum(["orders", "reservations"]),
  status: z.enum(["pending", "confirmed", "preparing", "out_for_delivery", "completed", "cancelled"]),
});

export const adminUpdateStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => statusSchema.parse(input))
  .handler(async ({ data }) => {
    checkPasscode(data.passcode);
    const { error } = await supabaseAdmin
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
