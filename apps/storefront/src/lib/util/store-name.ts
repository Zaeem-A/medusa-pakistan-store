// The store's public name, used in the header, footer, page titles and
// structured data. Set NEXT_PUBLIC_STORE_NAME in .env.local. This file has no
// server-only import, so client components can use it too.
export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "Store"
