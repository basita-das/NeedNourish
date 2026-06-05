import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Clock,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Ticket,
} from "lucide-react";

const FoodCard = ({ food, role, onClaim, onVerify }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");

  const isAvailable = food.status === "available";
  const isClaimed = food.status === "claimed";
  const isCompleted = food.status === "completed";

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border-t-4 border-t-green-500">
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
          {isAvailable
            ? t("food.status_available")
            : isCompleted
              ? t("food.status_completed")
              : t("food.status_claimed")}
        </span>
      </div>

      <div className="space-y-3 text-sm text-gray-500 mb-6 flex-grow">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-green-500" />
          <span className="capitalize">{t(`categories.${food.category}`)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-green-500" />
          <span>{new Date(food.expiry_time).toLocaleString()}</span>
        </div>
      </div>

      {/* --- FEATURE #2: THE VISIBLE CODE FOR RECEIVER --- */}
      {role === "needy" && isClaimed && (
        <div className="mt-4 p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl text-center animate-pulse">
          <div className="flex justify-center items-center gap-2 text-orange-600 mb-1">
            <Ticket size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {t("food.your_code")}
            </p>
          </div>
          <p className="text-4xl font-black text-orange-700 tracking-[0.5em] ml-2">
            {food.verification_code}
          </p>
          <p className="text-[9px] text-orange-500 mt-2 italic">
            Show this to the supplier to receive food
          </p>
        </div>
      )}

      {/* --- VERIFICATION INPUT FOR SUPPLIER --- */}
      {role === "supplier" && isClaimed && (
        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-2xl">
          <input
            type="text"
            placeholder="0000"
            maxLength="4"
            className="w-full p-2 border-2 rounded-xl text-center font-bold text-2xl focus:border-green-500 outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={() => onVerify(food.id, otp)}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex justify-center items-center gap-2 shadow-lg"
          >
            <ShieldCheck size={18} /> {t("food.verify_btn")}
          </button>
        </div>
      )}

      {/* Standard Claim Button for available items */}
      {role === "needy" && isAvailable && (
        <button
          onClick={() => onClaim(food.id)}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg"
        >
          {t("food.btn_claim")}
        </button>
      )}

      {isCompleted && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center gap-2 font-bold text-sm uppercase">
          <CheckCircle2 size={18} /> {t("food.status_completed")}
        </div>
      )}
    </div>
  );
};

export default FoodCard;
