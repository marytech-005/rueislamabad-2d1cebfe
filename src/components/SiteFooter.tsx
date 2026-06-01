import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="font-display text-3xl text-foreground">Rue</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
            Specialty coffee, all-day breakfast, and a quiet corner of F-6 to
            slow down in. We open at eight, we close at midnight.
          </p>
          <a
            href="https://instagram.com/rue_isb"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brass transition-colors"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            @rue_isb
          </a>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Visit</h3>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-brass" strokeWidth={1.5} />
              <span>Third Floor, 1 Agha Khan Rd,<br />F-6 Markaz, Islamabad</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brass" strokeWidth={1.5} />
              <a href="tel:+923376502222" className="hover:text-brass transition-colors">
                0337 6502222
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
              8 AM — 12 AM, daily
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/menu" className="text-foreground/85 hover:text-brass transition-colors">Menu</Link></li>
            <li><Link to="/gallery" className="text-foreground/85 hover:text-brass transition-colors">Gallery</Link></li>
            <li><Link to="/story" className="text-foreground/85 hover:text-brass transition-colors">Our story</Link></li>
            <li><Link to="/reserve" className="text-foreground/85 hover:text-brass transition-colors">Reserve a table</Link></li>
            <li><Link to="/order" className="text-foreground/85 hover:text-brass transition-colors">Order online</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Rue, Islamabad.</span>
          <span className="tracking-widest uppercase">Made with care</span>
        </div>
      </div>
    </footer>
  );
}
