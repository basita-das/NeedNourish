import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  Search,
  PlusCircle,
  History,
  Utensils,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-green-600 font-bold text-2xl"
          >
            <Utensils /> <span>NeedNourish</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {user.role === "supplier" ? (
                  <>
                    <Link
                      to="/supplier-dashboard"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      to="/add-food"
                      className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <PlusCircle size={18} /> Post Food
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/explore"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                    >
                      <Search size={18} /> Find Food
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                    >
                      <History size={18} /> My Claims
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-600 font-medium pt-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
