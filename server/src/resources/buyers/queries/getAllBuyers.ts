import { db } from "@/db";
import { buyers } from "@/db/schema";
import { count } from "drizzle-orm";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getAllBuyers(
  options: PaginationOptions = {}
): Promise<PaginatedResult<any>> {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 10, 100); // Max 100 per page
  const offset = (page - 1) * limit;

  // Get total count
  const [{ totalCount }] = await db
    .select({ totalCount: count() })
    .from(buyers);

  // Get paginated data
  const data = await db.select().from(buyers).limit(limit).offset(offset);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
