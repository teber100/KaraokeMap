import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SupabaseCheckPage() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("venues").select("id, name").limit(1);

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-bold text-slate-900">Temporary Dev Check: Supabase</h1>
      <p className="text-sm text-slate-700">
        This page is for Milestone 2 only. It performs a small read query from the
        <code className="rounded bg-slate-100 px-1 py-0.5"> venues </code>
        table.
      </p>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Connection check failed.</p>
          <p>{error.message}</p>
        </div>
      ) : (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Connection check succeeded.</p>
          <p>Query returned {data?.length ?? 0} row(s).</p>
        </div>
      )}
    </section>
  );
}
