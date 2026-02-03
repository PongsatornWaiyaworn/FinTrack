import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/types/AuthContext";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
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
      navigate("/", { replace: true });

    } catch (err: any) {
      const message = err?.message;

      if (message === "Invalid credentials") {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (message === "Please verify your email first") {
        setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
      } else {
        setError("ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </button>
      </div>
    </div>
  );
}
