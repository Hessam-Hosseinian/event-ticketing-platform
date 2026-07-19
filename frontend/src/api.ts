export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Role = "CUSTOMER" | "ORGANIZER" | "ADMIN";
export type SeatState = "AVAILABLE" | "LOCKED" | "BOOKED";
export type WaitingRoomState = "QUEUED" | "ADMITTED" | "EXPIRED";
export type PaymentOutcome = "success" | "failure" | "timeout";

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: UserSummary;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EventSummary {
  id: string;
  title: string;
  genre: string;
  startsAt: string;
  endsAt?: string;
  city: string;
  description?: string;
  tags?: string[];
}

export interface InventorySeat {
  id: string;
  seatId: string;
  sectorId: string;
  row: string;
  number: number;
  accessible: boolean;
  state: SeatState;
  price: number;
  currency: string;
}

export interface EventDetail extends EventSummary {
  published: boolean;
  venue: { id: string; name: string; city: string; address: string };
  availability: number;
  inventory: InventorySeat[];
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface WaitingRoomEntry {
  id: string;
  eventId: string;
  position: number;
  state: WaitingRoomState;
  admissionToken?: string;
  tokenExpiresAt?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  state: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  expiresAt: string;
  totalAmount: number;
  currency: string;
}

export interface Payment {
  id: string;
  reservationId: string;
  state: "PENDING" | "SUCCESS" | "FAILED" | "TIMEOUT" | "CANCELLED";
  amount: number;
  currency: string;
  reference?: string;
}

export interface Ticket {
  id: string;
  reservationId: string;
  seatId: string;
  issuedAt: string;
  checkedInAt?: string;
}

export interface StoredTicket extends Ticket {
  qrDataUrl: string;
  eventTitle?: string;
  seatLabel?: string;
}

export interface EventAnalytics {
  reservations: number;
  confirmedReservations: number;
  bookedSeats: number;
  remainingSeats: number;
  capacity: number;
  revenue: number;
  currency: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
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
    const body = await response.json().catch(() => ({ message: "خطای ناشناخته" }));
    throw new ApiError(
      response.status,
      Array.isArray(body.message)
        ? body.message.join("، ")
        : body.message ?? body.detail ?? "درخواست ناموفق بود",
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function idempotencyKey(scope: string): string {
  const storageKey = `narm-idempotency-${scope}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const generated = `${scope}-${crypto.randomUUID()}`;
  sessionStorage.setItem(storageKey, generated);
  return generated;
}
