import Link from "next/link";

export default function NotFound() {
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
      <h1 style={{ fontSize: 72, margin: 0, color: "#1677ff" }}>404</h1>
      <p style={{ color: "#8c8c8c", marginTop: 8 }}>Page not found</p>
      <Link href="/" style={{ marginTop: 16, color: "#1677ff" }}>
        Go home
      </Link>
    </div>
  );
}
