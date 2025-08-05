import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ToastMessage = ({ message, type, onClose }) => {
  if (!message) return null; // Don't render if no message

  return (
    <AnimatePresence>
      {/* Render the toast message with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className={`w-full px-4 py-3 text-center relative shadow-xs  ${
          type === "success"
            ? "bg-success-bg text-success"
            : "bg-error-bg text-error"
        }`}
      >
        {message}
        <button
          className="absolute right-2 cursor-pointer ml-2 text-lg"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToastMessage;
