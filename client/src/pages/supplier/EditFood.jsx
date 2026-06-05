import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { foodService } from "../../services/foodService";
import { FoodCategory } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Utensils, Clock, Tag, AlignLeft, Save, Loader2 } from "lucide-react";

const EditFood = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    expiry_time: "",
  });

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const data = await foodService.getFoodDetail(id);

        // Format the date to "YYYY-MM-DDTHH:mm" for the HTML input
        const date = new Date(data.expiry_time);
        const formattedDate = date.toISOString().slice(0, 16);

        setFormData({
          title: data.title,
          description: data.description || "",
          category: data.category,
          expiry_time: formattedDate,
        });
      } catch (err) {
        toast.error(t("notify.error"));
        navigate("/supplier-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id, navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Ensure date is sent back as ISO string
      const payload = {
        ...formData,
        expiry_time: new Date(formData.expiry_time).toISOString(),
      };

      await foodService.updateListing(id, payload);
      toast.success(t("notify.edit_success"));
      navigate("/supplier-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || t("notify.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-gray-500 font-medium">{t("food.detecting")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          {t("food.edit_title")}
        </h1>
        <p className="text-gray-500 mb-8 font-medium border-l-4 border-green-500 pl-3">
          {t("auth.subtitle")}
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
                <Tag size={18} className="text-green-600" />{" "}
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
                value={formData.expiry_time}
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
              rows="4"
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-500 focus:bg-white outline-none transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all flex justify-center items-center gap-3 shadow-lg ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:shadow-green-200 active:scale-[0.98]"
            }`}
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={22} />
            )}
            {t("food.update_btn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFood;
