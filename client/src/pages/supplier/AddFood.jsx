import React, { useState, useEffect } from "react";
import { foodService } from "../../services/foodService";
import { FoodCategory } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Utensils, AlignLeft } from "lucide-react";

const AddFood = () => {
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

  // Function to get GPS coordinates from the browser
  const getLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
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
        alert(
          "Unable to retrieve your location. Please allow location access.",
        );
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert("Please provide your location coordinates.");
      return;
    }

    setLoading(true);
    try {
      // Format expiry_time for FastAPI (ISO String)
      const payload = {
        ...formData,
        expiry_time: new Date(formData.expiry_time).toISOString(),
      };
      await foodService.createListing(payload);
      alert("Food item posted successfully!");
      navigate("/supplier-dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to post food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Post Surplus Food
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Utensils size={18} /> Food Title
            </label>
            <input
              type="text"
              placeholder="e.g., 10 Fresh Bagels"
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Category & Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {Object.values(FoodCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock size={18} /> Expiry Time
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                value={formData.expiry_time}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_time: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <AlignLeft size={18} /> Description (Optional)
            </label>
            <textarea
              placeholder="Provide details about packaging, allergens, etc."
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 h-24"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Location Selection */}
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin size={18} /> Location Information
            </label>

            <button
              type="button"
              onClick={getLocation}
              className="text-sm bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition mb-3"
            >
              {locationLoading ? "Fetching GPS..." : "Detect My Location"}
            </button>

            {formData.latitude && (
              <div className="text-xs text-gray-500 mt-2 grid grid-cols-2">
                <p>Lat: {formData.latitude.toFixed(4)}</p>
                <p>Long: {formData.longitude.toFixed(4)}</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Posting..." : "Post Food Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
