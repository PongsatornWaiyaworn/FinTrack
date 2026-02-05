import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setConfirmLogout(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setConfirmLogout(false);
        }}
        className="flex items-center gap-2 text-sm font-medium"
      >
        {mobile ? (
          /* Mobile: avatar */
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700">
            {user.email.charAt(0).toUpperCase()}
          </div>
        ) : (
          /* Desktop: email */
          <>
            <span className="truncate max-w-[250px]">
              {user.email}
            </span>
            {open ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-white shadow">
          {!confirmLogout ? (
            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <div className="space-y-3 px-4 py-3 text-sm">
              <p className="text-gray-700">
                Are you sure you want to log out?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="rounded px-3 py-1 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/welcome", { replace: true });
                  }}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
