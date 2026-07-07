import { useState, FormEvent } from "react";
import { api } from "../api";

function VenueForm({ token, done }: { token: string; done: () => void }) {
  const [name, setName] = useState(""),
    [city, setCity] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    await api(
      "/venues",
      { method: "POST", body: JSON.stringify({ name, city }) },
      token
    );
    done();
    setName("");
    setCity("");
  }
  return (
    <form className="inline-form" onSubmit={submit}>
      <input
        placeholder="نام مجموعه"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="شهر"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <button className="button">ثبت سالن</button>
    </form>
  );
}

export default VenueForm;
