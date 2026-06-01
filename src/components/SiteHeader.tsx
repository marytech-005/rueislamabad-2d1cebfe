import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import rueLogo from "@/assets/rue-logo.jpg.asset.json";


const links = [
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/story", label: "Story" },
  { to: "/reserve", label: "Reserve" },
] as const;

export function SiteHeader() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  // Avoid SSR/hydration mismatch from persisted localStorage state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={rueLogo.url}
            alt="Rue"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/order"
          className="relative flex items-center gap-2 text-sm text-foreground hover:text-brass transition-colors"
          aria-label="View cart"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Cart</span>
          {mounted && count > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-[10px] font-medium text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-center gap-6 pb-3 -mt-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
