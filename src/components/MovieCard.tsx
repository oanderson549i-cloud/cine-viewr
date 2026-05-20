import { useEffect, useRef, useState } from "react";
import { Play, Film } from "lucide-react";
import { buildUrl, type Video } from "@/lib/server-url";
import { fetchMovieData } from "@/lib/tmdb";

interface Props {
  video: Video;
  onPlay: (v: Video) => void;
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

function prettyName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[._]/g, " ");
}

export function MovieCard({ video, onPlay }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [poster, setPoster] = useState<string | null>(null);
  const src = buildUrl(video.url);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    let cancelled = false;
    fetchMovieData(video.name).then((data) => {
  if (!cancelled && data?.poster) {
    setPoster(data.poster);
  }
});

    const capture = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = el.videoWidth || 640;
        canvas.height = el.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg", 0.7);
        if (!cancelled) setThumb(data);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const onLoaded = () => {
      try { el.currentTime = Math.min(5, (el.duration || 10) / 3); } catch { capture(); }
    };
    const onSeeked = () => capture();
    const onError = () => setFailed(true);

    el.addEventListener("loadeddata", onLoaded);
    el.addEventListener("seeked", onSeeked);
    el.addEventListener("error", onError);

    return () => {
      cancelled = true;
      el.removeEventListener("loadeddata", onLoaded);
      el.removeEventListener("seeked", onSeeked);
      el.removeEventListener("error", onError);
    };
  }, [src]);

  return (
    <button
      onClick={() => onPlay(video)}
      className="group relative aspect-[2/3] overflow-hidden rounded-md bg-card text-left transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/60 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {thumb ? (
        <img src={thumb} alt={prettyName(video.name)} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-card">
          <Film className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {!thumb && !failed && (
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          muted
          playsInline
          crossOrigin="anonymous"
          className="hidden"
        />
      )}

      <div className="pointer-events-none absolute inset-0 gradient-card" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow">
          {prettyName(video.name)}
        </h3>
        <p className="mt-0.5 text-xs text-white/70">{formatSize(video.size)}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl">
          <Play className="h-6 w-6 fill-current" />
        </div>
      </div>
    </button>
  );
}
