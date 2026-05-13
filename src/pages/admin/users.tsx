import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useListUsers, useApproveUser, useRejectUser, useDeleteUser,
  useMakeAdmin, useTimeoutUser,
  getListUsersQueryKey, getGetPendingCountQueryKey, getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

type Status = "pending" | "approved" | "rejected" | undefined;

const TIMEOUT_PRESETS: { label: string; minutes: number | null }[] = [
  { label: "5m",      minutes: 5 },
  { label: "15m",     minutes: 15 },
  { label: "30m",     minutes: 30 },
  { label: "1h",      minutes: 60 },
  { label: "6h",      minutes: 360 },
  { label: "24h",     minutes: 1440 },
  { label: "FOREVER", minutes: null },
  { label: "UNDO",    minutes: 0 },
];

function isTimedOut(chatTimeoutUntil: string | null | undefined): boolean {
  if (!chatTimeoutUntil) return false;
  return new Date(chatTimeoutUntil) > new Date();
}

function timeoutLabel(chatTimeoutUntil: string | null | undefined): string {
  if (!chatTimeoutUntil) return "";
  const d = new Date(chatTimeoutUntil);
  if (d.getFullYear() >= 9999) return "∞ FOREVER";
  const diff = Math.max(0, d.getTime() - Date.now());
  const mins = Math.ceil(diff / 60000);
  if (mins > 1440) return `${Math.ceil(mins / 1440)}d`;
  if (mins > 60) return `${Math.ceil(mins / 60)}h`;
  return `${mins}m`;
}

