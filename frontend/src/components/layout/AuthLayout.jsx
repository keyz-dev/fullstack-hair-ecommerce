import { Outlet } from "react-router-dom";
import { Logo } from "../ui/";
import { LanguageSelector, ThemeSelector } from "../header";

const AuthLayout = ({ destination = "/" }) => {
  return (
    <section className="min-h-screen flex flex-col dark:bg-primary">
      <header className="sticky top-0 z-50 w-full border-b border-line_clr dark:border-primary min-h-[70px] bg-white dark:bg-primary flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className=" flex-1 flex h-16 items-center justify-between">
            <Logo destination={destination} size={110} />
          </div>
          <div className="hidden lg:flex items-center gap-6 justify-between">
            <LanguageSelector />
            <ThemeSelector />
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </section>
  );
};

export default AuthLayout;
