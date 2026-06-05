import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supplierService } from "../../services/supplierService";
import { foodService } from "../../services/foodService"; // Import for verification
import FoodCard from "../../components/food/FoodCard";
import { Package, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, active: 0, claimed: 0 });
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, inventoryData] = await Promise.all([
        supplierService.getStats(),
        supplierService.getInventory(),
      ]);
      setStats(statsData);
      setInventory(inventoryData);
    } catch (err) {
      toast.error(t("notify.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // NEW: Handle Verification Logic
  const handleVerify = async (id, code) => {
    if (code.length !== 4) {
      toast.warning(t("food.code_placeholder"));
      return;
    }

    try {
      await foodService.verifyPickup(id, code);
      toast.success(t("notify.verify_success"));
      fetchData(); // Refresh data to show "Completed" status and update stats
    } catch (err) {
      toast.error(t("notify.verify_error"));
    }
  };

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center text-green-600 font-bold">
        {t("nav.dashboard")}...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">
        NeedNourish <span className="text-green-600">{t("nav.dashboard")}</span>
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

      <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-4">
        {t("food.my_inventory_title")}
      </h2>

      {inventory.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center shadow-sm">
          <Package className="mx-auto text-gray-200 mb-4" size={64} />
          <p className="text-gray-400 font-medium text-lg">
            {t("food.no_inventory")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventory.map((item) => (
            <FoodCard
              key={item.id}
              food={item}
              role="supplier"
              onVerify={handleVerify} // Pass verification handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <div
    className={`${color} p-8 rounded-3xl flex items-center gap-6 border border-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1`}
  >
    <div className="bg-white p-4 rounded-2xl shadow-inner">{icon}</div>
    <div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-4xl font-black text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
