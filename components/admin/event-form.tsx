"use client";

import { FormEvent, useState } from "react";

export type EventFormValues = {
  venue_id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  host_name: string;
  notes: string;
  source_url: string;
  status: string;
  last_verified_at: string;
};

type VenueOption = {
  id: string;
  name: string;
};

export function EventForm({
  initialValues,
  venueOptions,
  submitLabel,
  onSubmit
}: {
  initialValues: EventFormValues;
  venueOptions: VenueOption[];
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<string | null>;
}) {
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const error = await onSubmit(values);

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="space-y-1">
        <label htmlFor="venue_id" className="block text-sm font-medium text-slate-700">
          Venue
        </label>
        <select
          id="venue_id"
          required
          value={values.venue_id}
          onChange={(event) => setValues({ ...values, venue_id: event.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select a venue</option>
          {venueOptions.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      {renderInput("title", "Title", "text", values.title, (value) => setValues({ ...values, title: value }), true)}
      {renderInput(
        "start_datetime",
        "Start date/time",
        "datetime-local",
        values.start_datetime,
        (value) => setValues({ ...values, start_datetime: value }),
        true
      )}
      {renderInput(
        "end_datetime",
        "End date/time (optional)",
        "datetime-local",
        values.end_datetime,
        (value) => setValues({ ...values, end_datetime: value }),
        false
      )}
      {renderInput(
        "host_name",
        "Host name (optional)",
        "text",
        values.host_name,
        (value) => setValues({ ...values, host_name: value }),
        false
      )}

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(event) => setValues({ ...values, notes: event.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      {renderInput(
        "source_url",
        "Source URL (optional)",
        "text",
        values.source_url,
        (value) => setValues({ ...values, source_url: value }),
        false
      )}

      <div className="space-y-1">
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          required
          value={values.status}
          onChange={(event) => setValues({ ...values, status: event.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="scheduled">scheduled</option>
          <option value="tentative">tentative</option>
          <option value="canceled">canceled</option>
        </select>
      </div>

      {renderInput(
        "last_verified_at",
        "Last verified at",
        "datetime-local",
        values.last_verified_at,
        (value) => setValues({ ...values, last_verified_at: value }),
        true
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>

      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
    </form>
  );
}

function renderInput(
  id: string,
  label: string,
  type: string,
  value: string,
  onChange: (value: string) => void,
  required: boolean
) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
