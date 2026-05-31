import React from "react";
import { MapPin, Clock, Tag, User } from "lucide-react";

const FoodCard = ({ food, role, onClaim }) => {
  const isAvailable = food.status === "available";

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{food.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {food.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {food.description || "No description provided."}
      </p>

      <div className="space-y-2 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-2">
          <Tag size={16} /> <span className="capitalize">{food.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />{" "}
          <span>Expires: {new Date(food.expiry_time).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />{" "}
          <span>
            Location: {food.latitude.toFixed(2)}, {food.longitude.toFixed(2)}
          </span>
        </div>
      </div>

      {role === "needy" && isAvailable && (
        <button
          onClick={() => onClaim(food.id)}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Claim Food
        </button>
      )}
    </div>
  );
};

export default FoodCard;
