import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import interiorImg from "@/assets/interior.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Rue Islamabad" },
      {
        name: "description",
        content:
          "Rue opened on the third floor of 1 Agha Khan Road in F-6 Markaz. A specialty coffee house and all-day kitchen built around slow mornings and quiet evenings.",
      },
      { property: "og:title", content: "Our Story — Rue Islamabad" },
      { property: "og:description", content: "A specialty coffee house and all-day kitchen in F-6 Markaz, Islamabad." },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-brass text-center">Our story</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-foreground text-center">
          A room on the third floor
        </h1>
        <div className="mt-10 hairline w-24 mx-auto" />

        <div className="mt-12 prose-rue space-y-6 text-foreground/85 leading-relaxed text-lg font-light">
          <p>
            Rue began as a small idea: a quiet room in Islamabad where you could
            order an espresso at eight in the morning and a plate of pasta at
            ten at night, without anyone hurrying you along.
          </p>
          <p>
            We opened on the third floor of 1 Agha Khan Road in F-6 Markaz —
            above the noise, behind the trees. We light candles in the
            afternoon. We pour single-origin from a roaster in Lahore. We make
            the bread, the pasta, and the pastries in-house, every morning.
          </p>
          <p>
            The menu is short on purpose. Breakfast is all day. The sandwiches
            are honest. The desserts are worth saving room for.
          </p>
          <p>
            Come in alone with a book. Come for brunch with friends. Come for a
            slow evening with someone you like. The chairs are warm. The
            lighting is low. There is no rush.
          </p>
        </div>
      </article>

      <section className="relative my-16">
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img
            src={interiorImg}
            alt="The room at Rue"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/30" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="font-display text-3xl text-foreground text-center">Find us</h2>
        <div className="mt-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div className="text-center">
            <MapPin className="h-5 w-5 text-brass mx-auto" strokeWidth={1.5} />
            <p className="mt-3 text-muted-foreground">Address</p>
            <p className="mt-1 text-foreground">Third Floor,<br />1 Agha Khan Rd,<br />F-6 Markaz, Islamabad</p>
          </div>
          <div className="text-center">
            <Clock className="h-5 w-5 text-brass mx-auto" strokeWidth={1.5} />
            <p className="mt-3 text-muted-foreground">Hours</p>
            <p className="mt-1 text-foreground">8 AM — 12 AM<br />Daily</p>
          </div>
          <div className="text-center">
            <Phone className="h-5 w-5 text-brass mx-auto" strokeWidth={1.5} />
            <p className="mt-3 text-muted-foreground">Reach us</p>
            <p className="mt-1 text-foreground">
              <a href="tel:+923376502222" className="hover:text-brass">0337 6502222</a>
            </p>
            <a
              href="https://instagram.com/rue_isb"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-brass hover:underline"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
              @rue_isb
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
