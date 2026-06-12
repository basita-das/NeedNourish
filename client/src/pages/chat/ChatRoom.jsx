import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/chatService";
import { foodService } from "../../services/foodService"; // Needed to fetch names
import { useTranslation } from "react-i18next";
import {
  Send,
  ChevronLeft,
  User,
  MessageSquareOff,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const ChatRoom = () => {
  const { foodId } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherPersonName, setOtherPersonName] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // 1. Fetch metadata and subscribe to messages
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Fetch food details to get the names of participants
        const foodData = await foodService.getFoodDetail(foodId);

        // Logic: If I am the Supplier, show the Receiver's name. Otherwise show Supplier name.
        const name =
          user.role === "supplier"
            ? foodData.receiver_name
            : foodData.supplier_name;
        setOtherPersonName(name || "User");

        // Subscribe to real-time Firebase updates
        const unsubscribe = chatService.subscribeMessages(
          foodId,
          (newMessages) => {
            setMessages(newMessages);
            setLoading(false);
          },
        );

        return unsubscribe;
      } catch (err) {
        toast.error(t("notify.error"));
        setLoading(false);
      }
    };

    const unsubscribePromise = initializeChat();

    // Cleanup listener on unmount
    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [foodId, user.role, t]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Handle Send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageText = input;
    setInput("");

    try {
      await chatService.sendMessage(foodId, user.id, user.role, messageText);
    } catch (error) {
      toast.error(t("notify.error"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white shadow-2xl rounded-3xl mt-4 border border-gray-100 overflow-hidden">
      {/* HEADER: Shows the specific person you are talking to */}
      <div className="bg-green-600 p-4 text-white flex items-center gap-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full text-green-600 shadow-inner">
            <User size={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] uppercase opacity-80 font-black tracking-widest">
              {t("chat.chatting_with")}
            </p>
            <h2 className="font-bold text-xl leading-tight">
              {otherPersonName}
            </h2>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-green-600 gap-2">
            <Loader2 className="animate-spin" />
            <p className="font-bold">{t("food.detecting")}...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <MessageSquareOff size={48} strokeWidth={1.5} />
            <p className="font-medium">{t("chat.no_messages")}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">
                      {msg.text}
                    </p>
                  </div>

                  {msg.createdAt && (
                    <span className="text-[9px] text-gray-400 mt-1 px-1 font-medium">
                      {new Date(
                        msg.createdAt.seconds * 1000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // Dynamic Placeholder: "Type a message..."
            placeholder={t("chat.placeholder")}
            className="flex-1 p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center ${
              input.trim()
                ? "bg-green-600 text-white hover:bg-green-700 active:scale-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
