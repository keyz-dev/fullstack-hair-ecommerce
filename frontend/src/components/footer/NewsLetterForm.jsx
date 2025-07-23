import React, { useState } from "react";
import { Button, Input } from '../ui'

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  // You can add your own submit logic here
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle newsletter signup
    setEmail("");
  };

  return (
    <form className="flex-2 w-full lg:w-auto" onSubmit={handleSubmit}>
      <div className="flex items-end gap-[10px] h-full w-full justify-start lg:justify-center">
        <div>
          <label htmlFor="newsletter" className="block">
            Join Our Newsletter
          </label>
          <Input
            type="email"
            id="newsletter"
            name="newsletter"
            placeholder="Newsletter"
            additionalClasses="border-slate-400 placeholder:text-base mt-2 min-h-[40px]"
            value={email}
            onChangeHandler={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          text={"Subscribe"}
          additionalClasses="primarybtn min-h-[40px] font-medium"
        />
      </div>
    </form>
  );
};

export default NewsletterForm;