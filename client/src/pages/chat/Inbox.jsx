import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supplierService } from "../../services/supplierService";
import { needyService } from "../../services/needyService";
import {
  MessageSquare,
  User,
  ChevronRight,
  Inbox as InboxIcon,
  Loader2,
} from "lucide-react";

const Inbox = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        // 1. Fetch data based on role
        const data =
          user.role === "supplier"
            ? await supplierService.getInventory()
            : await needyService.getHistory();

        // 2. Filter: Only items that are Claimed or Completed have chat rooms
        const activeRooms = data.filter((item) => item.status !== "available");
        setRooms(activeRooms);
      } catch (err) {
        console.error("Failed to load inbox");
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [user.role]);

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-green-600">
        <Loader2 className="animate-spin w-10 h-10" />
        <p className="font-bold">{t("nav.dashboard")}...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8 text-gray-800">
        <MessageSquare size={32} className="text-green-600" />
        <h1 className="text-3xl font-black tracking-tight">
          {t("chat.inbox_title")}
        </h1>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center shadow-sm">
          <InboxIcon size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-lg">
            {t("chat.no_chats")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {rooms.map((room) => {
            const otherName =
              user.role === "supplier"
                ? room.receiver_name
                : room.supplier_name;

            return (
              <div
                key={room.id}
                onClick={() => navigate(`/chat/${room.id}`)}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-500 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                      {t("chat.chatting_with")}{" "}
                      <span className="text-green-600">
                        {otherName || "User"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                      room.status === "completed"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {room.status === "completed"
                      ? t("food.status_completed")
                      : t("food.status_claimed")}
                  </span>
                  <ChevronRight
                    size={20}
                    className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;
