import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { lessonMeta } from "@/content/lessons";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/learn/")) {
    return NextResponse.next();
  }

  const parts = pathname.split("/").filter(Boolean); // e.g. ["learn", "slug"]
  if (parts.length !== 2) {
    return NextResponse.next();
  }

  const [, maybeSlug] = parts;

  // If it's exactly a category path, let the category route handle it.
  const categories = new Set(Object.values(lessonMeta).map((meta) => meta.category));
  if (categories.has(maybeSlug)) {
    return NextResponse.next();
  }

  const meta = lessonMeta[maybeSlug];
  if (meta) {
    const url = req.nextUrl.clone();
    url.pathname = `/learn/${meta.category}/${meta.slug}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/learn/:path*"],
};
