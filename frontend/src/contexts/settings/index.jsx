import { SettingsProvider } from "./SettingsContext";
import { PaymentMethodProvider } from "./PaymentMethodContext";

const SettingsContextWrapper = ({ children }) => {
    return (
        <SettingsProvider>
            <PaymentMethodProvider>
                {children}
            </PaymentMethodProvider>
        </SettingsProvider>
    )
}

export { SettingsContextWrapper };