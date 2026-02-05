import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Receipt, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/layout/Navbar/UserMenu";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <span className="text-xl font-semibold tracking-wide">
                <span className="text-gray-900">Fin</span>
                <span className="text-gray-400">Track</span>
              </span>
            </Link>

            <nav className="ml-8 flex items-center gap-1">
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
              <UserMenu />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
}
