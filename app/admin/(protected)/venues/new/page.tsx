"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { VenueForm, VenueFormValues } from "@/components/admin/venue-form";
import { supabase } from "@/lib/supabase/client";

const initialValues: VenueFormValues = {
  name: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "WI",
  postal_code: "",
  latitude: "",
  longitude: "",
  website_url: "",
  phone: "",
  is_active: true
};

export default function NewVenuePage() {
  const router = useRouter();

  async function handleCreate(values: VenueFormValues) {
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

    const { error } = await supabase.from("venues").insert(payload);

    if (error) {
      return error.message;
    }

    router.push("/admin/venues");
    router.refresh();
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Add Venue</h1>
      <VenueForm initialValues={initialValues} submitLabel="Create venue" onSubmit={handleCreate} />
      <Link href="/admin/venues" className="text-sm text-slate-700 underline">
        Back to venues
      </Link>
    </section>
  );
}
