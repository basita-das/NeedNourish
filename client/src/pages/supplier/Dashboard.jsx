import React, { useEffect, useState } from "react";
import { supplierService } from "../../services/supplierService";
import FoodCard from "../../components/food/FoodCard";
import { Package, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
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
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Supplier Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatItem
          icon={<Package className="text-blue-600" />}
          label="Total Posts"
          value={stats.total}
          color="bg-blue-50"
        />
        <StatItem
          icon={<Clock className="text-green-600" />}
          label="Active Listings"
          value={stats.active}
          color="bg-green-50"
        />
        <StatItem
          icon={<CheckCircle className="text-orange-600" />}
          label="Claimed Items"
          value={stats.claimed}
          color="bg-orange-50"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">My Inventory</h2>
      {inventory.length === 0 ? (
        <p className="text-gray-500 bg-white p-10 rounded-xl border border-dashed text-center">
          You haven't posted any food yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <FoodCard key={item.id} food={item} role="supplier" />
          ))}
        </div>
      )}
    </div>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <div className={`${color} p-6 rounded-2xl flex items-center gap-4`}>
    <div className="bg-white p-3 rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
