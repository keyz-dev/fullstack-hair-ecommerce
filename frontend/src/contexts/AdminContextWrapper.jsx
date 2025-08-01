import { SettingsContextWrapper } from "./settings";

const AdminContextWrapper = ({ children }) => {
    return (
        <SettingsContextWrapper>
            {children}
        </SettingsContextWrapper>
    )
}

export default AdminContextWrapper;