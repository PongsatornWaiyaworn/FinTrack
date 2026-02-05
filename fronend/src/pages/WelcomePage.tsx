import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-gray-200/40 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-gray-300/30 blur-3xl" />
      </div>

      <div className="max-w-2xl space-y-8 px-6 text-center">
        {/* Logo */}
        <h1 className="text-5xl font-semibold tracking-tight">
          <span className="text-gray-900">Fin</span>
          <span className="text-gray-400">Track</span>
        </h1>

        {/* Headline */}
        <h2 className="text-2xl font-medium text-gray-900 sm:text-3xl">
          Track your expenses.
          <span className="block text-gray-500">
            Gain clarity over your finances.
          </span>
        </h2>

        {/* Description */}
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          FinTrack is an expense tracking platform designed for{" "}
          <span className="font-medium text-gray-700">
            everyday life, office work, and small teams
          </span>
          . Easily monitor spending, analyze financial behavior, and understand
          where your money goes — all in one simple and secure system.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/login">Get Started</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/register">Create an Account</Link>
          </Button>
        </div>

        {/* Footer note */}
        <div className="space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">
            Simple. Secure. Built for real-world financial tracking.
          </p>
          <p className="text-xs text-muted-foreground">
            Developed by{" "}
            <span className="font-medium text-gray-700">
              Pongsatorn Waiyaworn
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
