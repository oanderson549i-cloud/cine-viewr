import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cineroom — Seu catálogo de filmes" },
      { name: "description", content: "Catálogo de filmes em streaming progressivo estilo Netflix." },
      { property: "og:title", content: "Cineroom" },
      { property: "og:description", content: "Catálogo de filmes em streaming progressivo." },
    ],
  }),
  component: Index,
});

function Index() {
  return <HomePage />;
}
