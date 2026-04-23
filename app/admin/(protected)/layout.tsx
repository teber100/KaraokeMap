import Link from "next/link";
import { AuthGate } from "@/components/admin/auth-gate";

export default function ProtectedAdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <section className="space-y-4">
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin" className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50">
            Admin Home
          </Link>
          <Link
            href="/admin/venues"
            className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
          >
            Venues
          </Link>
          <Link
            href="/admin/events"
            className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
          >
            Events
          </Link>
        </nav>
        {children}
      </section>
    </AuthGate>
  );
}
