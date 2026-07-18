export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
export type Role = "CUSTOMER" | "ORGANIZER" | "ADMIN";
export type SeatState = "AVAILABLE" | "LOCKED" | "BOOKED";
export interface EventSummary {
  id: string;
  title: string;
  genre: string;
  startsAt: string;
  city: string;
  description?: string;
}
export interface InventorySeat {
  id: string;
  seatId: string;
  row: string;
  number: number;
  state: SeatState;
  price: number;
  currency: string;
}
export interface EventDetail extends EventSummary {
  published: boolean;
  venue?: { name: string; city: string };
  inventory: InventorySeat[];
}
export interface Ticket {
  id: string;
  token: string;
  qrHash: string;
  seatId: string;
}
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => ({ message: "خطای ناشناخته" }));
    throw new ApiError(
      response.status,
      Array.isArray(body.message)
        ? body.message.join("، ")
        : body.message ?? body.detail ?? "درخواست ناموفق بود"
    );
  }
  return response.json() as Promise<T>;
}
