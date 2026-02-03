import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/types/AuthContext";

type Step = "register" | "otp";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const requestOtp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.status === "ALREADY_VERIFIED") {
            setError("อีเมลนี้สมัครและยืนยันแล้ว กรุณาเข้าสู่ระบบ");
            return;
        }

      setUserId(data.userId);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/auth/resend-otp", {
            method: "POST",
            body: JSON.stringify({ email }),
            });

            if (!data.success) {
            setError(data.message);
            return;
            }

            setSuccess("ส่ง OTP ใหม่เรียบร้อยแล้ว กรุณาตรวจสอบอีเมล");
        } catch (err: any) {
            setError(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
        }
    };

  const verifyOtp = async () => {
    if (!otp) {
      setError("กรุณากรอก OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ userId, otp }),
      });

      login(data.token, data.user);
      navigate("/", { replace: true });
    } catch {
      setError("OTP ไม่ถูกต้องหรือหมดอายุ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded border p-6 shadow">
        <h1 className="text-2xl font-bold text-center">
          {step === "register" ? "Register" : "Verify OTP"}
        </h1>

        {error ? (
            <p className="text-red-500 text-sm text-center">{error}</p>
        ) : success ? (
            <p className="text-green-600 text-sm text-center">{success}</p>
        ) : null}

        {step === "register" && (
          <>
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

            <input
              type="password"
              className="w-full border p-2 rounded"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
            >
              {loading ? "กำลังส่ง OTP..." : "Request OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              className="w-full border p-2 rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
            >
              {loading ? "กำลังตรวจสอบ..." : "Verify OTP"}
            </button>

            <button
              onClick={resendOtp}
              disabled={loading}
              className="w-full text-sm text-gray-600 underline disabled:opacity-50"
            >
              ส่ง OTP อีกครั้ง
            </button>
          </>
        )}
      </div>
    </div>
  );
}
