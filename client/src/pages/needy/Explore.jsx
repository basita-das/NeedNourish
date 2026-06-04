import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import FoodCard from "../../components/food/FoodCard";
import { Search, MapPin } from "lucide-react";

const Explore = () => {
  const { t } = useTranslation();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    if (coords) {
      foodService.getNearby(coords.lat, coords.lon).then((data) => {
        setFoods(data);
        setLoading(false);
      });
    }
  }, [coords]);

  const handleClaim = async (id) => {
    try {
      await foodService.claimFood(id);
      alert(t("food.status_claimed"));
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("food.nearby_title")}
        </h1>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin size={14} /> {t("food.detecting")}...
        </p>
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
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