export default function AdminUsers() {
  const { isAdmin, isLoading, user: currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<Status>(undefined);
  const [openTimeout, setOpenTimeout] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const deleteUser = useDeleteUser();
  const makeAdmin = useMakeAdmin();
  const timeoutUser = useTimeoutUser();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, isLoading, setLocation]);

  const params = statusFilter ? { status: statusFilter } : {};
  const { data: users, isLoading: usersLoading } = useListUsers(params, {
    query: { queryKey: getListUsersQueryKey(params) },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetPendingCountQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
  };

  const handleApprove = (id: number) => approveUser.mutate({ id }, { onSuccess: invalidate });
  const handleReject  = (id: number) => rejectUser.mutate({ id }, { onSuccess: invalidate });
  const handleDelete  = (id: number) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    deleteUser.mutate({ id }, { onSuccess: invalidate });
  };
  const handleMakeAdmin = (id: number) => makeAdmin.mutate({ id }, { onSuccess: invalidate });
  const handleTimeout = (id: number, minutes: number | null) => {
    timeoutUser.mutate({ id, data: { minutes } }, {
      onSuccess: () => { invalidate(); setOpenTimeout(null); },
    });
  };

  const statusColor: Record<string, string> = {
    pending:  "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    approved: "text-green-400 border-green-500/30 bg-green-500/10",
    rejected: "text-destructive border-destructive/30 bg-destructive/10",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-destructive uppercase tracking-widest">&gt; USER_MANAGEMENT_</h1>
            <p className="text-primary/40 text-xs font-mono mt-1">{users?.length ?? 0} users found</p>
          </div>
          <Button onClick={() => setLocation("/admin")} variant="outline" size="sm" className="border-primary/30 uppercase text-xs font-mono" data-testid="button-back">
            &lt; Back
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {([undefined, "pending", "approved", "rejected"] as const).map((s) => (
            <Button
              key={s ?? "all"}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
              className="text-xs uppercase font-mono"
              data-testid={`button-filter-${s ?? "all"}`}
            >
              {s ?? "ALL"}
            </Button>
          ))}
        </div>

        <div className="border border-primary/20 overflow-hidden overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead className="border-b border-primary/20 bg-card/50">
              <tr>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">User</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Display Name</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Status</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Role</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Chat</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Joined</th>
                <th className="text-right p-3 text-primary/60 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-primary/40">&gt; LOADING...</td></tr>
              ) : users && users.length > 0 ? (
                users.map((u) => {
                  const timed = isTimedOut(u.chatTimeoutUntil as unknown as string | null);
                  const isCurrentUser = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="border-b border-primary/10 hover:bg-card/30 transition-colors" data-testid={`row-user-${u.id}`}>
                      <td className="p-3 glow-text">{u.username}</td>
                      <td className="p-3 text-primary/70">{u.displayName}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 border uppercase ${statusColor[u.status] ?? ""}`}>{u.status}</span>
                      </td>
                      <td className="p-3 text-xs">
                        <span className={`uppercase px-1 py-0.5 border ${u.role === "admin" ? "text-destructive border-destructive/40 bg-destructive/10" : "text-primary/50 border-primary/20"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        {timed ? (
                          <span className="text-destructive font-mono uppercase">
                            MUTED {timeoutLabel(u.chatTimeoutUntil as unknown as string | null)}
                          </span>
                        ) : (
                          <span className="text-green-400/60">OK</span>
                        )}
                      </td>
                      <td className="p-3 text-primary/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {u.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => handleApprove(u.id)} className="bg-green-700 hover:bg-green-600 text-white text-xs uppercase font-mono h-6 px-2" data-testid={`button-approve-${u.id}`}>
                                OK
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(u.id)} className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs uppercase font-mono h-6 px-2" data-testid={`button-reject-${u.id}`}>
                                REJ
                              </Button>
                            </>
                          )}
                          {u.status === "approved" && (
                            <Button size="sm" variant="outline" onClick={() => handleReject(u.id)} className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs uppercase font-mono h-6 px-2" data-testid={`button-revoke-${u.id}`}>
                              REV
                            </Button>
                          )}
                          {u.status === "rejected" && (
                            <Button size="sm" onClick={() => handleApprove(u.id)} className="bg-green-700 hover:bg-green-600 text-white text-xs uppercase font-mono h-6 px-2" data-testid={`button-approve-${u.id}`}>
                              OK
                            </Button>
                          )}

                          {!isCurrentUser && (
                            <Button
                              size="sm" variant="outline"
                              onClick={() => handleMakeAdmin(u.id)}
                              className={`text-xs uppercase font-mono h-6 px-2 ${u.role === "admin" ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"}`}
                              data-testid={`button-admin-${u.id}`}
                            >
                              {u.role === "admin" ? "UNADMIN" : "ADMIN"}
                            </Button>
                          )}

                          <div className="relative">
                            <Button
                              size="sm" variant="outline"
                              onClick={() => setOpenTimeout(openTimeout === u.id ? null : u.id)}
                              className={`text-xs uppercase font-mono h-6 px-2 ${timed ? "border-destructive/40 text-destructive" : "border-primary/30 text-primary/60"}`}
                              data-testid={`button-timeout-${u.id}`}
                            >
                              {timed ? "MUTED" : "MUTE"}
                            </Button>
                            {openTimeout === u.id && (
                              <div className="absolute right-0 top-8 z-50 bg-background border border-primary/30 p-2 w-44 flex flex-col gap-1 shadow-lg">
                                <p className="text-primary/40 text-xs font-mono uppercase mb-1">Timeout duration:</p>
                                {TIMEOUT_PRESETS.map((p) => (
                                  <button
                                    key={p.label}
                                    onClick={() => handleTimeout(u.id, p.minutes)}
                                    className={`text-left px-2 py-1 text-xs font-mono uppercase transition-colors ${
                                      p.label === "UNDO"
                                        ? "text-green-400 hover:bg-green-500/10"
                                        : p.label === "FOREVER"
                                        ? "text-destructive hover:bg-destructive/10"
                                        : "text-primary hover:bg-primary/10"
                                    }`}
                                  >
                                    {p.label === "UNDO" ? "↩ REMOVE TIMEOUT" : `> ${p.label}`}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button size="sm" variant="outline" onClick={() => handleDelete(u.id)} className="border-destructive/30 text-destructive/70 hover:bg-destructive/10 text-xs uppercase font-mono h-6 px-2" data-testid={`button-delete-${u.id}`}>
                            DEL
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={7} className="p-8 text-center text-primary/40">&gt; NO_USERS_FOUND_</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
