export interface ApiErrorResponse {
  message: string;
  error?: string;
  code?: string;
  statusCode: number;
}

export class ApiError extends Error {
  statusCode: number;
  error?: string;
  code?: string;

  constructor(data: ApiErrorResponse) {
    super(data.message);

    this.name = "ApiError";

    this.statusCode = data.statusCode;
    this.error = data.error;
    this.code = data.code;
  }
}
