"use client";

import Link from "next/link";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import css from "./AuthNavigation.module.css";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthNavigation() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearIsAuthenticated();
      startTransition(() => {
        router.push("/sign-in");
        router.refresh();
      });
    },
  });

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email ?? "Signed in"}</p>
          <button
            type="button"
            className={css.logoutButton}
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
