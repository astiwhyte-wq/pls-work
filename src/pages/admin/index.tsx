import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useGetStats, useGetPendingCount, getGetPendingCountQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { NavBar } from "@/components/nav-bar";
import { useEffect } from "react";

export default function Admin() {
  const { isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, isLoading, setLocation]);

  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: pending } = useGetPendingCount({ query: { queryKey: getGetPendingCountQueryKey() } });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-destructive uppercase tracking-widest">&gt; ADMIN_CONSOLE_</h1>
          <p className="text-primary/40 text-xs font-mono uppercase">Root access granted</p>
        </div>

        {pending && pending.count > 0 && (
          <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 mb-6 flex items-center justify-between font-mono text-sm">
            <span className="text-yellow-400 uppercase tracking-wider">
              &gt; {pending.count} pending access request{pending.count > 1 ? "s" : ""} awaiting review
            </span>
            <Link href="/admin/users?status=pending" className="text-yellow-400 hover:text-yellow-300 uppercase text-xs underline" data-testid="link-review-pending">
              REVIEW &gt;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Games", value: stats?.totalGames },
            { label: "Total Users", value: stats?.totalUsers },
            { label: "Pending", value: stats?.pendingUsers, warn: (stats?.pendingUsers ?? 0) > 0 },
            { label: "Messages", value: stats?.totalMessages },
          ].map((s) => (
            <div key={s.label} className="border border-primary/20 bg-card p-4 text-center">
              <div className={`text-3xl font-bold mb-1 ${s.warn ? "text-yellow-400" : "glow-text"}`}>{s.value ?? "—"}</div>
              <div className="text-xs uppercase tracking-widest text-primary/50 font-mono">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/users" data-testid="link-admin-users">
            <div className="border border-primary/20 bg-card hover:border-primary/50 transition-all cursor-pointer p-6 group">
              <h2 className="text-xl font-bold uppercase tracking-wider group-hover:glow-text transition-all mb-2">&gt; USER_MANAGEMENT</h2>
              <p className="text-primary/50 text-sm font-mono">Approve, reject, and manage user accounts. Review pending requests.</p>
              {pending && pending.count > 0 && (
                <div className="mt-3 inline-block text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 uppercase font-mono">
                  {pending.count} Pending
                </div>
              )}
            </div>
          </Link>

          <Link href="/admin/games" data-testid="link-admin-games">
            <div className="border border-primary/20 bg-card hover:border-primary/50 transition-all cursor-pointer p-6 group">
              <h2 className="text-xl font-bold uppercase tracking-wider group-hover:glow-text transition-all mb-2">&gt; GAME_MANAGEMENT</h2>
              <p className="text-primary/50 text-sm font-mono">Add new games, remove existing ones, and manage featured status.</p>
              <div className="mt-3 inline-block text-xs bg-primary/20 text-primary px-2 py-0.5 uppercase font-mono">
                {stats?.totalGames ?? 0} Games
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
