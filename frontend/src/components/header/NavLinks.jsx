import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/#categories", label: "Categories" },
  { to: "/#products", label: "Products" },
  { to: "/#guarantee", label: "Guarantee" },
];

const NavLinks = () => {
  const location = useLocation();
  return (
    <ul className="flex flex-row gap-6 items-center h-full space-x-5 mb-0">
      {links.map((link) => (
        <li key={link.label} className="list-none m-0 p-1 ml-5 dark:text-white">
          <Link
            to={link.to}
            className={`relative overflow-hidden transition-colors ${
              location.pathname === link.to
                ? "text-accent"
                : "hover:text-accent"
            }`}
          >
            {link.label}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 w-full bg-accent transition-transform duration-200 ${
                location.pathname === link.to
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }`}
              style={{ transformOrigin: "left" }}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;