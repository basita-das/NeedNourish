import React, { useEffect, useState } from "react";
import { needyService } from "../../services/needyService";
import { CheckCircle, Calendar, MapPin, Inbox } from "lucide-react";

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await needyService.getHistory();
        setClaims(data);
      } catch (err) {
        console.error("Failed to fetch claim history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-green-600 font-bold">
        Loading your history...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Claim History</h1>
        <p className="text-gray-500">
          View all the food items you've helped save.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">
            You haven't claimed any food yet.
          </p>
          <button
            onClick={() => (window.location.href = "/explore")}
            className="mt-4 text-green-600 font-bold hover:underline"
          >
            Explore nearby food
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {claims.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Claimed on{" "}
                      {new Date(
                        item.updated_at || item.created_at,
                      ).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {item.latitude.toFixed(2)},{" "}
                      {item.longitude.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-100">
                  Successfully Claimed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
