import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {/* Subtle indigo glow behind the header — the only "effect" in the
            design. Premium reads as restrained, so depth comes from 1px
            hairlines and spacing rather than drop shadows. */}
        <div className="relative">
          <div
            aria-hidden
            className="from-accent/8 pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b to-transparent"
          />
          <div className="relative px-5 py-8 sm:px-8 lg:px-10">
            <header>
              <h1 className="text-2xl font-semibold tracking-tight">
                Projects Overview
              </h1>
              <p className="text-ink-muted mt-1 text-sm">
                Welcome back — here&rsquo;s where your money and deadlines stand.
              </p>
            </header>
          </div>
        </div>
      </main>
    </div>
  );
}
