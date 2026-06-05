import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Pencil,
  Trash2,
  Info,
} from "lucide-react";

const FoodCard = ({ food, role, onClaim, onVerify, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const isAvailable = food.status === "available";
  const isClaimed = food.status === "claimed";
  const isCompleted = food.status === "completed";

  // Determine the translated status text based on role
  const getStatusText = () => {
    if (isAvailable) return t("food.status_available");
    if (isClaimed) return t("food.status_claimed");
    if (isCompleted) {
      // If Supplier (Donor), show "Handed Over"
      // If Needy (Receiver), show "Received"
      return role === "supplier"
        ? t("food.status_completed")
        : t("food.status_received");
    }
    return "";
  };

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border-t-4 border-t-green-500">
      {/* 1. Header: Title and Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-gray-800 leading-tight">
          {food.title}
        </h3>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : isCompleted
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
          }`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* 2. Description Section */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2 italic">
        {food.description || t("food.ph_desc")}
      </p>

      {/* 3. Details Section (Category & Expiry) */}
      <div className="space-y-3 text-sm text-gray-500 mb-6 flex-grow border-t pt-4">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-green-500" />
          <span className="font-semibold text-gray-700">
            {t("food.label_cat")}:
          </span>
          <span className="capitalize">{t(`categories.${food.category}`)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          <span className="font-semibold text-gray-700">
            {t("food.label_expiry")}:
          </span>
          <span>{new Date(food.expiry_time).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-green-500" />
          <span className="font-semibold text-gray-700">
            {t("food.btn_location")}:
          </span>
          <span>
            {food.latitude.toFixed(2)}, {food.longitude.toFixed(2)}
          </span>
        </div>
      </div>

      {/* --- CONDITIONAL ACTIONS SECTION --- */}

      {/* A. SUPPLIER ACTIONS: EDIT & DELETE (Only if item is Available) */}
      {role === "supplier" && isAvailable && (
        <div className="mt-4 flex gap-2 border-t pt-4">
          <button
            onClick={() => navigate(`/edit-food/${food.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 hover:text-green-600 font-bold transition-all border border-gray-100 shadow-sm"
          >
            <Pencil size={16} /> {t("food.btn_edit")}
          </button>
          <button
            onClick={() => {
              if (window.confirm(t("food.confirm_delete"))) {
                onDelete(food.id);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold transition-all border border-red-100 shadow-sm"
          >
            <Trash2 size={16} /> {t("food.btn_delete")}
          </button>
        </div>
      )}

      {/* B. RECEIVER VIEW: DISPLAY PICKUP CODE (Only if item is Claimed) */}
      {role === "needy" && isClaimed && (
        <div className="mt-4 p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl text-center">
          <div className="flex justify-center items-center gap-2 text-orange-600 mb-1">
            <Ticket size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {t("food.your_code")}
            </p>
          </div>
          <p className="text-4xl font-black text-orange-700 tracking-[0.5em] ml-2">
            {food.verification_code}
          </p>
        </div>
      )}

      {/* C. SUPPLIER VIEW: VERIFICATION INPUT (Only if item is Claimed) */}
      {role === "supplier" && isClaimed && (
        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
          <input
            type="text"
            placeholder="0000"
            maxLength="4"
            className="w-full p-2 border-2 rounded-xl text-center font-bold text-2xl focus:border-green-500 outline-none transition-all shadow-sm"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={() => onVerify(food.id, otp)}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-lg shadow-orange-100"
          >
            <ShieldCheck size={18} /> {t("food.verify_btn")}
          </button>
        </div>
      )}

      {/* D. RECEIVER VIEW: CLAIM BUTTON (Only if item is Available) */}
      {role === "needy" && isAvailable && (
        <button
          onClick={() => onClaim(food.id)}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-100"
        >
          {t("food.btn_claim")}
        </button>
      )}

      {/* E. ANY USER: COMPLETED STATUS VIEW */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase border border-blue-100">
          <CheckCircle2 size={20} />
          {role === "supplier"
            ? t("food.status_completed")
            : t("food.status_received")}
        </div>
      )}
    </div>
  );
};

export default FoodCard;
