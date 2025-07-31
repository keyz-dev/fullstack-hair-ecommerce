import React from "react";
import { Link } from "react-router-dom"; // or use <a> if not using react-router

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Track Order", to: "/track-order" },
  { label: "Contact", to: "#" },
];

const FooterLinks = () => (
  <div className="flex gap-1">
    <ul className="grid grid-cols-3 lg:grid-cols-5 gap-8">
      {links.map((link) => (
        <li key={link.label}>
          <Link className="whitespace-nowrap" to={link.to}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterLinks;