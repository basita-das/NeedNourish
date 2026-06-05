import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import FoodCard from "../../components/food/FoodCard";
import FoodMap from "../../components/food/FoodMap";
import {
  Search,
  MapPin,
  Map as MapIcon,
  LayoutList,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const Explore = () => {
  const { t } = useTranslation();
  const [foods, setFoods] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

  // 1. Get User Location on Mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (error) => {
        toast.error("Location access denied. Please enable GPS.");
        setLoading(false);
      },
    );
  }, []);

  // 2. Fetch Nearby Food when coordinates are ready
  useEffect(() => {
    if (coords) {
      foodService
        .getNearby(coords.lat, coords.lon)
        .then((data) => {
          setFoods(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error(t("notify.error"));
          setLoading(false);
        });
    }
  }, [coords, t]);

  // 3. Handle Claim Action
  const handleClaim = async (id) => {
    try {
      await foodService.claimFood(id);
      toast.success(t("notify.claim_success"));
      // Remove from the local list instantly
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      toast.error(t("notify.error"));
    }
  };

  if (loading && !coords) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-green-600 font-bold">
        <Loader2 className="animate-spin w-10 h-10" />
        <p>{t("food.detecting")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {t("food.nearby_title")}
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-1 font-medium mt-1">
            <MapPin size={14} className="text-green-500" />
            {t("food.detecting")} (5km)
          </p>
        </div>

        {/* VIEW TOGGLE SWITCH */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner self-start md:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === "list"
                ? "bg-white shadow-md text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutList size={18} />
            <span>{t("nav.find")}</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === "map"
                ? "bg-white shadow-md text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MapIcon size={18} />
            <span>{t("map.title")}</span>
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      {foods.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm animate-in fade-in duration-700">
          <Search size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-xl">{t("food.no_food")}</p>
        </div>
      ) : (
        <>
          {/* MAP VIEW */}
          {viewMode === "map" && coords && (
            <div className="animate-in fade-in zoom-in duration-500 overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
              <FoodMap foods={foods} userCoords={coords} />
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </>
      )}
    </div>
  );
};

export default Explore;
