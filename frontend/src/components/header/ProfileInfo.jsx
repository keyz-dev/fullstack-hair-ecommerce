import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const ProfileInfo = () => {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full border"
          />
        )}
        <span className="text-sm font-medium">{user.name || user.email}</span>
        <button
          onClick={logout}
          className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs"
        >
          Logout
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <a href="/login">
        <button className="bg-transparent text-black dark:text-white min-w-fit hover:bg-yellow-100 dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1">
          Login
        </button>
      </a>
      <hr class="w-0 md:w-[2px] md:h-8 border-none bg-slate-200 dark:bg-accent"></hr>
      <a href="/register">
        <button className="bg-transparent text-black dark:text-white min-w-fit hover:bg-yellow-100 dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1">
          Join Us
        </button>
      </a>
    </div>
  );
};

export default ProfileInfo;