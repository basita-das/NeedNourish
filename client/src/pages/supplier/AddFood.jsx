import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import { FoodCategory } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Utensils, AlignLeft } from "lucide-react";

const AddFood = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: FoodCategory.OTHER,
    expiry_time: "",
    latitude: null,
    longitude: null,
  });

  const getLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation error");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude) return;
    setLoading(true);
    try {
      await foodService.createListing({
        ...formData,
        expiry_time: new Date(formData.expiry_time).toISOString(),
      });
      navigate("/supplier-dashboard");
    } catch (err) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("food.add_title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Utensils size={18} /> {t("food.label_title")}
            </label>
            <input
              type="text"
              placeholder={t("food.ph_title")}
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("food.label_cat")}
              </label>
              <select
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {Object.values(FoodCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock size={18} /> {t("food.label_expiry")}
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setFormData({ ...formData, expiry_time: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="w-full text-sm border border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50 transition-all flex justify-center items-center gap-2"
          >
            <MapPin size={18} />{" "}
            {locationLoading ? t("food.detecting") : t("food.btn_location")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            {loading ? t("food.posting") : t("food.btn_submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
