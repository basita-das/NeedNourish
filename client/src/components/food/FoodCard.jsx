import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Tag } from "lucide-react";

const FoodCard = ({ food, role, onClaim }) => {
  const { t } = useTranslation();
  const isAvailable = food.status === "available";

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{food.title}</h3>

        {/* Status Badge */}
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isAvailable ? t("food.status_available") : t("food.status_claimed")}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {food.description || t("food.ph_desc")}
      </p>

      {/* Details Section */}
      <div className="space-y-2 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-green-500" />
          <span className="font-medium">{t("food.label_cat")}:</span>
          <span className="capitalize">{t(`categories.${food.category}`)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          <span className="font-medium">{t("food.label_expiry")}:</span>
          <span>{new Date(food.expiry_time).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-green-500" />
          <span className="font-medium">{t("food.btn_location")}:</span>
          <span>
            {food.latitude.toFixed(2)}, {food.longitude.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Button for Needy Users */}
      {role === "needy" && isAvailable && (
        <button
          onClick={() => onClaim(food.id)}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 active:scale-[0.98] transition-all"
        >
          {t("food.btn_claim")}
        </button>
      )}
    </div>
  );
};

export default FoodCard;
