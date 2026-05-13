import { useAuth } from "@/lib/auth-context";
import { useListFeaturedGames, useGetStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MatrixRain } from "@/components/matrix-rain";

export default function Home() {
  const { user } = useAuth();
  const { data: stats } = useGetStats();
  const { data: featuredGames } = useListFeaturedGames();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <MatrixRain />
      
      <main className="flex-1 container mx-auto px-4 py-12 z-10 flex flex-col items-center justify-center space-y-16">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter glow-text">
            GAME_HUB_
          </h1>
          <p className="text-xl text-primary/80">
            SECURE. EXCLUSIVE. UNDERGROUND.
          </p>
          {!user && (
            <div className="pt-8">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-black font-bold hover:bg-primary/90 glow-border text-lg px-8 py-6 rounded-none uppercase">
                  INITIATE_ACCESS_REQUEST
                </Button>
              </Link>
            </div>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl text-center">
            <div className="border border-primary/20 bg-background/50 p-4 glow-border">
              <div className="text-4xl font-bold glow-text mb-2">{stats.totalGames}</div>
              <div className="text-xs uppercase text-primary/60 tracking-widest">Available Games</div>
            </div>
            <div className="border border-primary/20 bg-background/50 p-4 glow-border">
              <div className="text-4xl font-bold glow-text mb-2">{stats.totalUsers}</div>
              <div className="text-xs uppercase text-primary/60 tracking-widest">Active Operatives</div>
            </div>
            <div className="border border-primary/20 bg-background/50 p-4 glow-border">
              <div className="text-4xl font-bold glow-text mb-2">{stats.totalMessages}</div>
              <div className="text-xs uppercase text-primary/60 tracking-widest">Comms Exchanged</div>
            </div>
            <div className="border border-primary/20 bg-background/50 p-4 glow-border">
              <div className="text-4xl font-bold text-destructive mb-2">{stats.pendingUsers}</div>
              <div className="text-xs uppercase text-primary/60 tracking-widest">In Queue</div>
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl space-y-8">
          <h2 className="text-2xl font-bold border-b border-primary/30 pb-2">&gt; FEATURED_ASSETS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGames?.map(game => (
              <div key={game.id} className="relative group border border-primary/30 bg-card overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {game.thumbnailUrl ? (
                    <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">NO_SIGNAL</div>
                  )}
                  {!user && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="border border-destructive text-destructive px-4 py-2 font-bold rotate-12">
                        CLASSIFIED
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg truncate">{game.title}</h3>
                  <div className="flex justify-between items-center text-xs text-primary/60">
                    <span>CAT: {game.category}</span>
                    <span>PLAYS: {game.playCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
