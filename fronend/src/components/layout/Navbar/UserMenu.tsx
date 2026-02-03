import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/types/authContext";
import { LogoutConfirmModal } from "../../ui/logoutConfirmModal";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <>
      <div ref={ref} className="relative">
        {/* email */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {user.email}
          {open ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* dropdown */}
        {open && (
          <div className="absolute right-0 z-50 mt-2 w-40 rounded border bg-white shadow">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowConfirm(true);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* confirm modal */}
      {showConfirm && (
        <LogoutConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        />
      )}
    </>
  );
}
