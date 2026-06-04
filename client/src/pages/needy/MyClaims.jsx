import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { needyService } from "../../services/needyService";
import { CheckCircle, Calendar, Inbox } from "lucide-react";

const MyClaims = () => {
  const { t } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    needyService.getHistory().then((data) => {
      setClaims(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-green-600">
        {t("nav.claims")}...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("food.history_title")}
        </h1>
        <p className="text-gray-500">{t("food.history_subtitle")}</p>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed p-16 text-center shadow-sm">
          <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">{t("food.no_history")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {claims.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> {t("food.claimed_on")}:{" "}
                    {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold border border-green-100 uppercase tracking-widest">
                {t("food.status_claimed")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
