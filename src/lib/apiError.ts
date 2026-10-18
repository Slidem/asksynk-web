export class ApiError extends Error {
  status: number;
  /** Domain error code from the body, e.g. `timers.invalid_transition`. */
  code: string | undefined;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function toApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  const body = await response.json().catch(() => null);
  const code = typeof body?.error === "string" ? body.error : undefined;
  const message =
    typeof body?.message === "string" ? body.message : fallbackMessage;
  return new ApiError(response.status, code, message);
}
