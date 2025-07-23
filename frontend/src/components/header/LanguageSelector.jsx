import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useIsMobile } from "../../hooks";

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const languageRef = useRef(null)
  const isMobile = useIsMobile();

  useEffect(()=>{ 
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  return (
    <div className="relative" ref={languageRef}>
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-100 dark:hover:bg-gray-800 dark:text-white"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={isMobile ? 16 : 18} />
        {isMobile && <span className="capitalize">{lang}</span>}
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-900 border border-line_clr rounded shadow-sm z-20">
          <li>
            <button
              className="w-full text-left px-3 py-2 hover:bg-yellow-100 dark:hover:bg-gray-800 dark:text-white"
              onClick={() => {
                setLang("EN");
                setOpen(false);
              }}
            >
              English
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-3 py-2 hover:bg-yellow-100 dark:hover:bg-gray-800 dark:text-white"
              onClick={() => {
                setLang("FR");
                setOpen(false);
              }}
            >
              French
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;