import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supplierService } from "../../services/supplierService";
import FoodCard from "../../components/food/FoodCard";
import { Package, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, active: 0, claimed: 0 });
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, inventoryData] = await Promise.all([
          supplierService.getStats(),
          supplierService.getInventory(),
        ]);
        setStats(statsData);
        setInventory(inventoryData);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center text-green-600 font-bold">
        {t("nav.dashboard")}...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        NeedNourish {t("nav.dashboard")}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatItem
          icon={<Package className="text-blue-600" />}
          label={t("stats.total")}
          value={stats.total}
          color="bg-blue-50"
        />
        <StatItem
          icon={<Clock className="text-green-600" />}
          label={t("stats.active")}
          value={stats.active}
          color="bg-green-50"
        />
        <StatItem
          icon={<CheckCircle className="text-orange-600" />}
          label={t("stats.claimed")}
          value={stats.claimed}
          color="bg-orange-50"
        />
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-700">
        {t("food.my_inventory_title")}
      </h2>

      {inventory.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-300 text-center shadow-sm">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">{t("food.no_inventory")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {inventory.map((item) => (
            <FoodCard key={item.id} food={item} role="supplier" />
          ))}
        </div>
      )}
    </div>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <div
    className={`${color} p-6 rounded-2xl flex items-center gap-4 border border-white shadow-sm hover:shadow-md transition-all`}
  >
    <div className="bg-white p-3 rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
