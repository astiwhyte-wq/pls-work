import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListGames, getListGamesQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { NavBar } from "@/components/nav-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameThumbnail } from "@/components/game-thumbnail";
import { useEffect } from "react";

const CATEGORIES = ["All", "Action", "Adventure", "Arcade", "Fighting", "Horror", "Music", "Platformer", "Puzzle", "Racing", "Shooter", "Simulation", "Sports", "Strategy", "Word"];

export default function Games() {
  const { isApproved, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!isLoading && !isApproved) {
      setLocation("/pending");
    }
  }, [isApproved, isLoading, setLocation]);

  const params = search
    ? { search }
    : category !== "All"
    ? { category }
    : {};

  const { data: games, isLoading: gamesLoading } = useListGames(params, {
    query: { queryKey: getListGamesQueryKey(params) },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold glow-text mb-2">&gt; GAME_LIBRARY_</h1>
          <p className="text-primary/50 text-sm uppercase tracking-widest">{games?.length ?? 0} titles available</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="search_games..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCategory("All"); }}
            className="bg-background border-primary/30 focus:border-primary font-mono max-w-xs"
            data-testid="input-search"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat && !search ? "default" : "outline"}
                onClick={() => { setCategory(cat); setSearch(""); }}
                className="text-xs uppercase tracking-wider font-mono"
                data-testid={`button-category-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {gamesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-primary/10 bg-card h-52 animate-pulse" />
            ))}
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`} data-testid={`card-game-${game.id}`}>
                <div className="border border-primary/20 bg-card hover:border-primary/60 transition-all cursor-pointer group h-full">
                  <div className="w-full h-32 overflow-hidden border-b border-primary/10">
                    {game.thumbnailUrl ? (
                      <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                      <GameThumbnail title={game.title} category={game.category} id={game.id} className="w-full h-full" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm group-hover:glow-text transition-all uppercase tracking-wide truncate">{game.title}</h3>
                      {game.featured && <span className="text-xs bg-primary/20 text-primary px-1 shrink-0 uppercase font-mono">HOT</span>}
                    </div>
                    <p className="text-primary/50 text-xs line-clamp-2 mb-2">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-primary/40 font-mono">
                      <span className="uppercase">{game.category}</span>
                      <span>{game.playCount} plays</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-primary/40 font-mono">
            <p className="text-lg mb-2">&gt; NO_GAMES_FOUND_</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
