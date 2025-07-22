import React from "react";

const ContactCard = ({ icon, title, value }) => {
  return (
    <div className="p-5 shadow-sm default_transition hover:shadow-xs hover:bg-accent group flex flex-col items-center gap-3">
      <span className="rounded-full size-[60px] border group-hover:border-secondary-bg group-hover:text-white border-accent text-accent text-2xl default_transition inline-flex justify-center items-center">
        <i className={icon}></i>
      </span>
      <h2 className="text-2xl text-center text-secondary font-extrabold font-custom group-hover:text-secondary-bg default_transition">
        {title}
      </h2>
      <p className="text-center text-accent-bg text-sm group-hover:text-secondary-bg default_transition">
        {value}
      </p>
    </div>
  );
};

export default ContactCard;
