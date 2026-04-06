"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import css from "./AuthProvider.module.css";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

const PRIVATE_ROUTES = ["/profile", "/notes"];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    async function syncAuthState() {
      setIsChecking(true);

      try {
        const session = await checkSession();

        if (!session.success) {
          throw new Error("No active session");
        }

        const user = await getMe();

        if (!isMounted) {
          return;
        }

        setUser(user);
      } catch {
        if (!isMounted) {
          return;
        }

        clearIsAuthenticated();

        const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
          pathname.startsWith(route),
        );

        if (isPrivateRoute) {
          try {
            await logout();
          } catch {
            // Ignore logout failures when the session is already invalid.
          }

          router.replace("/sign-in");
          return;
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    void syncAuthState();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPrivateRoute && (isChecking || !isAuthenticated)) {
    return (
      <div className={css.overlay}>
        <div className={css.loader}>Checking your session...</div>
      </div>
    );
  }

  return children;
}
