import { NextRequest, NextResponse } from "next/server";

// In-memory store for verification codes (in production, use Supabase)
// Codes expire after 10 minutes
const codes = new Map<string, { code: string; expires: number }>();

// POST: Send verification code
export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();

    if (action === "send") {
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      codes.set(email.toLowerCase(), {
        code,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      // Send code via Resend
      if (process.env.RESEND_API_KEY) {
        try {
          const { resend } = await import("@/lib/resend");
          await resend.emails.send({
            from: "The Friendly Brands <noreply@protegysupplements.com>",
            to: email,
            subject: "Your verification code — The Friendly Brands",
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #1e40af;">The Friendly Brands</h2>
                <p>Here's your verification code:</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">${code}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
              </div>
            `,
          });
        } catch (err) {
          console.error("Failed to send verification email:", err);
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
      } else {
        // Dev mode: log the code
        console.log(`[DEV] Verification code for ${email}: ${code}`);
      }

      return NextResponse.json({ success: true });
    }

    if (action === "verify") {
      const { code } = await req.json();
      const stored = codes.get(email.toLowerCase());

      if (!stored) {
        return NextResponse.json({ error: "No code found. Please request a new one." }, { status: 400 });
      }

      if (Date.now() > stored.expires) {
        codes.delete(email.toLowerCase());
        return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
      }

      if (stored.code !== code) {
        return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
      }

      // Code is valid — clean up
      codes.delete(email.toLowerCase());
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
