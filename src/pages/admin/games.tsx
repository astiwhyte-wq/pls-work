import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useListGames, useCreateGame, useDeleteGame, useUpdateGame,
  getListGamesQueryKey, getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  gameUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL or empty").or(z.literal("")).optional(),
  category: z.string().min(1, "Required"),
  featured: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminGames() {
  const { isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const createGame = useCreateGame();
  const deleteGame = useDeleteGame();
  const updateGame = useUpdateGame();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, isLoading, setLocation]);

  const { data: games, isLoading: gamesLoading } = useListGames({}, {
    query: { queryKey: getListGamesQueryKey({}) },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", gameUrl: "", thumbnailUrl: "", category: "", featured: false },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
  };

  const onSubmit = (data: FormData) => {
    createGame.mutate({
      data: {
        title: data.title,
        description: data.description,
        gameUrl: data.gameUrl,
        thumbnailUrl: data.thumbnailUrl || undefined,
        category: data.category,
        featured: data.featured ?? false,
      },
    }, {
      onSuccess: () => {
        form.reset();
        setShowForm(false);
        invalidate();
      },
    });
  };

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteGame.mutate({ id }, { onSuccess: invalidate });
  };

  const handleToggleFeatured = (id: number, featured: boolean) => {
    updateGame.mutate({ id, data: { featured: !featured } }, { onSuccess: invalidate });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-destructive uppercase tracking-widest">&gt; GAME_MANAGEMENT_</h1>
            <p className="text-primary/40 text-xs font-mono mt-1">{games?.length ?? 0} games in library</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation("/admin")} variant="outline" size="sm" className="border-primary/30 uppercase text-xs font-mono" data-testid="button-back">
              &lt; Back
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-black font-bold uppercase text-xs hover:bg-primary/90 glow-border" data-testid="button-add-game">
              {showForm ? "CANCEL" : "+ ADD_GAME"}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="border border-primary/30 bg-card/50 p-6 mb-6 glow-border">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">&gt; ADD_NEW_GAME</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Title *</FormLabel>
                    <FormControl><Input {...field} placeholder="Game Title" className="bg-background border-primary/30 font-mono text-sm" data-testid="input-game-title" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Category *</FormLabel>
                    <FormControl><Input {...field} placeholder="Puzzle, Arcade, Strategy..." className="bg-background border-primary/30 font-mono text-sm" data-testid="input-game-category" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="gameUrl" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Game URL *</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." className="bg-background border-primary/30 font-mono text-sm" data-testid="input-game-url" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Thumbnail URL (optional)</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." className="bg-background border-primary/30 font-mono text-sm" data-testid="input-thumbnail-url" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Description *</FormLabel>
                    <FormControl><Input {...field} placeholder="Brief description..." className="bg-background border-primary/30 font-mono text-sm" data-testid="input-game-description" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-primary/50" data-testid="checkbox-featured" />
                    </FormControl>
                    <FormLabel className="text-primary/70 text-xs uppercase tracking-widest">Featured (show on home page)</FormLabel>
                  </FormItem>
                )} />
                <div className="md:col-span-2">
                  <Button type="submit" disabled={createGame.isPending} className="bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 glow-border text-xs" data-testid="button-submit-game">
                    {createGame.isPending ? "ADDING..." : "ADD_GAME"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        <div className="border border-primary/20 overflow-hidden">
          <table className="w-full font-mono text-sm">
            <thead className="border-b border-primary/20 bg-card/50">
              <tr>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Title</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Category</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Featured</th>
                <th className="text-left p-3 text-primary/60 uppercase text-xs">Plays</th>
                <th className="text-right p-3 text-primary/60 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gamesLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-primary/40">&gt; LOADING...</td></tr>
              ) : games && games.length > 0 ? (
                games.map((g) => (
                  <tr key={g.id} className="border-b border-primary/10 hover:bg-card/30 transition-colors" data-testid={`row-game-${g.id}`}>
                    <td className="p-3">
                      <div className="glow-text font-bold">{g.title}</div>
                      <div className="text-primary/40 text-xs truncate max-w-xs">{g.gameUrl}</div>
                    </td>
                    <td className="p-3 text-primary/60 uppercase text-xs">{g.category}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleFeatured(g.id, g.featured)}
                        className={`text-xs px-2 py-0.5 border uppercase cursor-pointer ${g.featured ? "border-primary/40 bg-primary/10 text-primary" : "border-primary/20 text-primary/30"}`}
                        data-testid={`button-toggle-featured-${g.id}`}
                      >
                        {g.featured ? "YES" : "NO"}
                      </button>
                    </td>
                    <td className="p-3 text-primary/50">{g.playCount}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleDelete(g.id, g.title)} className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase font-mono h-6 px-2" data-testid={`button-delete-game-${g.id}`}>
                        DELETE
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-8 text-center text-primary/40">&gt; NO_GAMES_FOUND_</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
