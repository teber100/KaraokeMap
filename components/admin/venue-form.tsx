"use client";

import { FormEvent, useState } from "react";

export type VenueFormValues = {
  name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  website_url: string;
  phone: string;
  is_active: boolean;
};

export function VenueForm({
  initialValues,
  submitLabel,
  onSubmit
}: {
  initialValues: VenueFormValues;
  submitLabel: string;
  onSubmit: (values: VenueFormValues) => Promise<string | null>;
}) {
  const [values, setValues] = useState<VenueFormValues>(initialValues);
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
      {renderTextInput("name", "Name", values.name, (value) => setValues({ ...values, name: value }), true)}
      {renderTextInput(
        "address_line_1",
        "Address line 1",
        values.address_line_1,
        (value) => setValues({ ...values, address_line_1: value }),
        true
      )}
      {renderTextInput(
        "address_line_2",
        "Address line 2 (optional)",
        values.address_line_2,
        (value) => setValues({ ...values, address_line_2: value }),
        false
      )}
      {renderTextInput("city", "City", values.city, (value) => setValues({ ...values, city: value }), true)}
      {renderTextInput("state", "State", values.state, (value) => setValues({ ...values, state: value }), true)}
      {renderTextInput(
        "postal_code",
        "Postal code",
        values.postal_code,
        (value) => setValues({ ...values, postal_code: value }),
        true
      )}
      {renderTextInput(
        "latitude",
        "Latitude",
        values.latitude,
        (value) => setValues({ ...values, latitude: value }),
        true
      )}
      {renderTextInput(
        "longitude",
        "Longitude",
        values.longitude,
        (value) => setValues({ ...values, longitude: value }),
        true
      )}
      {renderTextInput(
        "website_url",
        "Website URL (optional)",
        values.website_url,
        (value) => setValues({ ...values, website_url: value }),
        false
      )}
      {renderTextInput("phone", "Phone (optional)", values.phone, (value) => setValues({ ...values, phone: value }), false)}

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(event) => setValues({ ...values, is_active: event.target.checked })}
        />
        Venue is active
      </label>

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

function renderTextInput(
  id: string,
  label: string,
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
        type="text"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
