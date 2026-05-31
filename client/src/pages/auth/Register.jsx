import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("suppliers");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    business_name: "",
    full_name: "",
    phone_number: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (role === "suppliers") delete payload.full_name;
      else delete payload.business_name;

      role === "suppliers"
        ? await authService.registerSupplier(payload)
        : await authService.registerNeedy(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setRole("suppliers")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${role === "suppliers" ? "bg-white shadow text-green-600" : "text-gray-500"}`}
          >
            Donor
          </button>
          <button
            onClick={() => setRole("needies")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${role === "needies" ? "bg-white shadow text-green-600" : "text-gray-500"}`}
          >
            Receiver
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            required
            placeholder={role === "suppliers" ? "Business Name" : "Full Name"}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) =>
              setFormData({
                ...formData,
                [role === "suppliers" ? "business_name" : "full_name"]:
                  e.target.value,
              })
            }
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
          <textarea
            placeholder="Address"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 h-24"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition mt-2">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
