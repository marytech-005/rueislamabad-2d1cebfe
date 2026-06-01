import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { adminListOrders, adminListReservations, adminUpdateStatus } from "@/lib/admin.functions";
import { formatPKR } from "@/lib/cart-store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rue" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  fulfillment_type: string;
  address: string | null;
  area: string | null;
  pickup_time: string | null;
  notes: string | null;
  total_pkr: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
};

type ReservationRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  party_size: number;
  reserve_date: string;
  reserve_time: string;
  notes: string | null;
  status: string;
};

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"orders" | "reservations">("orders");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useServerFn(adminListOrders);
  const fetchReservations = useServerFn(adminListReservations);
  const updateStatus = useServerFn(adminUpdateStatus);

  const load = async (code: string) => {
    setLoading(true);
    try {
      const [o, r] = await Promise.all([
        fetchOrders({ data: { passcode: code } }),
        fetchReservations({ data: { passcode: code } }),
      ]);
      setOrders(o.orders as unknown as OrderRow[]);
      setReservations(r.reservations as unknown as ReservationRow[]);
      setAuthed(true);
      sessionStorage.setItem("rue_admin", code);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setAuthed(false);
      sessionStorage.removeItem("rue_admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("rue_admin");
    if (stored) {
      setPasscode(stored);
      load(stored);
    }
  }, []);

  const onStatus = async (table: "orders" | "reservations", id: string, status: string) => {
    try {
      await updateStatus({ data: { passcode, id, table, status: status as never } });
      await load(passcode);
      toast.success("Updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  if (!authed) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md px-6 py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-brass text-center">Staff only</p>
          <h1 className="mt-4 font-display text-4xl text-center text-foreground">Admin</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(passcode);
            }}
            className="mt-10 space-y-4"
          >
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              className="w-full bg-transparent border border-border px-4 py-3 text-foreground focus:outline-none focus:border-brass text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !passcode}
              className="w-full border border-brass bg-brass text-primary-foreground px-7 py-3 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enter
            </button>
          </form>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Dashboard</p>
            <h1 className="mt-3 font-display text-4xl text-foreground">Admin</h1>
          </div>
          <button
            onClick={() => load(passcode)}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-brass"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border/60">
          {(["orders", "reservations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px " +
                (tab === t ? "border-brass text-brass" : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {t} ({t === "orders" ? orders.length : reservations.length})
            </button>
          ))}
        </div>

        {tab === "orders" ? (
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} className="border border-border/60 p-6 bg-surface/30">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()} · {o.fulfillment_type}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-foreground">{o.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{o.phone}</p>
                    {o.address && <p className="text-sm mt-1">{o.address} {o.area && `· ${o.area}`}</p>}
                    {o.pickup_time && <p className="text-sm mt-1">Pickup: {o.pickup_time}</p>}
                    {o.notes && <p className="text-sm mt-1 italic text-muted-foreground">Note: {o.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-brass font-display text-2xl">{formatPKR(o.total_pkr)}</p>
                    <select
                      value={o.status}
                      onChange={(e) => onStatus("orders", o.id, e.target.value)}
                      className="mt-2 bg-transparent border border-border px-3 py-1.5 text-xs uppercase tracking-widest focus:outline-none focus:border-brass"
                    >
                      {["pending", "confirmed", "preparing", "out_for_delivery", "completed", "cancelled"].map((s) => (
                        <option key={s} value={s} className="bg-background">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <ul className="mt-4 pt-4 border-t border-border/40 text-sm space-y-1">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between text-muted-foreground">
                      <span>{it.quantity}× {it.name}</span>
                      <span>{formatPKR(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.length === 0 && <p className="text-muted-foreground">No reservations yet.</p>}
            {reservations.map((r) => (
              <div key={r.id} className="border border-border/60 p-6 bg-surface/30 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Booked {new Date(r.created_at).toLocaleString()}
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-foreground">{r.name}</h3>
                  <p className="text-sm text-muted-foreground">{r.phone}</p>
                  <p className="text-sm mt-2">
                    <span className="text-brass">{r.reserve_date}</span> at {r.reserve_time} · party of {r.party_size}
                  </p>
                  {r.notes && <p className="text-sm mt-1 italic text-muted-foreground">Note: {r.notes}</p>}
                </div>
                <select
                  value={r.status}
                  onChange={(e) => onStatus("reservations", r.id, e.target.value)}
                  className="bg-transparent border border-border px-3 py-1.5 text-xs uppercase tracking-widest focus:outline-none focus:border-brass"
                >
                  {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                    <option key={s} value={s} className="bg-background">{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
