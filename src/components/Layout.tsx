import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}