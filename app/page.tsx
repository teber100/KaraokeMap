import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PublicDatePicker } from "@/components/public/public-date-picker";
import {
  formatChicagoDateTime,
  formatChicagoTime,
  getChicagoDayRange,
  getTodayInChicago
} from "@/lib/timezone";

type HomePageProps = {
  searchParams: Promise<{ date?: string }>;
};

type PublicEventRow = {
  id: string;
  title: string;
  start_datetime: string;
  host_name: string | null;
  status: "scheduled" | "tentative" | "canceled";
  last_verified_at: string;
  venue: {
    name: string;
    city: string;
  } | null;
};

function isValidDateOnly(value: string | undefined) {
  if (!value) {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedDate = isValidDateOnly(params.date) ? (params.date as string) : getTodayInChicago();
  const { startIso, endIso } = getChicagoDayRange(selectedDate);

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, start_datetime, host_name, status, last_verified_at, venue:venues(name, city)")
    .neq("status", "canceled")
    .gte("start_datetime", startIso)
    .lt("start_datetime", endIso)
    .order("start_datetime", { ascending: true });

  const events = ((data ?? []) as unknown as PublicEventRow[]).filter((eventRow) => eventRow.venue);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Find karaoke tonight</h1>
        <p className="text-sm text-slate-700">Browse Wisconsin karaoke events by date. Times are shown in America/Chicago.</p>
      </header>

      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
        <PublicDatePicker selectedDate={selectedDate} />
        <p className="text-sm text-slate-700">
          {events.length} event{events.length === 1 ? "" : "s"} on {selectedDate}
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          We could not load events right now. Please try again soon.
        </p>
      ) : null}

      {!error && events.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="font-medium text-slate-900">No karaoke events found for this date.</p>
          <p className="mt-1">Try another date to check what is coming up.</p>
        </div>
      ) : null}

      {!error && events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((eventRow) => (
            <li key={eventRow.id}>
              <Link
                href={`/event/${eventRow.id}`}
                className="block rounded-md border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{eventRow.venue?.name ?? "Unknown venue"}</p>
                    <p className="text-sm text-slate-600">{eventRow.venue?.city ?? "Unknown city"}</p>
                  </div>
                  {eventRow.status === "tentative" ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Tentative</span>
                  ) : null}
                </div>

                <p className="mt-3 text-base font-semibold text-slate-900">{eventRow.title}</p>
                <p className="mt-1 text-sm text-slate-700">Starts at {formatChicagoTime(eventRow.start_datetime)}</p>
                {eventRow.host_name ? <p className="mt-1 text-sm text-slate-700">Host: {eventRow.host_name}</p> : null}
                <p className="mt-2 text-xs text-slate-500">Last verified {formatChicagoDateTime(eventRow.last_verified_at)}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
