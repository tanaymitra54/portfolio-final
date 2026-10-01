import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import api from "@/api";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: () => api.portfolio.adminLogin({ email, password }),
    onSuccess: () => {
      // Persist local auth state for the frontend gate and API header usage.
      localStorage.setItem("admin_password", password);
      localStorage.setItem("admin_verified", "true");
      toast({
        title: "Login successful",
        description: "You have been logged in to the admin dashboard.",
      });
      navigate("/admin");
    },
    onError: (err) => {
      console.error("Failed to login:", err);
      const message = err instanceof Error ? err.message : String(err);
      // Common backend messages: "invalid password", "admin password not configured", etc.
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Admin Login</CardTitle>
            <CardDescription>Use your admin Gmail and password to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canLogin) loginMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="email">Admin Gmail</Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative mt-2">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full btn-primary glow-green" disabled={!canLogin || loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
