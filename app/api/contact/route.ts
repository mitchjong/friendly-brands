import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, island, source } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Save to Supabase
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const supabase = createClient(url, key);
      const { error: dbError } = await supabase.from("leads").insert({
        name,
        business_name: body.business_name || null,
        email,
        phone: body.phone || null,
        island: island || null,
        message: body.message || null,
        brands_interested: body.brands_interested || [],
        email_opted_in: body.email_opted_in || false,
        status: "new",
        source: source || "website",
      });
      if (dbError) {
        console.error("Supabase error:", dbError);
      }
    }

    // Send notification email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { resend } = await import("@/lib/resend");
        await resend.emails.send({
          from: "The Friendly Brands <notifications@thefriendlybrands.com>",
          to: "info@thefriendlybrands.com",
          subject: `New Lead: ${name} from ${island || "Unknown"}`,
          html: `
            <h2>New Lead from ${source || "website"}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Business:</strong> ${body.business_name || "N/A"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${body.phone || "N/A"}</p>
            <p><strong>Island:</strong> ${island || "N/A"}</p>
            <p><strong>Brands Interested:</strong> ${(body.brands_interested || []).join(", ") || "N/A"}</p>
            <p><strong>Newsletter Opt-in:</strong> ${body.email_opted_in ? "Yes" : "No"}</p>
            <p><strong>Message:</strong></p>
            <p>${body.message || "No message"}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Resend error:", emailErr);
      }
    }

    console.log("New lead received:", { name, email, island, source });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
