import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

//Get user role
export async function getUser(id : string){
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0];
}