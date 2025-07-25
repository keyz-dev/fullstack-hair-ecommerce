import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navBarItems } from "../../constants/data";

const NavLinks = ({ mobile = false }) => {
  const location = useLocation();
  return (
    <ul className={`w-full flex gap-6 ${mobile ? "flex-col items-start" : "flex-row items-center h-full space-x-5 mb-0"}`}>
      {navBarItems.map((link) => (
        <li key={link.title} className={`list-none m-0 p-1 ${mobile ? '': 'ml-5'} dark:text-white`}>
          <Link
            to={link.path}
            className={`relative overflow-hidden transition-colors ${
              location.pathname === link.path
                ? "text-accent"
                : "hover:text-accent"
            }`}
          >
            {link.title}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 w-full bg-accent transition-transform duration-200 ${
                location.pathname === link.path
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