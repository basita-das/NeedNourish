import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useAuth } from "./context/AuthContext";

// Components
import Dashboard from "./pages/supplier/Dashboard";
import AddFood from "./pages/supplier/AddFood";
import EditFood from "./pages/supplier/EditFood";
import Explore from "./pages/needy/Explore";
import MyClaims from "./pages/needy/MyClaims";
import ChatRoom from "./pages/chat/ChatRoom"; // 1. Added ChatRoom import
import Inbox from "./pages/chat/Inbox";

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-green-600 text-xl text-center">
        {/* Note: In a professional app, you'd use t('food.detecting') here */}
        Loading...
      </div>
    );

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />

        {/* Protected Supplier (Donor) Routes */}
        <Route
          path="/supplier-dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-food"
          element={isAuthenticated ? <AddFood /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-food/:id"
          element={isAuthenticated ? <EditFood /> : <Navigate to="/login" />}
        />

        {/* Protected Needy (Receiver) Routes */}
        <Route
          path="/explore"
          element={isAuthenticated ? <Explore /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isAuthenticated ? <MyClaims /> : <Navigate to="/login" />}
        />

        {/* 2. SHARED PROTECTED ROUTE: Encrypted Real-time Chat */}
        <Route
          path="/chat/:foodId"
          element={isAuthenticated ? <ChatRoom /> : <Navigate to="/login" />}
        />

        {/* Smart Home Redirection Logic */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "supplier" ? (
                <Navigate to="/supplier-dashboard" />
              ) : (
                <Navigate to="/explore" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/inbox"
          element={isAuthenticated ? <Inbox /> : <Navigate to="/login" />}
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
