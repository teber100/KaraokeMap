"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PublicDatePickerProps = {
  selectedDate: string;
};

export function PublicDatePicker({ selectedDate }: PublicDatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDateChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("date", value);
    } else {
      params.delete("date");
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700" htmlFor="event-date">
      Pick a date
      <input
        id="event-date"
        type="date"
        value={selectedDate}
        onChange={(event) => handleDateChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
      />
    </label>
  );
}
