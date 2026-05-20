const TMDB_API_KEY = "46581f63acf9000daab58a1b55b36290";

export interface TMDBMovie {
  poster: string | null;
  backdrop: string | null;
  overview: string;
  title: string;
}

function cleanTitle(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[._]/g, " ")
    .replace(/\b(1080p|720p|2160p|x264|x265|bluray|web-dl|dublado|dual audio)\b/gi, "")
    .trim();
}

export async function fetchMovieData(fileName: string): Promise<TMDBMovie | null> {
  try {
    const query = encodeURIComponent(cleanTitle(fileName));

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=pt-BR`
    );

    const data = await res.json();

    const movie = data.results?.[0];

    if (!movie) return null;

    return {
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
    };
  } catch {
    return null;
  }
}
