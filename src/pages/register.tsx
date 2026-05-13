import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { MatrixRain } from "@/components/matrix-rain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  username: z.string().min(3, "Min 3 characters").max(20, "Max 20 characters"),
  displayName: z.string().min(2, "Min 2 characters").max(30, "Max 30 characters"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const register = useRegister();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", displayName: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    register.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/pending");
      },
      onError: (err: any) => {
        const msg = err?.data?.error || "Registration failed";
        form.setError("username", { message: msg });
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
            <p className="text-primary/60 text-sm uppercase tracking-widest">Access Request</p>
          </div>

          <div className="mb-6 p-3 border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400/80 font-mono">
            <p className="uppercase tracking-wider">Notice: Admin Approval Required</p>
            <p className="mt-1 text-yellow-400/60">Your request will be reviewed. Access is granted at admin discretion.</p>
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
                      <Input {...field} placeholder="choose_username" className="bg-background border-primary/30 focus:border-primary font-mono" data-testid="input-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/80 uppercase text-xs tracking-widest">Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="your_display_name" className="bg-background border-primary/30 focus:border-primary font-mono" data-testid="input-display-name" />
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
                      <Input {...field} type="password" placeholder="min_6_chars" className="bg-background border-primary/30 focus:border-primary font-mono" data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 glow-border"
                disabled={register.isPending}
                data-testid="button-register"
              >
                {register.isPending ? "SUBMITTING..." : "SUBMIT_REQUEST"}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-primary/50">
            Already approved?{" "}
            <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
