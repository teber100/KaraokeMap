"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type VenueRow = {
  id: string;
  name: string;
  city: string;
  state: string;
  is_active: boolean;
};

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<VenueRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenues() {
      const { data, error } = await supabase.from("venues").select("id, name, city, state, is_active").order("name");

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setVenues(data ?? []);
      setIsLoading(false);
    }

    loadVenues();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Venues</h1>
        <Link href="/admin/venues/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Add Venue
        </Link>
      </div>

      {isLoading ? <p className="text-sm text-slate-700">Loading venues...</p> : null}
      {errorMessage ? <p className="text-sm text-red-700">Failed to load venues: {errorMessage}</p> : null}

      {!isLoading && !errorMessage && venues.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">No venues yet.</p>
      ) : null}

      {!isLoading && !errorMessage && venues.length > 0 ? (
        <ul className="space-y-2">
          {venues.map((venue) => (
            <li key={venue.id} className="rounded-md border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{venue.name}</p>
                  <p className="text-sm text-slate-700">
                    {venue.city}, {venue.state} · {venue.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <Link
                  href={`/admin/venues/${venue.id}/edit`}
                  className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
