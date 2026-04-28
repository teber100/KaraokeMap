import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidDateOnly } from "@/lib/date";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatChicagoDate, formatChicagoDateTime, formatChicagoTime } from "@/lib/timezone";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

type EventDetailRow = {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string | null;
  host_name: string | null;
  notes: string | null;
  source_url: string | null;
  status: "scheduled" | "tentative" | "canceled";
  last_verified_at: string;
  venue: {
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
  } | null;
};

export default async function EventDetailPage({ params, searchParams }: EventDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = createServerSupabaseClient();
  const backHref = isValidDateOnly(query.date) ? `/?date=${query.date}` : "/";

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, start_datetime, end_datetime, host_name, notes, source_url, status, last_verified_at, venue:venues(name, address_line_1, address_line_2, city, state, postal_code)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data || !data.venue) {
    notFound();
  }

  const eventRow = data as unknown as EventDetailRow;
  const venue = eventRow.venue;

  if (!venue) {
    notFound();
  }

  const fullAddress = [
    venue.address_line_1,
    venue.address_line_2,
    `${venue.city}, ${venue.state} ${venue.postal_code}`
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="space-y-5">
      <Link href={backHref} className="text-sm text-slate-700 underline">
        Back to events
      </Link>

      <header className="space-y-1">
        <p className="text-sm text-slate-600">{venue.name}</p>
        <h1 className="text-2xl font-bold text-slate-900">{eventRow.title}</h1>
        {eventRow.status === "tentative" ? (
          <p className="inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Tentative event</p>
        ) : null}
        {eventRow.status === "canceled" ? (
          <p className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Canceled</p>
        ) : null}
      </header>

      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-800">
        <p>
          <span className="font-semibold text-slate-900">Address:</span> {fullAddress}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Date:</span> {formatChicagoDate(eventRow.start_datetime)}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Start time:</span> {formatChicagoTime(eventRow.start_datetime)}
        </p>
        {eventRow.end_datetime ? (
          <p>
            <span className="font-semibold text-slate-900">End time:</span> {formatChicagoTime(eventRow.end_datetime)}
          </p>
        ) : null}
        {eventRow.host_name ? (
          <p>
            <span className="font-semibold text-slate-900">Host:</span> {eventRow.host_name}
          </p>
        ) : null}
        {eventRow.notes ? (
          <p>
            <span className="font-semibold text-slate-900">Notes:</span> {eventRow.notes}
          </p>
        ) : null}
        {eventRow.source_url ? (
          <p>
            <span className="font-semibold text-slate-900">Source:</span>{" "}
            <a href={eventRow.source_url} className="underline" target="_blank" rel="noreferrer">
              {eventRow.source_url}
            </a>
          </p>
        ) : null}
        <p>
          <span className="font-semibold text-slate-900">Last verified:</span> {formatChicagoDateTime(eventRow.last_verified_at)}
        </p>
      </div>
    </section>
  );
}
