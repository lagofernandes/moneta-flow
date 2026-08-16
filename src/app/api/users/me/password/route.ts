import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória."),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
});

// Using the same simple SHA-256 hash logic from auth.ts
// For production, use bcrypt/argon2
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Fetch user from DB to get the current hash
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRecords[0];

    // If user has a password (they might be OAuth only)
    if (user.passwordHash) {
      const currentHash = await hashPassword(currentPassword);
      if (currentHash !== user.passwordHash) {
        return NextResponse.json({ error: "A senha atual está incorreta." }, { status: 400 });
      }
    } else {
      // User registered with Google but is trying to set a password
      // We can allow it, or block it. Usually we allow setting a password if they don't have one,
      // but they shouldn't need to provide currentPassword in that case.
      // For simplicity, we require currentPassword, so if it's OAuth only, we reject.
      return NextResponse.json(
        { error: "Contas vinculadas via Google não possuem senha atual." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
