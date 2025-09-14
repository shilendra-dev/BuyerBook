import { db } from "@/db";
import { buyers, buyerHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { BuyerUpdateInput } from "../validators/buyerValidator";
import { fetchBuyerById } from "./fetchBuyerById";
import { BuyerNotFoundError, ConcurrencyError } from "../errors/buyerErrors";

// Type for the diff structure
type FieldDiff = {
  from: any;
  to: any;
};

type BuyerDiff = Record<string, FieldDiff>;

export async function updateBuyer(
  buyerId: string,
  data: BuyerUpdateInput,
  expectedUpdatedAt: Date,
  updatedById: string
) {
  return await db.transaction(async (tx) => {
    // 1. Fetch current buyer for concurrency check
    const [currentBuyer] = await fetchBuyerById(buyerId);

    if (!currentBuyer) {
      throw new BuyerNotFoundError(buyerId);
    }

    // 2. Concurrency control - compare updatedAt timestamps
    if (currentBuyer.updatedAt.getTime() !== expectedUpdatedAt.getTime()) {
      throw new ConcurrencyError(
        "The buyer record has been modified by another user. Please refresh and try again."
      );
    }

    // 3. Calculate diff between current and new data
    const diff: BuyerDiff = {};
    const updatableFields = [
      "fullName",
      "email",
      "phone",
      "city",
      "propertyType",
      "bhk",
      "purpose",
      "budgetMin",
      "budgetMax",
      "timeline",
      "source",
      "status",
      "notes",
      "tags",
    ] as const;

    updatableFields.forEach((field) => {
      const newValue = data[field];
      const currentValue = currentBuyer[field];

      if (newValue !== undefined && !isEqual(newValue, currentValue)) {
        diff[field] = {
          from: currentValue,
          to: newValue,
        };
      }
    });

    // 4. If no changes, return current buyer
    if (Object.keys(diff).length === 0) {
      return {
        buyer: currentBuyer,
        historyId: null,
        message: "No changes detected",
      };
    }

    // 5. Update buyer record
    const now = new Date();
    const [updatedBuyer] = await tx
      .update(buyers)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(buyers.id, buyerId))
      .returning();

    // 6. Create history record
    const historyId = uuidv4();
    await tx.insert(buyerHistory).values({
      id: historyId,
      buyerId: buyerId,
      changedBy: updatedById,
      changedAt: now,
      diff: diff,
    });

    return {
      buyer: updatedBuyer,
      historyId: historyId,
      message: "Buyer updated successfully",
    };
  });
}

// Helper function to compare values (handles arrays and objects)
function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }

  return false;
}
