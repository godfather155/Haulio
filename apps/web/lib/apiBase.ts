const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!apiUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
}

export const API_BASE = apiUrl.replace(/\/+$/, "");
