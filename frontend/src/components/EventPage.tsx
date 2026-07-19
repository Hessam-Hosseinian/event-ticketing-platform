import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CalendarDays, ChevronLeft, MapPin, ShieldCheck } from "lucide-react";
import { api, type EventDetail, type Reservation, type WaitingRoomEntry } from "../api";
import { useAuth } from "../auth";
import Notice from "./Notice";

function EventPage() {
  const { id } = useParams(),
    { session } = useAuth(),
    navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null),
    [selected, setSelected] = useState<string[]>([]),
    [phase, setPhase] = useState<"view" | "waiting" | "reserving">("view"),
    [queuePosition, setQueuePosition] = useState<number | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () => api<EventDetail>(`/events/${id}`)
      .then((result) => {
        if (!active) return;
        setEvent(result);
        setSelected((current) => current.filter((seatId) => result.inventory.some((seat) => seat.id === seatId && seat.state === "AVAILABLE")));
      })
      .catch((caught) => { if (active) setError((caught as Error).message); });
    void refresh();
    const timer = window.setInterval(refresh, 10_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [id]);
  const chosen = useMemo(
      () => event?.inventory.filter((x) => selected.includes(x.id)) ?? [],
      [event, selected]
    ),
    total = chosen.reduce((s, x) => s + Number(x.price), 0);
  function toggle(seatId: string) {
    setSelected((current) =>
      current.includes(seatId)
        ? current.filter((x) => x !== seatId)
        : current.length < 10
        ? [...current, seatId]
        : current
    );
  }
  async function reserve() {
    if (!session) return navigate("/login");
    setError("");
    setPhase("waiting");
    try {
      let admission = await api<WaitingRoomEntry>(
        `/waiting-room/${id}/join`,
        { method: "POST" },
        session.token
      );
      setQueuePosition(admission.position);
      for (let attempt = 0; admission.state === "QUEUED" && attempt < 60; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, Math.min(5000, 1500 + attempt * 100)));
        admission = await api<WaitingRoomEntry>(`/waiting-room/${admission.id}`, {}, session.token);
        setQueuePosition(admission.position);
      }
      if (admission.state !== "ADMITTED" || !admission.admissionToken) {
        throw new Error("زمان انتظار طولانی شد؛ جایگاه شما حفظ شده و می‌توانید دوباره وضعیت را بررسی کنید.");
      }
      setPhase("reserving");
      const reservation = await api<Reservation>(
        "/reservations",
        {
          method: "POST",
          body: JSON.stringify({ eventId: id, seatIds: selected, admissionToken: admission.admissionToken }),
        },
        session.token
      );
      sessionStorage.setItem(
        "narm-reservation",
        JSON.stringify({
          ...reservation,
          eventTitle: event?.title,
          seats: chosen,
          total: Number(reservation.totalAmount || total),
        })
      );
      navigate(`/checkout/${reservation.id}`);
    } catch (e) {
      setError((e as Error).message);
      setPhase("view");
      setQueuePosition(null);
    }
  }
  if (!event)
    return <div className="loader">{error || "در حال بارگذاری سالن…"}</div>;
  const rows = event.inventory.reduce<Record<string, typeof event.inventory>>(
    (g, s) => {
      g[s.row] = [...(g[s.row] ?? []), s];
      return g;
    },
    {}
  );
  return (
    <section className="booking-page">
      <div className="booking-head">
        <div>
          <Link to="/">رویدادها</Link>
          <span>/</span>
          <b>{event.title}</b>
        </div>
        <h1>{event.title}</h1>
        <p>
          <CalendarDays />
          {new Date(event.startsAt).toLocaleString("fa-IR")}
          <MapPin />
          {event.venue?.name ?? event.city}
        </p>
      </div>
      <div className="booking-layout">
        <div>
          {error && <Notice text={error} />}
          {phase === "waiting" && queuePosition !== null && (
            <Notice kind="success" text={`جایگاه شما در صف: ${queuePosition.toLocaleString("fa-IR")}. وضعیت خودکار بررسی می‌شود.`} />
          )}
          <div className="map-card">
            <div className="stage">
              <span>صحنه</span>
            </div>
            <div className="legend">
              <span>
                <i className="available" />
                آزاد
              </span>
              <span>
                <i className="selected" />
                انتخاب شما
              </span>
              <span>
                <i className="locked" />
                رزرو شده
              </span>
            </div>
            <div className="seat-map">
              {Object.entries(rows).map(([row, seats]) => (
                <div className="seat-row" key={row}>
                  <b>{row}</b>
                  <div>
                    {seats.map((seat) => (
                      <button
                        key={seat.id}
                        disabled={seat.state !== "AVAILABLE"}
                        onClick={() => toggle(seat.id)}
                        aria-pressed={selected.includes(seat.id)}
                        aria-label={`ردیف ${seat.row}، صندلی ${seat.number}، ${seat.state === "AVAILABLE" ? "آزاد" : "غیرقابل انتخاب"}${seat.accessible ? "، دسترس‌پذیر" : ""}`}
                        title={`${Number(seat.price).toLocaleString("fa-IR")} ${seat.currency}`}
                        className={
                          selected.includes(seat.id)
                            ? "chosen"
                            : seat.state.toLowerCase()
                        }
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                  <b>{row}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="order-card">
          <h2>خلاصه انتخاب</h2>
          <div className="event-mini">
            <div>{event.title.slice(0, 1)}</div>
            <span>
              <b>{event.title}</b>
              <small>
                {new Date(event.startsAt).toLocaleDateString("fa-IR")}
              </small>
            </span>
          </div>
          <div className="selected-list">
            {chosen.length ? (
              chosen.map((s) => (
                <div key={s.id}>
                  <span>
                    ردیف {s.row}، صندلی {s.number}
                  </span>
                  <b>
                    {Number(s.price).toLocaleString("fa-IR")} {s.currency}
                  </b>
                </div>
              ))
            ) : (
              <p>صندلی‌های موردنظرت را از نقشه انتخاب کن.</p>
            )}
          </div>
          <div className="total">
            <span>مبلغ کل</span>
            <strong>
              {total.toLocaleString("fa-IR")} <small>ریال</small>
            </strong>
          </div>
          <button
            className="button wide"
            disabled={!selected.length || phase !== "view"}
            onClick={reserve}
          >
            {phase === "waiting"
              ? "ورود به صف…"
              : phase === "reserving"
              ? "ثبت رزرو…"
              : "ادامه و پرداخت"}
            <ChevronLeft />
          </button>
          <small className="secure" aria-live="polite">
            <ShieldCheck />
            صندلی‌ها پس از رزرو ۱۰ دقیقه قفل می‌شوند.
          </small>
        </aside>
      </div>
    </section>
  );
}

export default EventPage;
