"use client";

import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getToken, removeToken, setToken, useCurrentUser } from "@/api/api";

export interface AuthStatus {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userId?: number;
}

export interface AuthContextValue {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
  login: (token: string, userId?: number) => void;
  logout: () => void;
}

const initialStatus: AuthStatus = {
  isInitialized: false,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextValue>({
  status: initialStatus,
  setStatus: () => {},
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  const login = (token: string, userId?: number) => {
    setToken(token);

    if (userId == null) {
      const id = validateToken(token);
      setStatus({
        isInitialized: true,
        isAuthenticated: id !== false,
        userId: id !== false ? id : undefined,
      });
    } else {
      setStatus({
        isInitialized: true,
        isAuthenticated: true,
        userId,
      });
    }
  };

  const logout = () => {
    removeToken();
    setStatus({ isInitialized: true, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ status, setStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = () => useContext(AuthContext);

export interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!status.isInitialized) {
      return;
    }

    if (!status.isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status.isAuthenticated, status.isInitialized]);

  if (!status.isInitialized || !status.isAuthenticated) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const { status } = useAuth();
  const { data: user } = useCurrentUser(status.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!status.isInitialized || !status.isAuthenticated || !user) {
      return;
    }

    if (!status.userId || !user || user.status !== "admin") {
      router.push("/books");
    }
  }, [router, status.isAuthenticated, status.isInitialized, status.userId, user]);

  if (
    !status.isInitialized ||
    !status.isAuthenticated ||
    !status.userId ||
    !user ||
    user.status !== "admin"
  ) {
    return null;
  }

  return <>{children}</>;
};

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const { status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!status.isInitialized) {
      return;
    }

    if (status.isAuthenticated) {
      const returnUrl = params.get("returnUrl") || "/books";
      router.push(returnUrl);
    }
  }, [params, router, status.isAuthenticated, status.isInitialized]);

  if (!status.isInitialized || status.isAuthenticated) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // not authenticated / authorized.

  return <>{children}</>;
};

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

const validateToken = (token: string): number | false => {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  try {
    const payload: TokenPayload = JSON.parse(atob(parts[1]));

    if (!payload) {
      return false;
    }

    const exp = Number(payload.exp);

    if (!exp || exp <= 0) {
      return false;
    }

    const now = DateTime.now().toUnixInteger();

    if (now >= exp) {
      return false;
    }

    return payload.id;
  } catch (error) {
    return false;
  }
};

interface InitGuardProps {
  children: ReactNode;
}

export const InitGuard: FC<InitGuardProps> = ({ children }) => {
  const { status, login, logout } = useAuth();

  useEffect(() => {
    if (status.isInitialized) {
      return;
    }

    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    const userId = validateToken(token);

    if (userId === false) {
      logout();
      return;
    }

    login(token, userId);
  }, [login, logout, status.isInitialized]);

  if (!status.isInitialized) {
    return null;
  }

  return <>{children}</>;
};
