import { NextResponse } from "next/server";

// Demo login — bypasses Supabase auth for local testing
// Remove this file before deploying to production
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("demo_admin", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("demo_admin");
  return response;
}
