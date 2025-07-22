import React from "react";

const FooterBottom = () => (
  <section className="flex flex-col sm:flex-row items-start sm:items-center text-gray-400 text-sm justify-between gap-2 sm:gap-0">
    <p>&copy; 2025 My Website. All rights reserved.</p>
    <p>
      <a href="#" className="mr-2">Privacy</a>
      <a href="#">Terms &amp; Conditions</a>
    </p>
    <p>
      Powered by <a href="https://www.google.com/" className="underline">Google</a>
    </p>
  </section>
);

export default FooterBottom;