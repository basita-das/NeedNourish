import { db } from "../api/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import CryptoJS from "crypto-js";

// Retrieve the secret key from .env
const SECRET_KEY = import.meta.env.VITE_CHAT_ENCRYPTION_SECRET;

export const chatService = {
  /**
   * Encrypts and sends a message to the Firebase room
   */
  sendMessage: async (foodId, senderId, senderRole, messageText) => {
    if (!messageText.trim()) return;

    // 1. Encrypt the text using AES
    const encryptedMessage = CryptoJS.AES.encrypt(
      messageText,
      SECRET_KEY,
    ).toString();

    // 2. Save to Firestore (room ID is based on foodId)
    await addDoc(collection(db, `chats/room_${foodId}/messages`), {
      senderId,
      senderRole,
      text: encryptedMessage,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Subscribes to real-time messages and decrypts them
   */
  subscribeMessages: (foodId, callback) => {
    const q = query(
      collection(db, `chats/room_${foodId}/messages`),
      orderBy("createdAt", "asc"),
    );

    // Listens for real-time updates
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        let decryptedText = "";

        try {
          // Decrypt the text back to readable English/Hindi/etc.
          const bytes = CryptoJS.AES.decrypt(data.text, SECRET_KEY);
          decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          decryptedText = "[Encrypted Content]";
        }

        return {
          id: doc.id,
          ...data,
          text: decryptedText,
        };
      });

      callback(messages);
    });
  },
};
