"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import css from "./EditProfilePage.module.css";
import { getErrorMessage, getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState(storeUser?.username ?? "");
  const [error, setError] = useState("");

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    initialData: storeUser ?? undefined,
  });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      setUser(user);
      startTransition(() => {
        router.replace("/profile");
        router.refresh();
      });
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    updateMutation.mutate({ username: currentUsername });
  }

  if (userQuery.isLoading && !userQuery.data) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>Loading profile...</div>
      </main>
    );
  }

  const user = userQuery.data;
  const currentUsername = username || user?.username || "";

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={currentUsername}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>
          {error ? <p>{error}</p> : null}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
