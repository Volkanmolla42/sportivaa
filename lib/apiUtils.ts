import { NextResponse } from "next/server";
import { formatError } from "./utils";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiResponse<T>(
  data?: T,
  status: number = 200,
  message?: string
): ApiResponse<T> {
  return {
    data,
    status,
    message,
  };
}

export function createErrorResponse(
  error: unknown,
  status: number = 400
): ApiResponse<null> {
  const message = formatError(error);
  return {
    error: message,
    status,
    message,
  };
}

export async function withErrorHandler<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    return NextResponse.json(createApiResponse(result));
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        createErrorResponse(error.message, error.statusCode)
      );
    }

    return NextResponse.json(createErrorResponse(error));
  }
}

export function validateRequestBody<T extends Record<string, unknown>>(
  body: unknown,
  requiredFields: Array<keyof T>
): asserts body is T {
  if (!body || typeof body !== "object") {
    throw new ApiError("Invalid request body");
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      throw new ApiError(`Missing required field: ${String(field)}`);
    }
  }
}

export function withValidation<T, R>(
  schema: { validate: (data: unknown) => T },
  handler: (data: T) => Promise<R>
): (data: unknown) => Promise<R> {
  return async (data: unknown) => {
    try {
      const validated = schema.validate(data);
      return await handler(validated);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      throw error;
    }
  };
}
