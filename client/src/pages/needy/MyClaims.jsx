import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { needyService } from "../../services/needyService";
import FoodCard from "../../components/food/FoodCard";
import { Inbox, LayoutDashboard } from "lucide-react";

const MyClaims = () => {
  const { t } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    needyService.getHistory().then((data) => {
      setClaims(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-green-600">
        {t("nav.claims")}...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {t("food.history_title")}
        </h1>
        <p className="text-gray-500 font-medium">
          {t("food.history_subtitle")}
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed p-20 text-center shadow-sm">
          <Inbox size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">{t("food.no_history")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {claims.map((item) => (
            <FoodCard
              key={item.id}
              food={item}
              role="needy" // <--- CRITICAL: Tells the card to show the code
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
