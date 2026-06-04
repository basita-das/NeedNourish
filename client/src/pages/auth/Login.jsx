import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("suppliers");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authService.login(email, password, role);
      login(data.access_token);
      navigate(role === "suppliers" ? "/supplier-dashboard" : "/explore");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t("auth.welcome")}
        </h2>
        <p className="text-center text-gray-500 mb-8">{t("auth.subtitle")}</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.role_label")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="suppliers">{t("auth.donor")}</option>
              <option value="needies">{t("auth.receiver")}</option>
            </select>
          </div>

          <input
            type="email"
            placeholder={t("auth.email_ph")}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("auth.pass_ph")}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition duration-200">
            {t("auth.signin")}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {t("auth.no_account")}{" "}
          <Link to="/register" className="text-green-600 font-bold">
            {t("auth.register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
