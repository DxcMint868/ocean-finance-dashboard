"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 72, margin: 0, color: "#ff4d4f" }}>500</h1>
      <p style={{ color: "#8c8c8c", marginTop: 8 }}>Something went wrong</p>
      <button
        onClick={reset}
        style={{
          marginTop: 16,
          padding: "8px 24px",
          background: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
