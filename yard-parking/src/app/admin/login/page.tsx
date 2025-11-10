"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: searchParams.get("callbackUrl") ?? "/admin",
      });

      if (result?.error) {
        setError("Invalid credentials.");
        return;
      }

      window.location.href = result?.url ?? "/admin";
    });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="card max-w-md w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Admin sign in</h1>
          <p className="text-sm text-slate-600">
            Secure access for yard management. Contact the owner if you need credentials.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          aria-describedby={error ? "login-error" : undefined}
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>

          {error && (
            <div
              id="login-error"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button type="submit" className="btn w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

