import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { foodService } from "../../services/foodService";
import { FoodCategory } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Utensils,
  AlignLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

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
      (position) => {
        // Update state with coordinates
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationLoading(false);
        toast.success(t("food.btn_location")); // Show success when GPS is locked
      },
      (error) => {
        toast.error("Location permission denied. Please enable GPS.");
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verification: Ensure coordinates exist
    if (formData.latitude === null || formData.longitude === null) {
      toast.warning(t("food.detecting"));
      return;
    }

    setLoading(true);
    try {
      // Logic: Default description if empty
      const finalDescription =
        formData.description.trim() === ""
          ? t("food.no_desc_default")
          : formData.description;

      const payload = {
        title: formData.title,
        description: finalDescription,
        category: formData.category,
        expiry_time: new Date(formData.expiry_time).toISOString(),
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      await foodService.createListing(payload);
      toast.success(t("notify.post_success"));
      navigate("/supplier-dashboard");
    } catch (err) {
      console.error("Post error:", err);
      toast.error(t("notify.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          {t("food.add_title")}
        </h1>
        <p className="text-gray-500 mb-8 font-medium border-l-4 border-green-500 pl-3">
          Post surplus food to help someone in need
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Utensils size={18} className="text-green-600" />{" "}
              {t("food.label_title")}
            </label>
            <input
              type="text"
              placeholder={t("food.ph_title")}
              required
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                {t("food.label_cat")}
              </label>
              <select
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium"
                value={formData.category}
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

            {/* Expiry */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Clock size={18} className="text-green-600" />{" "}
                {t("food.label_expiry")}
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, expiry_time: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <AlignLeft size={18} className="text-green-600" />{" "}
              {t("food.label_desc")}
            </label>
            <textarea
              placeholder={t("food.ph_desc")}
              rows="3"
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* GPS Button */}
          <div className="relative">
            <button
              type="button"
              onClick={getLocation}
              className={`w-full py-4 border-2 border-dashed rounded-2xl transition-all flex justify-center items-center gap-3 font-bold ${
                formData.latitude
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 text-gray-500 hover:border-green-600 hover:text-green-600"
              }`}
            >
              {locationLoading ? (
                <Loader2 className="animate-spin" />
              ) : formData.latitude ? (
                <CheckCircle size={20} />
              ) : (
                <MapPin size={20} />
              )}
              {locationLoading
                ? t("food.detecting")
                : formData.latitude
                  ? "Location Locked"
                  : t("food.btn_location")}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all flex justify-center items-center gap-2 shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
            }`}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? t("food.posting") : t("food.btn_submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
