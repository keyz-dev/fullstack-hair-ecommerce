import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./contexts/AppContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientID}>
      <Router>
        <CurrencyProvider>
          <AppContext>
            <ToastContainer />
            <AppRoutes />
          </AppContext>
        </CurrencyProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
