import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  LayoutDashboard,
  Search,
  PlusCircle,
  History,
  Utensils,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO SECTION - Hardcoded as requested */}
          <Link
            to="/"
            className="flex items-center gap-2 text-green-600 font-bold text-2xl"
          >
            <Utensils /> <span>NeedNourish</span>
          </Link>

          {/* RIGHT SIDE SECTION */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Language Selector Button */}
            <LanguageSelector />

            {/* NAVIGATION LINKS */}
            {isAuthenticated ? (
              <>
                {user.role === "supplier" ? (
                  <>
                    <Link
                      to="/supplier-dashboard"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600 hidden md:flex"
                    >
                      <LayoutDashboard size={18} /> {t("nav.dashboard")}
                    </Link>
                    <Link
                      to="/add-food"
                      className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <PlusCircle size={18} /> {t("nav.post")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/explore"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                    >
                      <Search size={18} /> {t("nav.find")}
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center gap-1 text-gray-600 hover:text-green-600 hidden md:flex"
                    >
                      <History size={18} /> {t("nav.claims")}
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={18} /> {t("nav.logout")}
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-600 font-medium pt-2">
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {t("nav.join")}
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
