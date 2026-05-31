import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="font-display text-5xl text-foreground mt-3">Lost the way</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page doesn't exist. Find your way back to a quiet table.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-brass/60 px-6 py-2.5 text-xs uppercase tracking-widest text-brass hover:bg-brass hover:text-primary-foreground transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Something went quiet</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We hit a snag on our end. Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-brass/60 px-5 py-2 text-xs uppercase tracking-widest text-brass hover:bg-brass hover:text-primary-foreground transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-border px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:text-brass transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rue — Specialty Coffee & All-Day Kitchen, Islamabad" },
      {
        name: "description",
        content:
          "Rue is a quiet, candlelit cafe on Agha Khan Road, F-6 Markaz, Islamabad. Specialty coffee, all-day breakfast, sandwiches, and pastas. Order online or reserve a table.",
      },
      { name: "author", content: "Rue Islamabad" },
      { property: "og:title", content: "Rue — Specialty Coffee & All-Day Kitchen, Islamabad" },
      {
        property: "og:description",
        content:
          "A quiet candlelit cafe in F-6 Markaz, Islamabad. Specialty coffee, all-day breakfast, sandwiches, pastas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1c1813" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.22 0.014 60)",
            color: "oklch(0.92 0.018 75)",
            border: "1px solid oklch(0.28 0.012 60)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
