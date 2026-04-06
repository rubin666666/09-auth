import Link from "next/link";
import { AuthNavigation } from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

export function Header() {
  return (
    <header className={css.header}>
      <div className={`container ${css.inner}`}>
        <Link href="/" className={css.brand}>
          NoteHub
        </Link>
        <nav aria-label="Main navigation">
          <ul className={css.navList}>
            <li className={css.navigationItem}>
              <Link href="/" className={css.navigationLink}>
                Home
              </Link>
            </li>
            <li className={css.navigationItem}>
              <Link
                href="/notes"
                prefetch={false}
                className={css.navigationLink}
              >
                Notes
              </Link>
            </li>
            <AuthNavigation />
          </ul>
        </nav>
      </div>
    </header>
  );
}
