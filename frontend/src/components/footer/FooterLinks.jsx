import React from "react";
import { Link } from "react-router-dom"; // or use <a> if not using react-router

const links = [
  { label: "Home", to: "#" },
  { label: "About", to: "#" },
  { label: "Services", to: "#" },
  { label: "Contact", to: "#" },
  { label: "Know More", to: "#" },
];

const FooterLinks = () => (
  <div className="flex gap-1">
    <ul className="grid grid-cols-3 sm:grid-cols-5 gap-8">
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