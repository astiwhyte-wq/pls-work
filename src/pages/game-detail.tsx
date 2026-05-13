import { useRoute, useLocation } from "wouter";
import { useGetGame, getGetGameQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function GameDetail() {
  const { isApproved, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/games/:id");
  const id = match ? parseInt(params!.id, 10) : 0;

  useEffect(() => {
    if (!isLoading && !isApproved) {
      setLocation("/pending");
    }
  }, [isApproved, isLoading, setLocation]);

  const { data: game, isLoading: gameLoading } = useGetGame(id, {
    query: { enabled: !!id, queryKey: getGetGameQueryKey(id) },
  });

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-primary/50 font-mono">
          &gt; LOADING_GAME...
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-primary/50 font-mono">&gt; GAME_NOT_FOUND_</p>
          <Button onClick={() => setLocation("/games")} variant="outline" className="border-primary/30 uppercase text-sm">
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <div className="border-b border-primary/20 px-4 py-3 flex items-center justify-between bg-card/50">
          <div>
            <h1 className="font-bold text-lg glow-text uppercase tracking-wide">{game.title}</h1>
            <p className="text-primary/50 text-xs font-mono uppercase">{game.category} &bull; {game.playCount} plays</p>
          </div>
          <Button
            onClick={() => setLocation("/games")}
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10 uppercase text-xs font-mono"
            data-testid="button-back"
          >
            &lt; BACK
          </Button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <p className="text-primary/60 text-sm mb-4 font-mono max-w-2xl">{game.description}</p>
          <div className="flex-1 border border-primary/20 bg-black" style={{ minHeight: "600px" }}>
            <iframe
              src={game.gameUrl}
              className="w-full h-full"
              style={{ minHeight: "600px" }}
              title={game.title}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
              data-testid="iframe-game"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
