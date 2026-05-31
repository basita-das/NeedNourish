import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
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
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to continue your impact
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logging in as:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="suppliers">Supplier (Donor)</option>
              <option value="needies">Needy (Receiver)</option>
            </select>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition duration-200">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-bold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
