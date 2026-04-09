import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST: Submit email to unlock catalog, saves as lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, business_name, island } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let catalogUrl = "";

    if (url && key) {
      const supabase = createClient(url, key);

      // Save as lead
      await supabase.from("leads").insert({
        name,
        email,
        business_name: business_name || null,
        island: island || null,
        source: "catalog_download",
        status: "new",
        email_opted_in: true,
      });

      // Track event
      await supabase.from("analytics_events").insert({
        event: "catalog_download",
        page: "/catalog",
        meta: JSON.stringify({ email, name }),
      });

      // Get catalog URL from site_content
      const { data: content } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "catalog_url")
        .single();

      catalogUrl = content?.value || "";
    }

    // Send notification email
    if (process.env.RESEND_API_KEY) {
      try {
        const { resend } = await import("@/lib/resend");
        await resend.emails.send({
          from: "The Friendly Brands <notifications@thefriendlybrands.com>",
          to: "info@thefriendlybrands.com",
          subject: `Catalog Download: ${name} from ${island || "Unknown"}`,
          html: `
            <h2>Someone downloaded your catalog!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Business:</strong> ${business_name || "N/A"}</p>
            <p><strong>Island:</strong> ${island || "N/A"}</p>
          `,
        });
      } catch {
        // Don't fail on email error
      }
    }

    return NextResponse.json({ success: true, catalog_url: catalogUrl });
  } catch (error) {
    console.error("Catalog error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
