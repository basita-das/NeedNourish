import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";

// Fix for default Leaflet icons not showing in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map when coordinates change
function RecenterMap({ coords }) {
  const map = useMap();
  map.setView([coords.lat, coords.lon], 13);
  return null;
}

const FoodMap = ({ foods, userCoords }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 overflow-hidden shadow-inner border rounded-3xl">
      <MapContainer
        center={[userCoords.lat, userCoords.lon]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's Location Marker */}
        <Marker position={[userCoords.lat, userCoords.lon]}>
          <Popup>{t("map.your_location")}</Popup>
        </Marker>

        {/* Food Pins */}
        {foods.map((food) => (
          <Marker key={food.id} position={[food.latitude, food.longitude]}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-green-700">{food.title}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {t(`categories.${food.category}`)}
                </p>
                <button className="text-[10px] bg-green-600 text-white px-2 py-1 rounded">
                  {t("map.view_details")}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap coords={userCoords} />
      </MapContainer>
    </div>
  );
};

export default FoodMap;
