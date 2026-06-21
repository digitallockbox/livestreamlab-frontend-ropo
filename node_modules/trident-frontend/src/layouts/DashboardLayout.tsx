import { Sidebar } from "../components/Sidebar";

type DashboardLayoutProps = {
  children?: JSX.Element | JSX.Element[];
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05080b",
        color: "#f3f4f6",
        display: "flex",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background:
            "radial-gradient(circle at top right, #1a1d3a 0%, #0b1114 30%, #05080b 100%)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
