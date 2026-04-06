export default function Loading() {
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
          padding: "16px 24px",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          fontWeight: 700,
        }}
      >
        Loading...
      </div>
    </main>
  );
}
