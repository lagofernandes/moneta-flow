import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all categories
    const allCategories = await db.select().from(categories);

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
