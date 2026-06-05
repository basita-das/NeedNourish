import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify"; // Added Import

const Register = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState("suppliers");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    business_name: "",
    full_name: "",
    phone_number: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      role === "suppliers"
        ? delete payload.full_name
        : delete payload.business_name;
      role === "suppliers"
        ? await authService.registerSupplier(payload)
        : await authService.registerNeedy(payload);

      // SUCCESS TOAST
      toast.success(t("notify.register_success"));
      navigate("/login");
    } catch (err) {
      // ERROR TOAST
      toast.error(t("notify.error"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t("auth.register_title")}
        </h2>
        <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setRole("suppliers")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${role === "suppliers" ? "bg-white shadow text-green-600" : "text-gray-500"}`}
          >
            {t("auth.donor")}
          </button>
          <button
            onClick={() => setRole("needies")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${role === "needies" ? "bg-white shadow text-green-600" : "text-gray-500"}`}
          >
            {t("auth.receiver")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            required
            placeholder={
              role === "suppliers" ? t("auth.biz_ph") : t("auth.name_ph")
            }
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
            placeholder={t("auth.email_ph")}
            required
            className="w-full p-3 border rounded-xl outline-none"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder={t("auth.pass_ph")}
            required
            className="w-full p-3 border rounded-xl outline-none"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder={t("auth.phone_ph")}
            className="w-full p-3 border rounded-xl outline-none"
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
          <textarea
            placeholder={t("auth.addr_ph")}
            className="w-full p-3 border rounded-xl outline-none h-24"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
            {t("auth.register_btn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
