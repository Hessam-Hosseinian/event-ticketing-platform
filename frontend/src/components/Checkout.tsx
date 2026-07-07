import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { api, type Ticket } from "../api";
import { useAuth } from "../auth";
import Notice from "./Notice";

function Checkout() {
  const { reservationId } = useParams(),
    { session } = useAuth(),
    navigate = useNavigate();
  const [outcome, setOutcome] = useState("success"),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    reservation = JSON.parse(
      sessionStorage.getItem("narm-reservation") ?? "{}"
    );
  if (!session) return <Navigate to="/login" />;
  const token = session.token;
  async function pay() {
    setLoading(true);
    setError("");
    try {
      const payment = await api<{ id: string }>(
        "/payments",
        { method: "POST", body: JSON.stringify({ reservationId }) },
        token
      );
      await api<{ tickets?: Ticket[] }>(
        `/payments/${payment.id}/simulate/${outcome}`,
        { method: "POST" },
        token
      );
      if (outcome === "success") {
        const tickets = await api<Ticket[]>(
          `/tickets/reservation/${reservationId}`,
          {},
          token
        );
        localStorage.setItem("narm-tickets", JSON.stringify(tickets));
        navigate("/tickets");
      } else
        setError(
          outcome === "timeout"
            ? "پرداخت منقضی شد و صندلی آزاد گردید."
            : "پرداخت ناموفق بود و صندلی آزاد گردید."
        );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="checkout-page">
      <div className="payment-card">
        <span className="eyebrow">درگاه شبیه‌سازی‌شده</span>
        <h1>تکمیل پرداخت</h1>
        <div className="payment-summary">
          <span>
            {reservation.seats.length.toLocaleString("fa-IR")} ⨯{" "}
            {reservation.eventTitle ?? "رزرو بلیت"}
          </span>
          <strong>
            {Number(reservation.total ?? 0).toLocaleString("fa-IR")} ریال
          </strong>
        </div>
        {error && <Notice text={error} />}
        <label>
          سناریوی پرداخت
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option value="success">پرداخت موفق</option>
            <option value="failure">پرداخت ناموفق</option>
            <option value="timeout">اتمام زمان پرداخت</option>
          </select>
        </label>
        <div className="fake-card">
          <small>شماره کارت آزمایشی</small>
          <b>۶۲۱۹ **** **** ۱۲۳۴</b>
          <div>
            <span>
              CVV2
              <br />
              <b>۱۲۳</b>
            </span>
            <span>
              تاریخ
              <br />
              <b>۰۹ / ۰۸</b>
            </span>
          </div>
        </div>
        <button className="button wide" onClick={pay} disabled={loading}>
          {loading ? "در حال پردازش…" : "پرداخت و صدور بلیت"}
        </button>
      </div>
    </section>
  );
}

export default Checkout;
