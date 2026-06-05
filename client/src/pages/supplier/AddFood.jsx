import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import { FoodCategory } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Utensils } from "lucide-react";
import { toast } from "react-toastify"; // Added Import

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
      toast.error(t("notify.error"));
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationLoading(false);
        toast.info(t("food.btn_location")); // Helpful Toast
      },
      () => setLocationLoading(false),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude) {
      toast.warning(t("food.detecting")); // Warning Toast if no location
      return;
    }
    setLoading(true);
    try {
      await foodService.createListing({
        ...formData,
        expiry_time: new Date(formData.expiry_time).toISOString(),
      });

      // SUCCESS TOAST
      toast.success(t("notify.post_success"));
      navigate("/supplier-dashboard");
    } catch (err) {
      toast.error(t("notify.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("food.add_title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder={t("food.ph_title")}
            required
            className="w-full p-3 border rounded-xl outline-none"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="w-full p-3 border rounded-xl outline-none"
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
            <input
              type="datetime-local"
              required
              className="w-full p-3 border rounded-xl outline-none"
              onChange={(e) =>
                setFormData({ ...formData, expiry_time: e.target.value })
              }
            />
          </div>
          <button
            type="button"
            onClick={getLocation}
            className="w-full border border-green-600 text-green-600 py-3 rounded-xl flex justify-center items-center gap-2"
          >
            <MapPin size={18} />{" "}
            {locationLoading ? t("food.detecting") : t("food.btn_location")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
          >
            {loading ? t("food.posting") : t("food.btn_submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
