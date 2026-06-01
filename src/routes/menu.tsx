import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { SiteShell } from "@/components/SiteShell";
import { getMenu } from "@/lib/cafe.functions";
import { useCart, formatPKR } from "@/lib/cart-store";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const menuQueryOptions = queryOptions({
  queryKey: ["menu"],
  queryFn: () => getMenu(),
});

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Rue Islamabad" },
      {
        name: "description",
        content:
          "Full menu at Rue, F-6 Markaz: specialty coffee, all-day breakfast, sandwiches, pastas, sides and desserts with prices.",
      },
      { property: "og:title", content: "Menu — Rue Islamabad" },
      { property: "og:description", content: "Specialty coffee, all-day breakfast, sandwiches, pastas, sides and desserts." },
      { property: "og:url", content: "https://rueislamabad.lovable.app/menu" },
    ],
    links: [
      { rel: "canonical", href: "https://rueislamabad.lovable.app/menu" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Menu",
          name: "Rue Menu",
          hasMenuSection: [
            { "@type": "MenuSection", name: "Specialty Coffee" },
            { "@type": "MenuSection", name: "All-Day Breakfast" },
            { "@type": "MenuSection", name: "Sandwiches" },
            { "@type": "MenuSection", name: "Pastas" },
            { "@type": "MenuSection", name: "Sides" },
            { "@type": "MenuSection", name: "Desserts" },
          ],
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQueryOptions),
  component: MenuPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="text-sm text-muted-foreground">Couldn't load the menu: {error.message}</p>
      </div>
    </SiteShell>
  ),
});

function MenuPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">The menu</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground">
          Everything we serve
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
          Coffee from sunrise. A kitchen that runs all day. Tap to add anything
          to your bag.
        </p>
        <div className="mt-10 hairline w-24 mx-auto" />
      </div>

      <Suspense fallback={<MenuSkeleton />}>
        <MenuList />
      </Suspense>
    </SiteShell>
  );
}

function MenuSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 bg-surface animate-pulse" />
      ))}
    </div>
  );
}

function MenuList() {
  const { data } = useSuspenseQuery(menuQueryOptions);
  const grouped = data.categories.map((c) => ({
    ...c,
    items: data.items.filter((i) => i.category_id === c.id),
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 space-y-20">
      {grouped.map((cat) => (
        <section key={cat.id}>
          <h2 className="font-display text-3xl text-foreground mb-2">{cat.name}</h2>
          <div className="hairline w-16 mb-8" />
          <ul className="divide-y divide-border/50">
            {cat.items.map((item) => (
              <MenuRow
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description ?? ""}
                price={item.price_pkr}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function MenuRow({
  id, name, description, price,
}: { id: string; name: string; description: string; price: number }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add({ id, name, price });
    setAdded(true);
    toast.success(`${name} added to your bag`);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <li className="py-6 flex items-start gap-6">
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-foreground">{name}</h3>
          <span className="text-sm text-brass whitespace-nowrap">{formatPKR(price)}</span>
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      <button
        onClick={onAdd}
        aria-label={`Add ${name} to cart`}
        className="shrink-0 mt-1 h-9 w-9 inline-flex items-center justify-center border border-border hover:border-brass hover:text-brass text-muted-foreground transition-colors"
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
      </button>
    </li>
  );
}
