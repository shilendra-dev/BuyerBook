import { db } from "@/db";
import { buyers } from "@/db/schema";
import { eq, and, ilike, asc, desc, count } from "drizzle-orm";

export interface filterOptions {
    city?: "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other";
    propertyType?: "Apartment" | "Villa" | "Plot" | "Office" | "Retail";
    status?: "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped";
    timeline?: "0-3m" | "3-6m" | ">6m" | "Exploring";
    searchQuery?: string;
}

export interface sortOptions {
    sortOrder: "asc" | "desc";
}

export interface paginationResult<T> {
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

export interface PaginationOptions { // will convert to number
    page: string;
    limit: string;
}


// we have to select rows from table buyers where:
// 1. city column matches city
// 2. propertyType column matches propertyType
// 3. status column matches status
// 4. timeline column matches timeline
// 5. searchQuery is a substring of fullName column
// 6. sortBy column is sorted in sortOrder

export async function fetchAllBuyers(filters: filterOptions, pagination: PaginationOptions, sortOptions: sortOptions): Promise<paginationResult<any>> {
    const page = parseInt(pagination.page) || 1;
    const limit = Math.min(parseInt(pagination.limit) || 10, 100);
    const offset = (page - 1) * limit;

    // gives the total count of rows w.r.t filters without pagination
    const [{ totalCount }] = await db.select({ totalCount: count() }).from(buyers).where(
        and(
            filters.city && eq(buyers.city, filters.city),
            filters.propertyType && eq(buyers.propertyType, filters.propertyType),
            filters.status && eq(buyers.status, filters.status),
            filters.timeline && eq(buyers.timeline, filters.timeline),

            // filters.searchQuery && ilike(buyers.fullName, `%${filters.searchQuery}%`),
            filters.searchQuery ? ilike(buyers.fullName, `%${filters.searchQuery}%`) : undefined,
        )
    );


    const result = await
        db.select().from(buyers).where(
            and(
                filters.city && eq(buyers.city, filters.city),
                filters.propertyType && eq(buyers.propertyType, filters.propertyType),
                filters.status && eq(buyers.status, filters.status),
                filters.timeline && eq(buyers.timeline, filters.timeline),

                // filters.searchQuery && ilike(buyers.fullName, `%${filters.searchQuery}%`),
                filters.searchQuery ? ilike(buyers.fullName, `%${filters.searchQuery}%`) : undefined,
            )
        )
            .orderBy(
                sortOptions.sortOrder === "asc" ? asc(buyers.updatedAt) : desc(buyers.updatedAt)
            )
            .limit(limit)
            .offset(offset); //Pagination
    return {
        data: result,
        pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: page < Math.ceil(totalCount / limit),
            hasPrev: page > 1,
        }
    };
}