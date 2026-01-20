import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/kv";

export async function POST() {
  const ok = await seedDatabase();
  return NextResponse.json({ success: ok });
}
