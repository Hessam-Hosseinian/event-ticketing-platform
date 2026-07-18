import { Link } from "react-router-dom";
import { Check, TicketCheck } from "lucide-react";
import type { Ticket } from "../api";

function Tickets() {
  const tickets: Ticket[] = JSON.parse(
    localStorage.getItem("narm-tickets") ?? "[]"
  );
  return (
    <section className="section tickets-page">
      <div className="section-title">
        <div>
          <span>کیف بلیت</span>
          <h2>بلیت‌های من</h2>
        </div>
      </div>
      {!tickets.length ? (
        <div className="empty">
          هنوز بلیتی صادر نشده است. <Link to="/">مشاهده رویدادها</Link>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((t) => (
            <article className="ticket" key={t.id}>
              <div className="ticket-top">
                <div className="auth-mark">ن</div>
                <span>
                  <b>بلیت معتبر</b>
                  <small>شناسه {t.id.slice(0, 8)}</small>
                </span>
                <TicketCheck />
              </div>
              <div className="qr">
                {Array.from({ length: 64 }, (_, i) => (
                  <i
                    key={i}
                    className={
                      parseInt(t.qrHash[i] ?? "0", 16) % 2 ? "dark" : ""
                    }
                  />
                ))}
              </div>
              <code>{t.token}</code>
              <div className="valid">
                <Check />
                آماده ورود و اعتبارسنجی
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Tickets;
