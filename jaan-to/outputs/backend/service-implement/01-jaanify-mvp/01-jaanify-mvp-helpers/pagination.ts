// ---------------------------------------------------------------------------
// Cursor-based pagination helper for Prisma
// ---------------------------------------------------------------------------

/**
 * Encode a record ID into an opaque, URL-safe cursor string.
 * Uses base64url so the cursor can be passed in query parameters without
 * percent-encoding.
 */
export function encodeCursor(id: string): string {
  return Buffer.from(id).toString('base64url');
}

/**
 * Decode an opaque cursor back to the original record ID.
 */
export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64url').toString('utf8');
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CursorPaginationParams {
  cursor?: string;
  /** Number of items per page. Clamped to 1..100, defaults to 20. */
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    /** Opaque cursor pointing to the last item, or `null` if no data. */
    cursor: string | null;
    /** `true` when more items exist beyond this page. */
    has_more: boolean;
    /** The effective limit used for this page. */
    limit: number;
  };
}

// ---------------------------------------------------------------------------
// Pagination function
// ---------------------------------------------------------------------------

/**
 * Generic cursor-based paginator that wraps a Prisma `findMany` call.
 *
 * Uses the "fetch one extra" pattern (`take: limit + 1`) to detect whether
 * more records exist without issuing a separate count query.
 *
 * @param findMany - A bound Prisma `findMany` function (e.g. `prisma.task.findMany`).
 *   Uses `Record<string, unknown>` for the args parameter because Prisma generates
 *   model-specific arg types that cannot be expressed generically without `any`.
 *   This is an intentional type-boundary trade-off at the utility layer.
 * @param params   - Cursor and limit from the request query string.
 * @param baseArgs - Additional Prisma query args (where, include, select, orderBy, etc.).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma findMany args are model-specific generated types; see JSDoc above.
export async function paginateWithCursor<T extends { id: string }>(
  findMany: (args: any) => Promise<T[]>,
  params: CursorPaginationParams,
  baseArgs: Record<string, unknown> = {},
): Promise<PaginatedResponse<T>> {
  const limit = Math.min(Math.max(params.limit || 20, 1), 100);

  const args: Record<string, unknown> = {
    ...baseArgs,
    take: limit + 1,
    orderBy: baseArgs['orderBy'] ?? { createdAt: 'desc' as const },
  };

  if (params.cursor) {
    args['cursor'] = { id: decodeCursor(params.cursor) };
    args['skip'] = 1; // skip the cursor record itself
  }

  const items = await findMany(args);
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const lastItem = data[data.length - 1] as T | undefined;

  return {
    data,
    pagination: {
      cursor: lastItem ? encodeCursor(lastItem.id) : null,
      has_more: hasMore,
      limit,
    },
  };
}
