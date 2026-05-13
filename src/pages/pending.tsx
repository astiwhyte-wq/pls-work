import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { MatrixRain } from "@/components/matrix-rain";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Pending() {
  const { user, isLoading, isApproved } = useAuth();
  const [, setLocation] = useLocation();
  const logout = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
    if (!isLoading && isApproved) {
      setLocation("/games");
    }
  }, [user, isLoading, isApproved, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-lg mx-4 text-center">
        <div className="border border-yellow-500/30 bg-background/90 backdrop-blur p-10 glow-border">
          <div className="mb-6">
            <Link href="/" className="text-2xl font-bold glow-text tracking-wider block mb-2">&gt; GAME_HUB_</Link>
          </div>

          <div className="w-16 h-16 border-2 border-yellow-500/50 mx-auto mb-6 flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-500/80 animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold text-yellow-400 uppercase tracking-widest mb-4">
            ACCESS_PENDING
          </h1>

          <div className="space-y-3 text-primary/70 text-sm font-mono mb-8">
            <p>&gt; Request submitted: <span className="text-primary">{user?.username}</span></p>
            <p>&gt; Status: <span className="text-yellow-400 animate-pulse">AWAITING_APPROVAL</span></p>
            <p>&gt; Your access request has been queued for admin review.</p>
            <p>&gt; You will be able to log in once approved.</p>
          </div>

          <div className="border border-primary/20 bg-primary/5 p-4 mb-6 text-xs text-primary/60 font-mono text-left">
            <p className="text-primary/40 mb-2">// system_message</p>
            <p>The administrator must manually approve your account before you can access the game library and chat. Check back later.</p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-primary/30 hover:bg-primary/10 uppercase tracking-wider"
            data-testid="button-logout"
          >
            LOGOUT
          </Button>
        </div>
      </div>
    </div>
  );
}
