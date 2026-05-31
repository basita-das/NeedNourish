import React, { useEffect, useState } from "react";
import { foodService } from "../../services/foodService";
import FoodCard from "../../components/food/FoodCard";
import { Search, MapPin } from "lucide-react";

const Explore = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => alert("Please enable location to find food nearby."),
    );
  }, []);

  useEffect(() => {
    if (coords) {
      const fetchNearby = async () => {
        try {
          const data = await foodService.getNearby(coords.lat, coords.lon);
          setFoods(data);
        } catch (err) {
          console.error("Error fetching nearby food");
        } finally {
          setLoading(false);
        }
      };
      fetchNearby();
    }
  }, [coords]);

  const handleClaim = async (id) => {
    try {
      await foodService.claimFood(id);
      alert("Food claimed successfully!");
      // Refresh list
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || "Could not claim food");
    }
  };

  if (!coords)
    return (
      <div className="p-10 text-center">Waiting for location access...</div>
    );
  if (loading)
    return <div className="p-10 text-center">Finding food near you...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Explore Food Nearby</h1>
          <p className="text-gray-500 flex items-center gap-1 text-sm">
            <MapPin size={14} /> Showing items within 5km of your location
          </p>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="text-center bg-white p-20 rounded-2xl border">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            No available food found in your area right now.
          </p>
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
