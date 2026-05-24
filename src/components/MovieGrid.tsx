import { MovieCard } from "./MovieCard";
import type { Video } from "@/lib/server-url";

interface Props {
  videos: Video[];
  onPlay: (v: Video) => void;
  compact?: boolean;
}

export function MovieGrid({ videos, onPlay, compact = false }: Props) {
  if (videos.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Nenhum filme encontrado.
      </div>
    );
  }
  return (
    <div
  className={
    compact
      ? "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  }
>
      {videos.map((v) => (
        <MovieCard key={v.name} video={v} onPlay={onPlay} />
      ))}
    </div>
  );
}
