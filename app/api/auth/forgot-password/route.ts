import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// In-memory store for reset tokens (same pattern as verify route)
const resetTokens = new Map<string, { email: string; expires: number }>();

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { action, email, token, password } = await req.json();

    // Step 1: Send reset email
    if (action === "send") {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const admin = getServiceClient();
      if (!admin) {
        return NextResponse.json({ error: "Service not configured" }, { status: 500 });
      }

      // Check if user exists
      const { data } = await admin.auth.admin.listUsers();
      const userExists = data?.users.some(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      // Always return success to prevent email enumeration
      if (!userExists) {
        return NextResponse.json({ success: true });
      }

      // Generate a reset token
      const resetToken = crypto.randomUUID();
      resetTokens.set(resetToken, {
        email: email.toLowerCase(),
        expires: Date.now() + 30 * 60 * 1000, // 30 minutes
      });

      // Send reset email via Resend
      const baseUrl = req.headers.get("origin") || "https://thefriendlybrands.com";
      const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

      if (process.env.RESEND_API_KEY) {
        try {
          const { resend } = await import("@/lib/resend");
          await resend.emails.send({
            from: "The Friendly Brands <noreply@protegysupplements.com>",
            to: email,
            subject: "Reset your password — The Friendly Brands",
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #1e40af;">The Friendly Brands</h2>
                <p>We received a request to reset your admin password.</p>
                <div style="margin: 24px 0;">
                  <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">If the button doesn't work, copy and paste this link:<br/>${resetUrl}</p>
              </div>
            `,
          });
        } catch (err) {
          console.error("Failed to send reset email:", err);
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
      } else {
        console.log(`[DEV] Password reset link: ${resetUrl}`);
      }

      return NextResponse.json({ success: true });
    }

    // Step 2: Validate token
    if (action === "validate") {
      if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
      }

      const stored = resetTokens.get(token);
      if (!stored || Date.now() > stored.expires) {
        resetTokens.delete(token);
        return NextResponse.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
      }

      return NextResponse.json({ valid: true, email: stored.email });
    }

    // Step 3: Reset password
    if (action === "reset") {
      if (!token || !password) {
        return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }

      const stored = resetTokens.get(token);
      if (!stored || Date.now() > stored.expires) {
        resetTokens.delete(token);
        return NextResponse.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
      }

      const admin = getServiceClient();
      if (!admin) {
        return NextResponse.json({ error: "Service not configured" }, { status: 500 });
      }

      // Find user by email
      const { data } = await admin.auth.admin.listUsers();
      const user = data?.users.find(
        (u) => u.email?.toLowerCase() === stored.email
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }

      // Update password
      const { error } = await admin.auth.admin.updateUserById(user.id, { password });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Clean up token
      resetTokens.delete(token);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
