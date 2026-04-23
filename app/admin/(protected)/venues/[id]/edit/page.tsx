"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VenueForm, VenueFormValues } from "@/components/admin/venue-form";
import { supabase } from "@/lib/supabase/client";

export default function EditVenuePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<VenueFormValues | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadVenue() {
      const { data, error } = await supabase
        .from("venues")
        .select("name, address_line_1, address_line_2, city, state, postal_code, latitude, longitude, website_url, phone, is_active")
        .eq("id", params.id)
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setInitialValues({
        name: data.name,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2 ?? "",
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        website_url: data.website_url ?? "",
        phone: data.phone ?? "",
        is_active: data.is_active
      });
    }

    loadVenue();
  }, [params.id]);


  async function handleDelete() {
    const confirmed = window.confirm("Delete this venue? This will also delete its events.");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    const { error } = await supabase.from("venues").delete().eq("id", params.id);

    if (error) {
      setDeleteError(error.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/venues");
    router.refresh();
  }

  async function handleUpdate(values: VenueFormValues) {
    const payload = {
      name: values.name,
      address_line_1: values.address_line_1,
      address_line_2: values.address_line_2 || null,
      city: values.city,
      state: values.state,
      postal_code: values.postal_code,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      website_url: values.website_url || null,
      phone: values.phone || null,
      is_active: values.is_active
    };

    const { error } = await supabase.from("venues").update(payload).eq("id", params.id);

    if (error) {
      return error.message;
    }

    router.push("/admin/venues");
    router.refresh();
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Edit Venue</h1>
      {errorMessage ? <p className="text-sm text-red-700">Failed to load venue: {errorMessage}</p> : null}
      {!errorMessage && !initialValues ? <p className="text-sm text-slate-700">Loading venue...</p> : null}
      {initialValues ? <VenueForm initialValues={initialValues} submitLabel="Save changes" onSubmit={handleUpdate} /> : null}
      {initialValues ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete venue"}
        </button>
      ) : null}
      {deleteError ? <p className="text-sm text-red-700">Failed to delete venue: {deleteError}</p> : null}
      <Link href="/admin/venues" className="text-sm text-slate-700 underline">
        Back to venues
      </Link>
    </section>
  );
}
