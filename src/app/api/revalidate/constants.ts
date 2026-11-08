export const REVALIDATE_SECRET_HEADER = "x-revalidate-secret";

export const SECRET_DIGEST_ALGORITHM = "sha256";

export const REVALIDATE_ERROR = {
  SECRET_NOT_CONFIGURED: "secret_not_configured",
  UNAUTHORIZED: "unauthorized",
  INVALID_BODY: "invalid_body",
  NO_KNOWN_TAGS: "no_known_tags",
} as const;
