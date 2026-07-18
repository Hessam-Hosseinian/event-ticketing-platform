import { useState } from "react";
import { Navigate } from "react-router-dom";
import { CalendarDays, TicketCheck, Users } from "lucide-react";
import { useAuth } from "../auth";
import Notice from "./Notice";
import VenueForm from "./VenueForm";

function Manage() {
  const { session } = useAuth(),
    [message, setMessage] = useState("");
  if (!session) return <Navigate to="/login" />;
  if (session.role === "CUSTOMER") return <Navigate to="/" />;
  return (
    <section className="section">
      <div className="section-title">
        <div>
          <span>پنل برگزارکننده</span>
          <h2>مدیریت رویدادها</h2>
        </div>
      </div>
      {message && <Notice text={message} kind="success" />}
      <div className="stats">
        <div>
          <Users />
          <span>
            <b>۲۰</b>صندلی تعریف‌شده
          </span>
        </div>
        <div>
          <CalendarDays />
          <span>
            <b>۵</b>رویداد فعال
          </span>
        </div>
        <div>
          <TicketCheck />
          <span>
            <b>۰</b>فروش امروز
          </span>
        </div>
      </div>
      <div className="manage-card">
        <h3>ایجاد سریع سالن</h3>
        <p>
          نام مجموعه و شهر را ثبت کنید؛ ساخت بخش‌ها و صندلی‌ها از Swagger نیز
          قابل انجام است.
        </p>
        <VenueForm
          token={session.token}
          done={() => setMessage("سالن جدید با موفقیت ساخته شد.")}
        />
      </div>
    </section>
  );
}

export default Manage;
