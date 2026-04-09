import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a mock client that returns empty results
    // This allows the app to build and run without Supabase configured
    return {
      from: () => ({
        select: () => ({
          order: () => ({ data: null, error: null, count: 0 }),
          eq: () => ({
            order: () => ({ data: null, error: null }),
            single: () => ({ data: null, error: null }),
          }),
          in: () => ({ data: null, error: null }),
          limit: () => ({ data: null, error: null }),
          data: null,
          error: null,
          count: 0,
          head: true,
        }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      storage: {
        from: () => ({
          upload: async () => ({ error: { message: "Storage not configured" } }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    } as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
