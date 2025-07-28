import { SettingsContextWrapper } from "./settings";
import { BaseDashboardProvider } from "./BaseDashboardContext";

const AdminContextWrapper = ({ children }) => {
    return (
        <BaseDashboardProvider>
            <SettingsContextWrapper>
                {children}
            </SettingsContextWrapper>
        </BaseDashboardProvider>
    )
}

export default AdminContextWrapper;