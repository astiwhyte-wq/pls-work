import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { MatrixRain } from "@/components/matrix-rain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";

const schema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const login = useLogin();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin" || user.status === "approved") {
        setLocation("/games");
      } else {
        setLocation("/pending");
      }
    }
  }, [user, isLoading, setLocation]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    login.mutate({ data }, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        const u = res.user;
        if (u.role === "admin" || u.status === "approved") {
          setLocation("/games");
        } else {
          setLocation("/pending");
        }
      },
      onError: () => {
        form.setError("password", { message: "Invalid username or password" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="border border-primary/30 bg-background/90 backdrop-blur p-8 glow-border">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold glow-text tracking-wider block mb-2" data-testid="link-home">&gt; GAME_HUB_</Link>
            <p className="text-primary/60 text-sm uppercase tracking-widest">Authentication Required</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/80 uppercase text-xs tracking-widest">Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="enter_username" className="bg-background border-primary/30 focus:border-primary font-mono" data-testid="input-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/80 uppercase text-xs tracking-widest">Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="enter_password" className="bg-background border-primary/30 focus:border-primary font-mono" data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 glow-border"
                disabled={login.isPending}
                data-testid="button-login"
              >
                {login.isPending ? "AUTHENTICATING..." : "AUTHENTICATE"}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-primary/50">
            No access?{" "}
            <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
              REQUEST_ACCESS
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
