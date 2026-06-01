import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/SiteShell";
import { useCart, formatPKR } from "@/lib/cart-store";
import { submitOrder } from "@/lib/cafe.functions";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order online — Rue Islamabad" },
      { name: "description", content: "Order from Rue for delivery across F-6 / F-7 or pickup. Specialty coffee, breakfast, sandwiches, pastas." },
      { property: "og:title", content: "Order online — Rue Islamabad" },
      { property: "og:description", content: "Delivery or pickup from Rue, F-6 Markaz, Islamabad." },
      { property: "og:url", content: "https://rueislamabad.lovable.app/order" },
    ],
    links: [
      { rel: "canonical", href: "https://rueislamabad.lovable.app/order" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">Your bag</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground">Order online</h1>
        <p className="mt-5 text-muted-foreground">Delivery or pickup. We'll call to confirm before we start cooking.</p>
        <div className="mt-10 hairline w-24 mx-auto" />
      </div>

      {mounted ? <OrderBody /> : <div className="h-40" />}
    </SiteShell>
  );
}

function OrderBody() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const submit = useServerFn(submitOrder);

  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && items.length > 0 ? 200 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 pb-32 text-center">
        <p className="text-muted-foreground">Your bag is empty.</p>
        <Link
          to="/menu"
          className="mt-8 inline-flex border border-brass bg-brass text-primary-foreground px-7 py-3 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          fulfillment_type: fulfillment,
          customer_name: String(fd.get("customer_name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          address: fulfillment === "delivery" ? String(fd.get("address") ?? "") : undefined,
          area: fulfillment === "delivery" ? String(fd.get("area") ?? "") || undefined : undefined,
          pickup_time: fulfillment === "pickup" ? String(fd.get("pickup_time") ?? "") || undefined : undefined,
          notes: String(fd.get("notes") ?? "") || undefined,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      });
      clear();
      toast.success(`Order received — total ${formatPKR(result.total)}`);
      // Simple thank-you redirect via state
      window.location.href = `/order?placed=${result.orderId}`;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't place order");
    } finally {
      setSubmitting(false);
    }
  };

  // After redirect from successful order
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  if (params?.get("placed")) {
    return (
      <div className="mx-auto max-w-xl px-6 pb-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">Thank you</p>
        <h2 className="mt-4 font-display text-5xl text-foreground">Order received.</h2>
        <p className="mt-6 text-muted-foreground">
          We've got it. We'll call you on the number you provided to confirm and
          give you an ETA.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex border border-brass text-brass px-7 py-3 text-xs uppercase tracking-widest hover:bg-brass hover:text-primary-foreground transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 grid lg:grid-cols-5 gap-12">
      {/* Cart */}
      <section className="lg:col-span-3">
        <h2 className="font-display text-2xl text-foreground mb-6">Your items</h2>
        <ul className="divide-y divide-border/50">
          {items.map((i) => (
            <li key={i.id} className="py-5 flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">{i.name}</h3>
                <p className="text-sm text-brass mt-1">{formatPKR(i.price)}</p>
              </div>
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity(i.id, i.quantity - 1)}
                  className="h-9 w-9 inline-flex items-center justify-center text-muted-foreground hover:text-brass"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm">{i.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(i.id, i.quantity + 1)}
                  className="h-9 w-9 inline-flex items-center justify-center text-muted-foreground hover:text-brass"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(i.id)}
                className="h-9 w-9 inline-flex items-center justify-center text-muted-foreground hover:text-destructive"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Checkout */}
      <aside className="lg:col-span-2 bg-surface/40 border border-border/60 p-8">
        <h2 className="font-display text-2xl text-foreground">Checkout</h2>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {(["delivery", "pickup"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFulfillment(f)}
              className={
                "py-3 text-xs uppercase tracking-widest border transition-colors " +
                (fulfillment === f
                  ? "border-brass bg-brass text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-brass hover:text-brass")
              }
            >
              {f}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Full name">
            <input name="customer_name" required minLength={2} maxLength={80} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input name="phone" required type="tel" minLength={7} maxLength={20} className={inputCls} placeholder="03XX XXXXXXX" />
          </Field>

          {fulfillment === "delivery" ? (
            <>
              <Field label="Address">
                <textarea name="address" required minLength={5} maxLength={300} rows={2} className={inputCls} />
              </Field>
              <Field label="Area">
                <input name="area" maxLength={80} className={inputCls} placeholder="F-7, E-11…" />
              </Field>
            </>
          ) : (
            <Field label="Preferred pickup time">
              <input name="pickup_time" maxLength={40} className={inputCls} placeholder="In 30 min, 2:30 PM…" />
            </Field>
          )}

          <Field label="Notes (optional)">
            <textarea name="notes" rows={2} maxLength={500} className={inputCls} placeholder="No onions, extra napkins…" />
          </Field>

          <div className="mt-6 pt-6 border-t border-border/60 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPKR(subtotal)} />
            {fulfillment === "delivery" && <Row label="Delivery" value={formatPKR(deliveryFee)} />}
            <Row label="Total" value={formatPKR(total)} bold />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 border border-brass bg-brass text-primary-foreground px-7 py-4 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Place order
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            Payment on delivery / pickup. We'll call to confirm.
          </p>
        </form>
      </aside>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brass transition-colors text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={"flex justify-between " + (bold ? "text-foreground font-medium pt-2 text-base" : "text-muted-foreground")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
