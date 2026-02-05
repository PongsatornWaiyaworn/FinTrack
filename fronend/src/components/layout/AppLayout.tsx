import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/layout/Navbar/UserMenu";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Add Expense", href: "/expenses/new", icon: PlusCircle },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <span className="text-xl tracking-wide">
                <span className="text-gray-900">Fin</span>
                <span className="text-gray-400">Track</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="ml-8 hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href === "/expenses" &&
                    location.pathname.startsWith("/expenses/edit"));

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Desktop: email */}
                <div className="hidden md:block max-w-[180px]">
                  <UserMenu />
                </div>

                {/* Mobile: icon only */}
                <div className="md:hidden">
                  <UserMenu mobile />
                </div>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:flex gap-2">
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col p-4 gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  <span className="truncate max-w-[140px] sm:max-w-[200px]">
                    {item.name}
                  </span>

                </Link>
              ))}

              {!user && (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
}
