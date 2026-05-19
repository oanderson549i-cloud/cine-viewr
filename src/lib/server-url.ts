const KEY = "cineroom_server_url";

export function getServerUrl(): string {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem(KEY) || "").replace(/\/+$/, "");
}

export function setServerUrl(url: string) {
  localStorage.setItem(KEY, url.replace(/\/+$/, ""));
}

export function buildUrl(path: string): string {
  const base = getServerUrl();
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export interface Video {
  name: string;
  size: number;
  url: string;
}
