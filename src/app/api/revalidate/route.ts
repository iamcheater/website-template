import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import {
  CACHE_TAGS,
  CONTENT_CACHE_PROFILE,
  HTTP_STATUS,
  type CacheTag,
} from "@/api/constants";
import {
  REVALIDATE_ERROR,
  REVALIDATE_SECRET_HEADER,
  SECRET_DIGEST_ALGORITHM,
} from "./constants";

const digest = (value: string) =>
  createHash(SECRET_DIGEST_ALGORITHM).update(value).digest();

const isSameSecret = (provided: string, expected: string): boolean =>
  timingSafeEqual(digest(provided), digest(expected));

const isCacheTag = (value: unknown): value is CacheTag =>
  CACHE_TAGS.includes(value as CacheTag);

async function readTags(request: NextRequest): Promise<unknown[] | null> {
  try {
    const payload = (await request.json()) as { tags?: unknown };
    return Array.isArray(payload?.tags) ? payload.tags : null;
  } catch {
    return null;
  }
}

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return fail(
      REVALIDATE_ERROR.SECRET_NOT_CONFIGURED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  const provided = request.headers.get(REVALIDATE_SECRET_HEADER);
  if (!provided || !isSameSecret(provided, secret)) {
    return fail(REVALIDATE_ERROR.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const requested = await readTags(request);
  if (!requested) {
    return fail(REVALIDATE_ERROR.INVALID_BODY, HTTP_STATUS.BAD_REQUEST);
  }

  const tags = [...new Set(requested.filter(isCacheTag))];
  if (tags.length === 0) {
    return fail(REVALIDATE_ERROR.NO_KNOWN_TAGS, HTTP_STATUS.BAD_REQUEST);
  }

  for (const tag of tags) revalidateTag(tag, CONTENT_CACHE_PROFILE);

  return NextResponse.json({ revalidated: tags });
}
