const REFRESHABLE_AUTH_ERRORS = new Set([
  "TOKEN_EXPIRED",
  "TOKEN_NOT_PROVIDED",
]);

export function getAuthErrorCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const error = (data as { error?: unknown }).error;
  return typeof error === "string" ? error : undefined;
}

export function shouldAttemptTokenRefresh(
  status: number | undefined,
  data: unknown,
): boolean {
  if (status !== 401) {
    return false;
  }

  const code = getAuthErrorCode(data);
  return code !== undefined && REFRESHABLE_AUTH_ERRORS.has(code);
}
