

import { useState, useEffect } from "react";
import { db, auth } from "../config/Firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAIResponse } from "../config/Ai";
import Message from "../components/Message";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userChatRef = collection(db, `chats/${user.uid}/messages`);
    const q = query(userChatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!input || loading || !user) return;

    setLoading(true);

    const userChatRef = collection(db, `chats/${user.uid}/messages`);

    // Save user message
    await addDoc(userChatRef, {
      text: input,
      user: user.displayName || "User",
      timestamp: serverTimestamp(),
    });

    setInput("");

    // AI Response
    try {
      const aiReply = await getAIResponse(input);
      await addDoc(userChatRef, {
        text: aiReply,
        user: "AI Bot",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("AI Response Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="h-[650px] mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Chat Room</h2>
      <div className="h-[85%] overflow-y-auto bg-gray-100 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} user={msg.user} isBot={msg.user === "AI Bot"} />
        ))}
      </div>
      
      <div className="flex mt-2 gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="border p-2 w-full rounded-md"
        />
        <button 
          onClick={sendMessage} 
          className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
