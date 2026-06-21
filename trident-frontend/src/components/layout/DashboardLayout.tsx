import { Sidebar } from "../Sidebar";

type DashboardLayoutProps = {
  children?: JSX.Element | JSX.Element[];
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
