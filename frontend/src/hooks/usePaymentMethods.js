import { useContext } from "react";
import { PaymentMethodContext } from "../contexts/settings/PaymentMethodContext";

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) throw new Error('usePaymentMethods must be used within a PaymentMethodProvider');
  return context;
};
