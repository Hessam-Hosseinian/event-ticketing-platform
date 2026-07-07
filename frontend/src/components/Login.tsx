import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import Notice from "./Notice";

function Login() {
  const [email, setEmail] = useState("customer@narm.local"),
    [password, setPassword] = useState("Password123!"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const { session, signIn } = useAuth(),
    navigate = useNavigate();
  if (session) return <Navigate to="/" />;
  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api<{
        accessToken: string;
        role: "CUSTOMER" | "ORGANIZER" | "ADMIN";
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      signIn({ token: result.accessToken, role: result.role, email });
      navigate("/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-mark">ن</div>
        <span className="eyebrow">خوش آمدی</span>
        <h1>ورود به حساب</h1>
        <p>برای رزرو صندلی و دریافت بلیت وارد شو.</p>
        {error && <Notice text={error} />}
        <label>
          ایمیل
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          رمز عبور
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="button wide" disabled={loading}>
          {loading ? "در حال ورود…" : "ورود امن"}
        </button>
        <small>حساب‌های نمایشی با اجرای seed ساخته می‌شوند.</small>
      </form>
    </section>
  );
}

export default Login;
