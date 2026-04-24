"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type EventRow = {
  id: string;
  title: string;
  start_datetime: string;
  status: string;
  last_verified_at: string;
  venue: { name: string }[] | null;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadEvents() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("id, title, start_datetime, status, last_verified_at, venue:venues(name)")
      .gte("start_datetime", new Date().toISOString())
      .order("start_datetime", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setEvents((data ?? []) as unknown as EventRow[]);
    setErrorMessage(null);
    setIsLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this event?");

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await loadEvents();
  }

  async function handleMarkCanceled(id: string) {
    const { error } = await supabase.from("events").update({ status: "canceled" }).eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await loadEvents();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Events</h1>
        <Link href="/admin/events/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Add Event
        </Link>
      </div>

      {isLoading ? <p className="text-sm text-slate-700">Loading events...</p> : null}
      {errorMessage ? <p className="text-sm text-red-700">Event action failed: {errorMessage}</p> : null}

      {!isLoading && !errorMessage && events.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">No upcoming events yet.</p>
      ) : null}

      {!isLoading && events.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2">Date/Time</th>
                <th className="px-3 py-2">Venue</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Last verified</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((eventRow) => (
                <tr key={eventRow.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{new Date(eventRow.start_datetime).toLocaleString()}</td>
                  <td className="px-3 py-2">{eventRow.venue?.name ?? "Unknown venue"}</td>
                  <td className="px-3 py-2">{eventRow.title}</td>
                  <td className="px-3 py-2">{eventRow.status}</td>
                  <td className="px-3 py-2">{new Date(eventRow.last_verified_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/events/${eventRow.id}/edit`}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleMarkCanceled(eventRow.id)}
                        className="rounded border border-amber-400 px-2 py-1 text-xs text-amber-700"
                      >
                        Mark canceled
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(eventRow.id)}
                        className="rounded border border-red-400 px-2 py-1 text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
