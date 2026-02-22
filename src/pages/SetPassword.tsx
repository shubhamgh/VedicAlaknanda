import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type PageState = "loading" | "ready" | "invalid" | "submitting";

function parseHashParams(): Record<string, string> {
  const hash = window.location.hash?.slice(1) || "";
  return Object.fromEntries(
    hash.split("&").map((p) => {
      const [k, v] = p.split("=");
      return [k, decodeURIComponent(v || "")];
    })
  );
}

function hasAuthTokensInUrl(): boolean {
  const hash = parseHashParams();
  const code = new URLSearchParams(window.location.search).get("code");
  return !!(hash.access_token || hash.refresh_token || code);
}

function getPasswordStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  return { score, label: labels[score] };
}

export default function SetPassword() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const strength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValidPassword = password.length >= 6;
  const canSubmit =
    isValidPassword && passwordsMatch && pageState === "ready" && session;

  const establishSession = useCallback(async () => {
    // PKCE flow: exchange code in query params for session
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        setSession(data.session);
        setPageState("ready");
        return true;
      }
    }

    // Implicit flow: Supabase processes hash params on load; session may be available immediately
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (currentSession) {
      setSession(currentSession);
      setPageState("ready");
      return true;
    }

    // If URL has auth tokens but no session yet, wait for client to process
    if (hasAuthTokensInUrl()) {
      return new Promise<boolean>((resolve) => {
        let resolved = false;
        let sub: { unsubscribe: () => void } | undefined;

        const done = (ok: boolean, s?: Session | null) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timeoutId);
          sub?.unsubscribe();
          if (ok && s) {
            setSession(s);
            setPageState("ready");
            resolve(true);
          } else {
            setPageState("invalid");
            resolve(false);
          }
        };

        const timeoutId = setTimeout(async () => {
          const { data: { session: s } } = await supabase.auth.getSession();
          done(!!s, s ?? undefined);
        }, 1500);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            if (newSession) done(true, newSession);
          }
        );
        sub = subscription;
      });
    }

    return false;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      // Already authenticated (e.g. normal login) — redirect to admin
      if (currentSession && !hasAuthTokensInUrl()) {
        navigate("/admin", { replace: true });
        return;
      }

      if (currentSession && (hasAuthTokensInUrl() || window.location.hash)) {
        if (mounted) {
          setSession(currentSession);
          setPageState("ready");
        }
        return;
      }

      const established = await establishSession();
      if (mounted && !established) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setPageState("invalid");
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [establishSession, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !session) return;

    setPageState("submitting");
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      toast({
        title: "Password set successfully",
        description: "You can now sign in with your new password.",
      });
      navigate("/admin-login", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to set password";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setPageState("ready");
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-hotel-gold border-t-transparent" />
              <p className="text-muted-foreground">Verifying your link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Invalid or expired link
            </CardTitle>
            <p className="text-center text-muted-foreground text-sm">
              This password reset or invite link may have expired or already been used.
              Please request a new link.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() => navigate("/admin-login", { replace: true })}
              >
                Back to login
              </Button>
              <p className="text-center text-sm text-gray-500">
                <a href="/" className="text-hotel-gold hover:underline">
                  Return to homepage
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Set your password</CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Enter a new password below. Use at least 6 characters.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
                required
                autoComplete="new-password"
              />
              {password && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength.score <= 1
                          ? "bg-red-500"
                          : strength.score <= 2
                            ? "bg-amber-500"
                            : strength.score <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  {strength.label && (
                    <span className="text-muted-foreground">{strength.label}</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
                required
                autoComplete="new-password"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || pageState === "submitting"}
            >
              {pageState === "submitting" ? "Setting password..." : "Set password"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            <a href="/" className="text-hotel-gold hover:underline">
              Return to homepage
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
