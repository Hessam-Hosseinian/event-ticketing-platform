import { useAuth } from "../auth";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound, LogOut } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  const [live, setLive] = useState("");
  useEffect(() => {
    if (!session) return;
    const socket = io(import.meta.env.VITE_WS_URL ?? "http://localhost:3000", {
      auth: { token: session.token },
    });
    let toastTimer: number | undefined;
    [
      "payment.started",
      "payment.succeeded",
      "payment.failed",
      "ticket.issued",
    ].forEach((name) =>
      socket.on(name, () => {
        setLive(name);
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => setLive(""), 3500);
      })
    );
    return () => {
      window.clearTimeout(toastTimer);
      socket.close();
    };
  }, [session]);
  return (
    <div className="shell">
      <header>
        <Link className="brand" to="/">
          <span>ن</span>
          <strong>نرم</strong>
        </Link>
        <nav>
          <Link to="/">رویدادها</Link>
          {session && <Link to="/tickets">بلیت‌های من</Link>}
          {session && session.role !== "CUSTOMER" && (
            <Link to="/manage">مدیریت</Link>
          )}
        </nav>
        <div className="header-actions">
          {session ? (
            <>
              <span className="user-pill">
                <CircleUserRound size={24} />
                {session.name || session.email}
              </span>
              <button className="icon-button" title="خروج" aria-label="خروج از حساب" onClick={signOut}>
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <Link className="button small" to="/login">
              ورود
            </Link>
          )}
        </div>
      </header>
      {live && (
        <div className="live-toast">
          <span />
          به‌روزرسانی زنده: {live}
        </div>
      )}
      <main>{children}</main>
      <footer>
        <strong>نرم</strong>
        <span>تجربه‌ای آرام برای شلوغ‌ترین اجراها</span>
      </footer>
    </div>
  );
}

export default Layout;
