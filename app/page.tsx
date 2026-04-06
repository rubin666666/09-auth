import Link from "next/link";
import css from "./page.module.css";

export default function HomePage() {
  return (
    <main className={css.hero}>
      <div className="container">
        <section className={css.panel}>
          <p className={css.eyebrow}>Next.js App Router Homework</p>
          <h1 className={css.title}>
            NoteHub with protected auth and cookie sessions.
          </h1>
          <p className={css.text}>
            Register, sign in, manage your profile, and access your private
            notes area through secure routes powered by Next.js, axios, Zustand,
            and TanStack Query.
          </p>
          <div className={css.actions}>
            <Link href="/sign-up" prefetch={false} className={css.primaryLink}>
              Create account
            </Link>
            <Link href="/notes" prefetch={false} className={css.secondaryLink}>
              Open notes
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
