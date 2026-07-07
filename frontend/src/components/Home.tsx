import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  Clock3,
  TicketCheck,
  Sparkles,
} from "lucide-react";
import { api, ApiError, type EventSummary } from "../api";
import EventCard from "./EventCard";
import Notice from "./Notice";

function Home() {
  const [events, setEvents] = useState<EventSummary[]>([]),
    [query, setQuery] = useState(""),
    [genre, setGenre] = useState(""),
    [city, setCity] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (genre) p.set("genre", genre);
      if (city) p.set("city", city);
      api<EventSummary[]>(`/events?${p}`)
        .then(setEvents)
        .catch((e: ApiError) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, genre, city]);
  return (
    <>
      <section className="hero">
        <div className="hero-orbit" />
        <div className="eyebrow">
          <Sparkles size={16} />
          همین لحظه، یک تجربه تازه
        </div>
        <h1>
          جایی برای <em>خاطره‌های</em>
          <br />
          فراموش‌نشدنی
        </h1>
        <p>
          از کنسرت و تئاتر تا رویدادهای ورزشی؛ صندلی‌ات را امن و فوری انتخاب کن.
        </p>
        <div className="search-box">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی نام رویداد..."
          />
          <select
            id="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">همه دسته‌ها</option>
            <option value="Music">موسیقی</option>
            <option value="Theatre">تئاتر</option>
            <option value="Sport">ورزشی</option>
            <option value="Conference">همایش</option>
          </select>
          <input
            id="city-filter"
            className="city-filter"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="شهر"
          />
        </div>
        <div className="trust-row">
          <span>
            <ShieldCheck />
            رزرو امن
          </span>
          <span>
            <Clock3 />
            قفل ۱۰ دقیقه‌ای
          </span>
          <span>
            <TicketCheck />
            بلیت قابل اعتبارسنجی
          </span>
        </div>
      </section>
      <section className="section">
        <div className="section-title">
          <div>
            <span>انتخاب‌های این هفته</span>
            <h2>رویدادهای پیش رو</h2>
          </div>
          <b>{events.length.toLocaleString("fa-IR")} رویداد</b>
        </div>
        {error && <Notice text={error} />}{" "}
        {loading ? (
          <div className="loader">در حال دریافت رویدادها…</div>
        ) : (
          <div className="event-grid">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
        {!loading && !events.length && (
          <div className="empty">رویدادی با این مشخصات پیدا نشد.</div>
        )}
      </section>
    </>
  );
}

export default Home;
