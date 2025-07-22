import React from "react";
import { Logo } from "../ui";
import { FooterLinks, NewsletterForm, FooterBottom } from "../footer";

const Footer = () => (
  <footer className="w-screen bg-primary opacity-95 text-white py-3">
    <div className="flex flex-col container mx-auto p-4 pt-0 md:p-0 gap-5 h-full">
      {/* Top Section */}
      <section className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between h-full">
        <div className="flex gap-[10px] flex-col">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <FooterLinks />
        </div>
        <hr className="w-full sm:hidden border border-gray-300" />
        <NewsletterForm />
      </section>
      <hr className="border border-gray-300" />
      <FooterBottom />
    </div>
  </footer>
);

export default Footer;