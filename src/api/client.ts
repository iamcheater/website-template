import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import {
  API_ERROR,
  CONTENT_CACHE_PROFILE,
  HTTP_METHOD,
  HTTP_STATUS,
  JSON_CONTENT_TYPE,
  type CacheTag,
  type HttpMethod,
} from "./constants";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

async function request<T>(
  path: string,
  { method = HTTP_METHOD.GET, body }: RequestOptions = {},
): Promise<T> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(HTTP_STATUS.NETWORK_FAILURE, API_ERROR.BASE_URL_MISSING);
  }

  const headers: Record<string, string> = { Accept: JSON_CONTENT_TYPE };
  if (body !== undefined) headers["Content-Type"] = JSON_CONTENT_TYPE;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(HTTP_STATUS.NETWORK_FAILURE, API_ERROR.UNREACHABLE);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === HTTP_STATUS.NO_CONTENT) return undefined as T;

  const rawBody = await response.text();
  return (rawBody ? JSON.parse(rawBody) : undefined) as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(payload.message)) return payload.message.join(". ");
    return payload.message ?? payload.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function getContent<T>(path: string, tag: CacheTag): Promise<T> {
  "use cache";
  cacheLife(CONTENT_CACHE_PROFILE);
  cacheTag(tag);
  return request<T>(path);
}

export function send<T>(
  path: string,
  body: unknown,
  method: HttpMethod = HTTP_METHOD.POST,
): Promise<T> {
  return request<T>(path, { method, body });
}

export async function orNull<T>(pending: Promise<T>): Promise<T | null> {
  try {
    return await pending;
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return null;
  }
}

export type QueryValue = string | number | boolean | string[] | undefined;

export function toQueryString(query: Record<string, QueryValue>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;

    if (Array.isArray(value)) {
      for (const entry of value) if (entry) params.append(key, entry);
      continue;
    }

    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
