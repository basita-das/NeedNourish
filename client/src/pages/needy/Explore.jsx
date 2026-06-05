import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import FoodCard from "../../components/food/FoodCard";
import { Search, MapPin } from "lucide-react";
import { toast } from "react-toastify"; // Added Import

const Explore = () => {
  const { t } = useTranslation();
  const [foods, setFoods] = useState([]);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    if (coords) {
      foodService.getNearby(coords.lat, coords.lon).then(setFoods);
    }
  }, [coords]);

  const handleClaim = async (id) => {
    try {
      await foodService.claimFood(id);

      // SUCCESS TOAST
      toast.success(t("notify.claim_success"));

      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      toast.error(t("notify.error"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {t("food.nearby_title")}
      </h1>
      <p className="text-gray-500 text-sm flex items-center gap-1 mb-8">
        <MapPin size={14} /> {t("food.detecting")}
      </p>

      {foods.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">{t("food.no_food")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foods.map((item) => (
            <FoodCard
              key={item.id}
              food={item}
              role="needy"
              onClaim={handleClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
