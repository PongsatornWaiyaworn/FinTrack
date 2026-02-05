import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-gray-200/40 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-gray-300/30 blur-3xl" />
      </div>

      <div className="max-w-2xl text-center space-y-8 px-6">
        {/* Logo */}
        <h1 className="text-5xl font-semibold tracking-tight">
          <span className="text-gray-900">Fin</span>
          <span className="text-gray-400">Track</span>
        </h1>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-medium text-gray-900">
          Track your expenses.  
          <span className="block text-gray-500">
            Understand your financial habits.
          </span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          FinTrack is a smart expense tracking platform that helps you monitor
          spending, analyze financial behavior, and gain clear insights into
          your personal finances — all in one place.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link to="/login">Get Started</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/register">Create an Account</Link>
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground pt-6">
          Simple. Secure. Designed for everyday finance tracking.
        </p>
      </div>
    </div>
  );
}
