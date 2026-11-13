import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AmbientBackground from "./components/layout/AmbientBackground";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AmbientBackground />
        <Toaster position="top-center" toastOptions={{
          style: { background: "#0a0a0c", color: "#EDEDEF", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "14px" },
          duration: 3000,
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
