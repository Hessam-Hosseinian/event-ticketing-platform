import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "./api";
interface Session {
  token: string;
  id: string;
  role: Role;
  email: string;
  name: string;
}
interface AuthContextValue {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null),
  storageKey = "narm-session";

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.token || !parsed.id || !parsed.email || !parsed.role) {
      localStorage.removeItem(storageKey);
      return null;
    }
    return { ...parsed, name: parsed.name ?? "" } as Session;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const value = useMemo(
    () => ({
      session,
      signIn(next: Session) {
        localStorage.setItem(storageKey, JSON.stringify(next));
        setSession(next);
      },
      signOut() {
        localStorage.removeItem(storageKey);
        setSession(null);
      },
    }),
    [session]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing");
  return context;
}
