import { SettingsProvider } from "./SettingsContext";
import { CurrencyProvider } from "./CurrencyContext";
import { PaymentMethodProvider } from "./PaymentMethodContext";

const SettingsContextWrapper = ({ children }) => {
    return (
        <SettingsProvider>
            <CurrencyProvider>
                <PaymentMethodProvider>
                    {children}
                </PaymentMethodProvider>
            </CurrencyProvider>
        </SettingsProvider>
    )
}

export { SettingsContextWrapper };