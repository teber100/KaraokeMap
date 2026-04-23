import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminHomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
      <p className="text-sm text-slate-700">Use these pages to manage venues and karaoke events.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/venues" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Manage Venues
        </Link>
        <Link href="/admin/events" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Manage Events
        </Link>
      </div>
      <LogoutButton />
    </section>
  );
}
