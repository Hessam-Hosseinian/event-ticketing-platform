import { useEffect, useState } from "react";
import { Check, TicketCheck } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { api, type StoredTicket } from "../api";
import { useAuth } from "../auth";
import Notice from "./Notice";

function Tickets() {
  const { session } = useAuth();
  const [tickets, setTickets] = useState<StoredTicket[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const remote = await api<StoredTicket[]>("/tickets", {}, session.token);
        const enriched: StoredTicket[] = [];
        for (const ticket of remote) {
          const qr = await api<{ qrDataUrl: string }>(`/tickets/${ticket.id}/qr`, {}, session.token);
          enriched.push({ ...ticket, qrDataUrl: qr.qrDataUrl });
        }
        if (active) {
          setTickets(enriched);
          localStorage.setItem(`narm-tickets-${session.id}`, JSON.stringify(enriched));
        }
      } catch (caught) {
        if (!active) return;
        setError((caught as Error).message);
        try {
          setTickets(JSON.parse(localStorage.getItem(`narm-tickets-${session.id}`) ?? "[]") as StoredTicket[]);
        } catch {
          setTickets([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [session]);

  if (!session) return <Navigate to="/login" />;
  return (
    <section className="section tickets-page">
      <div className="section-title"><div><span>کیف بلیت</span><h2>بلیت‌های من</h2></div></div>
      {error && <Notice text={`${error} — نسخه ذخیره‌شده نمایش داده می‌شود.`} />}
      {loading ? <div className="loader">در حال همگام‌سازی بلیت‌ها…</div> : !tickets.length ? (
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
              {ticket.qrDataUrl && <img className="qr-image" src={ticket.qrDataUrl} alt={`کد QR بلیت ${ticket.seatLabel ?? ticket.id.slice(0, 8)}`} />}
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
