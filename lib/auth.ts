// Simple auth utilities
// In production, replace with proper authentication (JWT, sessions, etc.)

export type User = {
  id: string;
  username: string;
  role: "admin" | "user";
};

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // Change this in production!
};

export function login(username: string, password: string): boolean {
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const user: User = {
      id: "1",
      username: ADMIN_CREDENTIALS.username,
      role: "admin",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_auth", JSON.stringify(user));
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_auth");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const auth = localStorage.getItem("admin_auth");
  if (!auth) return null;
  try {
    return JSON.parse(auth) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
