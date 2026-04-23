"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm, EventFormValues } from "@/components/admin/event-form";
import { supabase } from "@/lib/supabase/client";

type VenueOption = {
  id: string;
  name: string;
};

function nowLocalDateTime() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

const initialValues: EventFormValues = {
  venue_id: "",
  title: "",
  start_datetime: "",
  end_datetime: "",
  host_name: "",
  notes: "",
  source_url: "",
  status: "scheduled",
  last_verified_at: nowLocalDateTime()
};

export default function NewEventPage() {
  const router = useRouter();
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenues() {
      const { data, error } = await supabase.from("venues").select("id, name").eq("is_active", true).order("name");

      if (error) {
        setPageError(error.message);
        return;
      }

      setVenueOptions(data ?? []);
    }

    loadVenues();
  }, []);

  async function handleCreate(values: EventFormValues) {
    const payload = {
      venue_id: values.venue_id,
      title: values.title,
      start_datetime: new Date(values.start_datetime).toISOString(),
      end_datetime: values.end_datetime ? new Date(values.end_datetime).toISOString() : null,
      host_name: values.host_name || null,
      notes: values.notes || null,
      source_url: values.source_url || null,
      status: values.status,
      last_verified_at: new Date(values.last_verified_at).toISOString()
    };

    const { error } = await supabase.from("events").insert(payload);

    if (error) {
      return error.message;
    }

    router.push("/admin/events");
    router.refresh();
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Add Event</h1>
      {pageError ? <p className="text-sm text-red-700">Failed to load venues: {pageError}</p> : null}
      {!pageError && venueOptions.length === 0 ? (
        <p className="text-sm text-slate-700">No active venues found. Add a venue first.</p>
      ) : null}
      {venueOptions.length > 0 ? (
        <EventForm
          initialValues={initialValues}
          venueOptions={venueOptions}
          submitLabel="Create event"
          onSubmit={handleCreate}
        />
      ) : null}
      <Link href="/admin/events" className="text-sm text-slate-700 underline">
        Back to events
      </Link>
    </section>
  );
}
