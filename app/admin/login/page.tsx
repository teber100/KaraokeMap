export default function AdminLoginPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="text-sm text-slate-700">Placeholder page for future private admin authentication.</p>
      <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" aria-label="admin login form">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            placeholder="admin@example.com"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            disabled
            placeholder="********"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
          />
        </div>
        <button
          type="button"
          disabled
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign in (coming soon)
        </button>
      </form>
    </section>
  );
}
