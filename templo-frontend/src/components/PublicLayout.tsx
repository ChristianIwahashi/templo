import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <PublicNavbar />
      {/*Renderização das páginas*/}
      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}