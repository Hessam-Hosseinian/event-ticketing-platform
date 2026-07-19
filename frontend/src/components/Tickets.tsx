import { Check, TicketCheck } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import type { StoredTicket } from "../api";
import { useAuth } from "../auth";

function Tickets() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" />;
  let tickets: StoredTicket[] = [];
  try {
    tickets = JSON.parse(localStorage.getItem(`narm-tickets-${session.id}`) ?? "[]") as StoredTicket[];
  } catch {
    tickets = [];
  }
  return (
    <section className="section tickets-page">
      <div className="section-title"><div><span>کیف بلیت</span><h2>بلیت‌های من</h2></div></div>
      {!tickets.length ? (
        <div className="empty">هنوز بلیتی صادر نشده است. <Link to="/">مشاهده رویدادها</Link></div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <article className="ticket" key={ticket.id}>
              <div className="ticket-top">
                <div className="auth-mark">ن</div>
                <span><b>{ticket.eventTitle ?? "بلیت معتبر"}</b><small>{ticket.seatLabel ?? `شناسه ${ticket.id.slice(0, 8)}`}</small></span>
                <TicketCheck aria-hidden="true" />
              </div>
              <img className="qr-image" src={ticket.qrDataUrl} alt={`کد QR بلیت ${ticket.seatLabel ?? ticket.id.slice(0, 8)}`} />
              <code>{ticket.id}</code>
              <div className="valid"><Check aria-hidden="true" />{ticket.checkedInAt ? "استفاده‌شده" : "آماده ورود و اعتبارسنجی"}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Tickets;
