import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const { user, isAdmin, isApproved } = useAuth();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      },
    });
  };

  return (
    <nav className="border-b border-primary/20 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold glow-text tracking-wider" data-testid="link-home">
          &gt; GAME_HUB_
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {isApproved && (
                <>
                  <Link href="/games" className="hover:text-primary/80 transition-colors" data-testid="link-games">[GAMES]</Link>
                  <Link href="/chat" className="hover:text-primary/80 transition-colors" data-testid="link-chat">[CHAT]</Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-destructive hover:text-destructive/80 transition-colors" data-testid="link-admin">
                  [ADMIN_OPS]
                </Link>
              )}
              <Link href="/settings" className="text-primary/60 hover:text-primary transition-colors text-sm" data-testid="link-settings">
                [SETTINGS]
              </Link>
              <div className="flex items-center gap-4 pl-4 border-l border-primary/20">
                <span className="text-sm">
                  User: <span className="glow-text">{user.username}</span>
                  {isAdmin && <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-1 py-0.5 rounded-sm">ROOT</span>}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary/50 hover:bg-primary/10" data-testid="button-logout">
                  LOGOUT
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/settings" className="text-primary/60 hover:text-primary transition-colors text-sm" data-testid="link-settings">
                [SETTINGS]
              </Link>
              <Link href="/login" className="hover:text-primary/80 transition-colors" data-testid="link-login">[LOGIN]</Link>
              <Link href="/register">
                <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-border" data-testid="button-register">
                  REQUEST_ACCESS
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
