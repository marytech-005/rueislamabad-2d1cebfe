import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import heroImg from "@/assets/hero.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import sandwichImg from "@/assets/sandwich.jpg";
import pastaImg from "@/assets/pasta.jpg";
import interiorImg from "@/assets/interior.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Rue Islamabad" },
      { name: "description", content: "A look inside Rue — the candlelit room, the coffee bar, the all-day kitchen in F-6 Markaz, Islamabad." },
      { property: "og:title", content: "Gallery — Rue Islamabad" },
      { property: "og:description", content: "A look inside Rue — the room, the coffee, the kitchen." },
      { property: "og:url", content: "https://rueislamabad.lovable.app/gallery" },
    ],
    links: [
      { rel: "canonical", href: "https://rueislamabad.lovable.app/gallery" },
    ],
  }),
  component: GalleryPage,
});

const images = [
  { src: heroImg, alt: "Candlelit interior at dusk", aspect: "tall" },
  { src: coffeeImg, alt: "Iced specialty latte with pistachio croissant", aspect: "tall" },
  { src: interiorImg, alt: "Rattan chairs, pampas grass, low pendant lighting", aspect: "wide" },
  { src: sandwichImg, alt: "Hot honey sandwich on brioche", aspect: "tall" },
  { src: pastaImg, alt: "Rigatoni in rose sauce with halloumi", aspect: "tall" },
];

export default GalleryPage;

function GalleryPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brass">A look inside</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground">Gallery</h1>
        <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
          The room, the kitchen, the quiet corners.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {images.map((img, i) => (
          <figure
            key={i}
            className={
              img.aspect === "wide"
                ? "md:col-span-2 aspect-[16/9] overflow-hidden bg-surface"
                : "aspect-[4/5] overflow-hidden bg-surface"
            }
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </figure>
        ))}
      </div>
    </SiteShell>
  );
}
