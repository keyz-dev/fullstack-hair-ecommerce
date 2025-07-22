import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./contexts";
import { AppRoutes } from "./routes/";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientID}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <ToastContainer />
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
