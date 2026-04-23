"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventForm, EventFormValues } from "@/components/admin/event-form";
import { supabase } from "@/lib/supabase/client";

type VenueOption = {
  id: string;
  name: string;
};

function toLocalDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      const venuesResult = await supabase.from("venues").select("id, name").order("name");

      if (venuesResult.error) {
        setPageError(venuesResult.error.message);
        return;
      }

      setVenueOptions(venuesResult.data ?? []);

      const eventResult = await supabase
        .from("events")
        .select("venue_id, title, start_datetime, end_datetime, host_name, notes, source_url, status, last_verified_at")
        .eq("id", params.id)
        .single();

      if (eventResult.error) {
        setPageError(eventResult.error.message);
        return;
      }

      const eventRow = eventResult.data;

      setInitialValues({
        venue_id: eventRow.venue_id,
        title: eventRow.title,
        start_datetime: toLocalDateTime(eventRow.start_datetime),
        end_datetime: toLocalDateTime(eventRow.end_datetime),
        host_name: eventRow.host_name ?? "",
        notes: eventRow.notes ?? "",
        source_url: eventRow.source_url ?? "",
        status: eventRow.status,
        last_verified_at: toLocalDateTime(eventRow.last_verified_at)
      });
    }

    loadPageData();
  }, [params.id]);

  async function handleUpdate(values: EventFormValues) {
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

    const { error } = await supabase.from("events").update(payload).eq("id", params.id);

    if (error) {
      return error.message;
    }

    router.push("/admin/events");
    router.refresh();
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Edit Event</h1>
      {pageError ? <p className="text-sm text-red-700">Failed to load event: {pageError}</p> : null}
      {!pageError && !initialValues ? <p className="text-sm text-slate-700">Loading event...</p> : null}
      {initialValues ? (
        <EventForm
          initialValues={initialValues}
          venueOptions={venueOptions}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      ) : null}
      <Link href="/admin/events" className="text-sm text-slate-700 underline">
        Back to events
      </Link>
    </section>
  );
}
