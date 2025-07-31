import { useContext } from "react";
import { PublicPaymentMethodContext } from "../contexts/PublicPaymentMethodContext";

export const usePublicPaymentMethods = () => {
  const context = useContext(PublicPaymentMethodContext);
  if (!context) {
    throw new Error("usePublicPaymentMethods must be used within a PublicPaymentMethodProvider");
  }
  return context;
}; 