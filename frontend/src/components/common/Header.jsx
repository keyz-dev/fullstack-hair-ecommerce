import React, { useState } from "react";
import { NavLinks, CartButton, ProfileInfo, LanguageSelector, ThemeSelector, MobileMenu } from "../header";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui";
import { useAuth } from "../../hooks";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="w-full flex flex-col fixed left-0 top-0 z-20">
      <nav className="container flex items-center justify-between py-5 px-3 lg:px-2 relative z-20 bg-white dark:bg-primary">
        <button
          type="button"
          className="text-xl lg:hidden z-10 min-w-fit min-h-fit dark:text-white"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="flex-1 grid place-items-center lg:place-items-start">
          <Logo size={110} />
        </div>
        <div className="hidden lg:flex items-center gap-6 justify-between flex-1/2">
          <NavLinks />
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeSelector />
            <CartButton />
            <ProfileInfo user={user} />
          </div>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <CartButton />
        </div>
      </nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
      />
    </header>
  );
};

export default Header;