import { Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// RFC 9457 Problem Details — Type Registry
// ---------------------------------------------------------------------------

const PROBLEM_TYPES = {
  'validation-error':            { status: 400, title: 'Validation Failed' },
  'authentication-required':     { status: 401, title: 'Authentication Required' },
  'token-expired':               { status: 401, title: 'Token Expired' },
  'insufficient-permissions':    { status: 403, title: 'Insufficient Permissions' },
  'resource-not-found':          { status: 404, title: 'Not Found' },
  'unique-constraint-violation': { status: 409, title: 'Resource Already Exists' },
  'invalid-state-transition':    { status: 409, title: 'Invalid State Transition' },
  'rate-limit-exceeded':         { status: 429, title: 'Rate Limit Exceeded' },
  'openai-unavailable':          { status: 503, title: 'AI Service Unavailable' },
} as const;

export type ProblemType = keyof typeof PROBLEM_TYPES;

/** Base URL prefix for all Jaanify problem type URIs. */
const TYPE_BASE_URI = 'https://api.jaanify.com/errors';

// ---------------------------------------------------------------------------
// ProblemDetail — RFC 9457 response body shape
// ---------------------------------------------------------------------------

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Array<{ detail: string; pointer: string }>;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// BusinessError — throwable error that carries RFC 9457 metadata
// ---------------------------------------------------------------------------

export class BusinessError extends Error {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly instance?: string;
  readonly extensions: Record<string, unknown>;

  constructor(
    type: ProblemType,
    detail: string,
    instance?: string,
    extensions?: Record<string, unknown>,
  ) {
    super(detail);
    this.name = 'BusinessError';

    const entry = PROBLEM_TYPES[type];
    this.type = `${TYPE_BASE_URI}/${type}`;
    this.title = entry.title;
    this.status = entry.status;
    this.instance = instance;
    this.extensions = extensions ?? {};

    // Maintains proper stack trace in V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
  }

  /** Serialize to an RFC 9457 compliant response body. */
  toProblemDetail(): ProblemDetail {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.message,
      ...(this.instance !== undefined && { instance: this.instance }),
      ...this.extensions,
    };
  }
}

// ---------------------------------------------------------------------------
// Convenience factory
// ---------------------------------------------------------------------------

/**
 * Create a plain `ProblemDetail` object without throwing.
 * Useful for building error responses directly in route handlers.
 */
export function createProblemDetail(
  type: ProblemType,
  detail: string,
  instance?: string,
  extensions?: Record<string, unknown>,
): ProblemDetail {
  const entry = PROBLEM_TYPES[type];
  return {
    type: `${TYPE_BASE_URI}/${type}`,
    title: entry.title,
    status: entry.status,
    detail,
    ...(instance !== undefined && { instance }),
    ...extensions,
  };
}

// ---------------------------------------------------------------------------
// Prisma error mapping
// ---------------------------------------------------------------------------

/**
 * Maps well-known Prisma error codes to `BusinessError` instances.
 *
 * Mapping:
 *  - P2002 (unique constraint) -> 409  unique-constraint-violation
 *  - P2003 (foreign key)       -> 409  invalid-state-transition
 *  - P2025 (record not found)  -> 404  resource-not-found
 *
 * Returns `undefined` when the error code is not mapped so callers can
 * fall through to a generic handler.
 */
export function mapPrismaError(
  error: Prisma.PrismaClientKnownRequestError,
  instance?: string,
): BusinessError | undefined {
  switch (error.code) {
    case 'P2002': {
      const target = (error.meta?.['target'] as string[] | undefined) ?? [];
      return new BusinessError(
        'unique-constraint-violation',
        `A record with the given value(s) already exists (fields: ${target.join(', ') || 'unknown'}).`,
        instance,
        { prismaCode: error.code },
      );
    }
    case 'P2003': {
      const field = (error.meta?.['field_name'] as string | undefined) ?? 'unknown';
      return new BusinessError(
        'invalid-state-transition',
        `Referenced record does not exist (field: ${field}).`,
        instance,
        { prismaCode: error.code },
      );
    }
    case 'P2025': {
      return new BusinessError(
        'resource-not-found',
        'The requested record was not found.',
        instance,
        { prismaCode: error.code },
      );
    }
    default:
      return undefined;
  }
}

export { PROBLEM_TYPES };
