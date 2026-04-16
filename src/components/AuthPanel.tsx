"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthPanelProps = {
  credentialsEnabled: boolean;
  googleEnabled: boolean;
};

export function AuthPanel({ credentialsEnabled, googleEnabled }: AuthPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("redirectTo") || "/app", [searchParams]);
  const [signingIn, setSigningIn] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  async function handleCredentialsSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!credentialsEnabled) {
      toast.error("Email sign-in is not available until the database is configured.");
      return;
    }

    setSigningIn(true);
    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (!result || result.error) {
        toast.error("Sign in failed. Check your email and password.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } finally {
      setSigningIn(false);
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!credentialsEnabled) {
      toast.error("Account creation is not available until the database is configured.");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName.trim() || undefined,
          email: registerEmail.trim(),
          password: registerPassword,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "Could not create account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: registerEmail.trim(),
        password: registerPassword,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        toast.success("Account created. Sign in to continue.");
        return;
      }

      toast.success("Account created.");
      router.push(redirectTo);
      router.refresh();
    } finally {
      setRegistering(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { redirectTo });
  }

  return (
    <div className="focus-panel rounded-[2rem] border border-line p-6 md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="focus-kicker mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Account access
          </p>
          <h2 className="font-display text-4xl leading-none text-ink md:text-5xl">Keep your momentum synced.</h2>
        </div>
        <div className="hidden rounded-full border border-line bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-ink-soft md:block">
          FocusSteps
        </div>
      </div>

      <p className="max-w-xl text-base leading-7 text-ink-soft">
        Sign in when you want saved history, billing, and reminders. Local mode still works without an account.
      </p>

      <Tabs defaultValue="signin" className="mt-6">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-[1.2rem] border border-line bg-white/70 p-1">
          <TabsTrigger value="signin" className="rounded-[0.95rem] py-2.5">
            Sign in
          </TabsTrigger>
          <TabsTrigger value="create" className="rounded-[0.95rem] py-2.5">
            Create account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-5">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="h-14 rounded-[1.2rem] border-line bg-white/80 pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="h-14 rounded-[1.2rem] border-line bg-white/80 pl-11"
                  placeholder="Your password"
                />
              </div>
            </label>

            <Button
              type="submit"
              disabled={signingIn || !loginEmail.trim() || !loginPassword.trim() || !credentialsEnabled}
              className="h-14 w-full rounded-full bg-teal text-base text-white hover:bg-[#175553]"
            >
              {signingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Continue to dashboard
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="create" className="mt-5">
          <form onSubmit={handleRegister} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Name</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  autoComplete="name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="h-14 rounded-[1.2rem] border-line bg-white/80 pl-11"
                  placeholder="What should we call you?"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  type="email"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="h-14 rounded-[1.2rem] border-line bg-white/80 pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="h-14 rounded-[1.2rem] border-line bg-white/80 pl-11"
                  placeholder="At least 6 characters"
                />
              </div>
            </label>

            <Button
              type="submit"
              disabled={registering || !registerEmail.trim() || registerPassword.length < 6 || !credentialsEnabled}
              className="h-14 w-full rounded-full bg-clay text-base text-white hover:bg-[#b45630]"
            >
              {registering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {googleEnabled ? (
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="h-12 w-full rounded-full border-line bg-white/75 text-ink"
          >
            Continue with Google
          </Button>
        </div>
      ) : null}

      {!credentialsEnabled && (
        <div className="mt-5 rounded-[1.3rem] border border-line bg-white/70 px-4 py-3 text-sm leading-6 text-ink-soft">
          Email sign-in is disabled until the local database is configured. You can still use local mode from{" "}
          <Link href="/app/new" className="text-teal underline underline-offset-4">
            the new task page
          </Link>
          .
        </div>
      )}
    </div>
  );
}
