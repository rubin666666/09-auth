import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        padding: "48px 16px",
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Page not found</h1>
        <p style={{ margin: "12px 0 0", color: "var(--text-muted)" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            marginTop: "20px",
            padding: "12px 18px",
            borderRadius: "999px",
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
