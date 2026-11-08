export const CACHE_TAG = {
  SITE_SETTINGS: "site-settings",
} as const;

export type CacheTag = (typeof CACHE_TAG)[keyof typeof CACHE_TAG];

export const CACHE_TAGS: readonly CacheTag[] = Object.values(CACHE_TAG);

export const CONTENT_CACHE_PROFILE = "max";

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export const HTTP_STATUS = {
  NETWORK_FAILURE: 0,
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const JSON_CONTENT_TYPE = "application/json";

export const API_ERROR = {
  BASE_URL_MISSING: "API_BASE_URL is not configured",
  UNREACHABLE: "Backend is unreachable",
} as const;
