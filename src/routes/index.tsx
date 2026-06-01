import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import heroImg from "@/assets/hero.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import sandwichImg from "@/assets/sandwich.jpg";
import pastaImg from "@/assets/pasta.jpg";
import interiorImg from "@/assets/interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rue — Specialty Coffee & All-Day Kitchen, Islamabad" },
      {
        name: "description",
        content:
          "Rue is a candlelit cafe in F-6 Markaz, Islamabad — specialty coffee, all-day breakfast, sandwiches, and pastas. Open 8 AM to midnight.",
      },
      { property: "og:title", content: "Rue — Specialty Coffee & All-Day Kitchen, Islamabad" },
      {
        property: "og:description",
        content: "A candlelit cafe in F-6 Markaz, Islamabad. Specialty coffee, all-day breakfast, sandwiches and pastas.",
      },
      { property: "og:url", content: "https://rueislamabad.lovable.app/" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52887801-1096-4b0c-b789-2b4a3ae86363/id-preview-c53b343e--3512d777-fad0-4406-8ffe-d1eff16d40d2.lovable.app-1780247609261.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52887801-1096-4b0c-b789-2b4a3ae86363/id-preview-c53b343e--3512d777-fad0-4406-8ffe-d1eff16d40d2.lovable.app-1780247609261.png" },
    ],
    links: [
      { rel: "canonical", href: "https://rueislamabad.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          name: "Rue",
          url: "https://rueislamabad.lovable.app/",
          telephone: "+92-337-6502222",
          servesCuisine: ["Coffee", "Breakfast", "Sandwiches", "Pasta"],
          priceRange: "₨₨",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Third Floor, 1 Agha Khan Road, F-6 Markaz",
            addressLocality: "Islamabad",
            addressCountry: "PK",
          },
          openingHours: "Mo-Su 08:00-24:00",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={heroImg}
          alt="Candlelit interior of Rue cafe at dusk, a barista pulling espresso"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 h-full flex flex-col justify-end pb-24 fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">F-6 Markaz, Islamabad</p>
          <h1 className="mt-4 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] text-foreground max-w-3xl">
            Slow mornings.<br />Quiet evenings.
          </h1>
          <p className="mt-6 max-w-md text-base text-foreground/80 leading-relaxed">
            A candlelit room on Agha Khan Road, pouring specialty coffee from
            eight to midnight. Stay a while.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="border border-brass bg-brass text-primary-foreground px-7 py-3 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors"
            >
              View menu
            </Link>
            <Link
              to="/reserve"
              className="border border-foreground/30 text-foreground px-7 py-3 text-xs uppercase tracking-widest hover:border-brass hover:text-brass transition-colors"
            >
              Reserve a table
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">Est. 2024</p>
        <h2 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-foreground">
          The kind of place you stay longer than you meant to.
        </h2>
        <p className="mt-8 text-base text-muted-foreground leading-relaxed">
          We brew specialty single-origin, serve breakfast all day, and make
          pasta the way it ought to be made. The chairs are warm, the lighting
          is low, and there is no rush.
        </p>
        <div className="mt-10 hairline w-32 mx-auto" />
      </section>

      {/* Signature dishes */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass">Signatures</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">From the kitchen</h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline text-xs uppercase tracking-widest text-muted-foreground hover:text-brass transition-colors"
          >
            See full menu →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { img: coffeeImg, name: "Iced Spanish Latte", price: "Rs 925", note: "Specialty coffee" },
            { img: sandwichImg, name: "Hot Honey Sandwich", price: "Rs 1,450", note: "Sandwiches" },
            { img: pastaImg, name: "Rigatoni in Rose", price: "Rs 1,650", note: "Pastas" },
          ].map((d) => (
            <div key={d.name} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-surface">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{d.note}</p>
                  <h3 className="mt-1 font-display text-2xl text-foreground">{d.name}</h3>
                </div>
                <span className="text-sm text-brass">{d.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room band */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[440px] overflow-hidden">
          <img
            src={interiorImg}
            alt="The room at Rue: rattan chairs, pampas grass, low pendant light"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40" />
          <div className="relative z-10 mx-auto max-w-3xl h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-brass">The room</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground">
              Third floor, candlelight, a quiet view of F-6.
            </h2>
            <Link
              to="/story"
              className="mt-8 text-xs uppercase tracking-widest text-foreground/85 border-b border-brass/60 pb-1 hover:text-brass transition-colors"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-foreground">A table is waiting.</h2>
        <p className="mt-5 text-muted-foreground">
          Book ahead for evenings — the room fills up after seven.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/reserve"
            className="border border-brass bg-brass text-primary-foreground px-7 py-3 text-xs uppercase tracking-widest hover:bg-transparent hover:text-brass transition-colors"
          >
            Reserve a table
          </Link>
          <Link
            to="/order"
            className="border border-foreground/30 text-foreground px-7 py-3 text-xs uppercase tracking-widest hover:border-brass hover:text-brass transition-colors"
          >
            Order for delivery
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
