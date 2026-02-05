import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      navigate("/dashboard", { replace: true });

    } catch (err: any) {
      const message = err?.message;

      if (message === "Invalid credentials") {
        setError("Invalid email or password.");
      } else if (message === "Please verify your email first") {
        setError("Please verify your email before logging in.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-gray-200/40 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-gray-300/30 blur-3xl" />
      </div>

      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="text-gray-900">Fin</span>
            <span className="text-gray-400">Track</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your expenses
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Form */}
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Action */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
