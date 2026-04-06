import css from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={css.footer}>
      <div className="container">
        <p className={css.text}>
          Built with Next.js App Router for the GoIT NoteHub homework.
        </p>
      </div>
    </footer>
  );
}
