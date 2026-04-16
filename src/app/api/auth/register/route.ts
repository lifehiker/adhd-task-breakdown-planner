import { NextRequest, NextResponse } from "next/server";
import { isPrismaAvailable, prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!isPrismaAvailable) {
      return NextResponse.json(
        { error: "Database is not configured yet. Set DATABASE_URL before creating accounts." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const data = RegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
