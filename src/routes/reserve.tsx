import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteShell } from "@/components/SiteShell";
import { submitReservation } from "@/lib/cafe.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve a table — Rue Islamabad" },
      { name: "description", content: "Reserve a table at Rue, F-6 Markaz, Islamabad. Open 8 AM to midnight." },
      { property: "og:title", content: "Reserve a table — Rue Islamabad" },
      { property: "og:description", content: "Reserve a table at Rue, F-6 Markaz, Islamabad." },
    ],
  }),
  component: ReservePage,
});

const times = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
];

function ReservePage() {
  const reserve = useServerFn(submitReservation);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await reserve({
        data: {
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          party_size: Number(fd.get("party_size") ?? 0),
          reserve_date: String(fd.get("reserve_date") ?? ""),
          reserve_time: String(fd.get("reserve_time") ?? ""),
          notes: String(fd.get("notes") ?? "") || undefined,
        },
      });
      setDone(true);
      toast.success("Reservation request received. We'll call to confirm.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit reservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Thank you</p>
          <h1 className="mt-4 font-display text-5xl text-foreground">A table is held.</h1>
          <p className="mt-6 text-muted-foreground">
            We've received your request and will call you shortly to confirm.
            See you soon.
          </p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">Reserve</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground">
            Book a table
          </h1>
          <p className="mt-5 text-muted-foreground">
            Evenings fill up after seven. We'll call you to confirm.
          </p>
          <div className="mt-10 hairline w-24 mx-auto" />
        </div>

        <form onSubmit={onSubmit} className="mt-12 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Name">
              <input name="name" required minLength={2} maxLength={80} className={inputCls} />
            </Field>
            <Field label="Phone">
              <input name="phone" required type="tel" minLength={7} maxLength={20} className={inputCls} placeholder="03XX XXXXXXX" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Field label="Date">
              <input name="reserve_date" required type="date" min={today} className={inputCls} />
            </Field>
            <Field label="Time">
              <select name="reserve_time" required className={inputCls} defaultValue="">
                <option value="" disabled>Choose time</option>
                {times.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Guests">
              <input name="party_size" required type="number" min={1} max={20} defaultValue={2} className={inputCls} />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea name="notes" rows={3} maxLength={500} className={inputCls} placeholder="Birthday, dietary needs, seating preferences…" />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-brass bg-brass text-primary-foreground px-7 py-4 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Request reservation
          </button>
        </form>
      </div>
    </SiteShell>
  );
}

const inputCls =
  "w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brass transition-colors text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
