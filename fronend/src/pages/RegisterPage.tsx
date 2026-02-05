import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "register" | "otp";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [timeLeft, setTimeLeft] = useState(0); // seconds

  /* ---------------- OTP Countdown ---------------- */
  useEffect(() => {
    if (step !== "otp" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------------- Register ---------------- */
  const requestOtp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.status === "ALREADY_VERIFIED") {
        setError("This email is already registered. Please sign in.");
        return;
      }

      setStep("otp");
      setTimeLeft(300); // 5 minutes
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Verify OTP ---------------- */
  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      navigate("/login", { replace: true });
    } catch {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Resend OTP ---------------- */
  const resendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiFetch("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!data.success) {
        setError(data.message);
        return;
      }

      setSuccess("A new OTP has been sent to your email.");
      setTimeLeft(300);
    } catch (err: any) {
      setError(err.message || "Unable to resend OTP.");
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
            {step === "register"
              ? "Create your FinTrack account"
              : "Verify your email address"}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600 text-center">{success}</p>
        )}

        {/* Register Step */}
        {step === "register" && (
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

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={requestOtp}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-4">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading || timeLeft <= 0}
            />

            <div className="text-center text-sm text-muted-foreground">
              {timeLeft > 0 ? (
                <>OTP expires in <span className="font-medium">{formatTime(timeLeft)}</span></>
              ) : (
                <span className="text-red-500">
                  OTP has expired. Please request a new one.
                </span>
              )}
            </div>

            <Button
              onClick={verifyOtp}
              disabled={loading || timeLeft <= 0}
              className="w-full"
              size="lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <button
              onClick={resendOtp}
              disabled={loading}
              className="w-full text-sm text-muted-foreground hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
