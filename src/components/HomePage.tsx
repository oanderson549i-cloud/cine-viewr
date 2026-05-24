import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2, Search, Settings, Play, Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "./MovieGrid";
import { VideoPlayer } from "./VideoPlayer";
import { SettingsModal } from "./SettingsModal";
import { getServerUrl, buildUrl, type Video } from "@/lib/server-url";

export function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [initializing, setInitializing] = useState(true);

  const load = useCallback(async () => {
   const base = getServerUrl();
setServerUrl(base);

  if (!base) {
    setLoading(false);
    return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl("/videos"));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Video[];
      setVideos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar vídeos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  async function setupServer() {
    try {

    const response = await fetch(
  `https://raw.githubusercontent.com/oanderson549i-cloud/cine-viewr/main/public/server.json?t=${Date.now()}`
);

      const data = await response.json();

    if (data.server) {
  const cleanServer = data.server.replace(/\/+$/, "");
  localStorage.setItem("cineroom_server_url", cleanServer);
  setServerUrl(cleanServer);
  setSettingsOpen(false);
}
      
    } catch (error) {
      console.error("Erro ao carregar servidor:", error);
    }

    load();
  }

  setupServer();
}, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter((v) => v.name.toLowerCase().includes(q));
  }, [videos, query]);

  const featured = videos[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-30 w-full bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center gap-4 px-4 py-4 md:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            CINEROOM
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar filmes..."
                className="w-44 border-border bg-secondary/80 pl-9 backdrop-blur focus-visible:ring-primary sm:w-64"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {featured && !query && (
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 md:px-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Em destaque
            </p>
            <h2 className="max-w-2xl text-4xl font-extrabold md:text-6xl">
              {featured.name.replace(/\.[^.]+$/, "").replace(/[._]/g, " ")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Assista agora em streaming progressivo direto do seu servidor.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setPlaying(featured)} className="gap-2">
                <Play className="h-5 w-5 fill-current" /> Assistir
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                className="gap-2"
              >
                <Info className="h-5 w-5" /> Ver catálogo
              </Button>
            </div>
          </div>
        </section>
      )}

      <main id="catalog" className="px-4 pb-16 pt-24 md:px-8">
        {!featured && <div className="h-8" />}
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-bold md:text-2xl">
            {query ? `Resultados (${filtered.length})` : "Catálogo"}
          </h2>
          {serverUrl && (
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {serverUrl}
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-destructive" />
            <p className="font-semibold">Erro ao carregar</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={load} variant="secondary">Tentar novamente</Button>
              <Button onClick={() => setSettingsOpen(true)}>Configurar servidor</Button>
            </div>
          </div>
        )}

        {!loading && !error && !serverUrl && (
          <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 text-center">
            <p className="font-semibold">Configure o servidor para começar</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Informe a URL pública do seu backend (ex: Cloudflare Tunnel).
            </p>
            <Button className="mt-4" onClick={() => setSettingsOpen(true)}>
              Configurar
            </Button>
          </div>
        )}

        {!loading && !error && serverUrl && (
          <MovieGrid videos={filtered} onPlay={setPlaying} />
        )}
      </main>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSaved={load}
      />
    </div>
  );
}
