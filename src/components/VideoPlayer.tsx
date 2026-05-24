import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildUrl, type Video } from "@/lib/server-url";

const WATCH_PROGRESS_KEY = "cineroom_watch_progress";

interface Props {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const src = buildUrl(video.url);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
  const el = ref.current;
  if (!el) return;

  const savedRaw = localStorage.getItem(WATCH_PROGRESS_KEY);
  const saved = savedRaw ? JSON.parse(savedRaw) : {};
  const current = saved[video.name];

  if (current?.time && current.time > 10) {
    el.currentTime = current.time;
  }

  el.play().catch(() => {});
}, [video.name]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar ao catálogo
        </Button>
        <h2 className="hidden truncate text-lg font-semibold text-white sm:block">
          {video.name.replace(/\.[^.]+$/, "").replace(/[._]/g, " ")}
        </h2>
        <div className="w-32" />
      </div>

      {loading && !error && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-lg text-white">Não foi possível carregar o vídeo.</p>
          <p className="max-w-md text-sm text-white/60">{error}</p>
          <Button onClick={onClose} variant="secondary">Voltar</Button>
        </div>
      )}

      <video
        ref={ref}
        src={src}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="h-full w-full"
        onTimeUpdate={(e) => {
  const el = e.currentTarget;

  const savedRaw = localStorage.getItem(WATCH_PROGRESS_KEY);
  const saved = savedRaw ? JSON.parse(savedRaw) : {};

  saved[video.name] = {
    time: el.currentTime,
    duration: el.duration || 0,
    updatedAt: Date.now(),
  };

  localStorage.setItem(WATCH_PROGRESS_KEY, JSON.stringify(saved));
}}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError("Verifique se a URL do servidor está correta e acessível.");
        }}

      />
      <div className="absolute bottom-20 right-4 z-50">
  <button
    onClick={() => {
      if (navigator.share) {
        navigator.share({
          title: "Assistir na TV",
          text: "Abrir filme no Web Video Caster",
          url: src,
        });
      } else {
        window.open(src, "_blank");
      }
    }}
    className="rounded-lg bg-black/80 px-4 py-2 text-sm font-medium text-white backdrop-blur"
  >
    Assistir na TV
  </button>
</div>
    </div>
  );
}
