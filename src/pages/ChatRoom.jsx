
import { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/Firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, getDocs } from "firebase/firestore";
import { getAIResponse } from "../config/Ai";
import Message from "../components/Message";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userChatRef = collection(db, `chats/${user.uid}/messages`);
    const q = query(userChatRef, orderBy("timestamp", "asc"));

    // Fetch messages immediately when component mounts
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);

      // Auto-scroll to last message after data loads
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [user]); //  Ensures messages load when user is available

  const sendMessage = async () => {
    if (!input || loading || !user) return;

    setLoading(true);

    const userChatRef = collection(db, `chats/${user.uid}/messages`);

    await addDoc(userChatRef, {
      text: input,
      user: user.displayName || "User",
      timestamp: serverTimestamp(),
    });

    setInput("");

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

  //  Clear Conversation Function
  const clearConversation = async () => {
    if (!user) return;

    const userChatRef = collection(db, `chats/${user.uid}/messages`);
    const querySnapshot = await getDocs(userChatRef);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setMessages([]);
  };

  return (
    <div className="h-[650px] mx-auto p-4 bg-gradient-to-tr from-yellow-100 to-black">
      <div className="flex justify-between items-center mb-2 ">
        <h2 className="text-2xl font-semibold">Chat Room</h2>
        
        {/* Clear Conversation Button */}
        <button
          onClick={clearConversation}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-red-600 transition"
        >
          Clear Chat
        </button>
      </div>

      {/* Scrollable chat container */}
      <div ref={chatContainerRef} className="h-[85%] overflow-y-auto bg-gray-100 p-4 rounded-lg bg-gradient-to-tr from-black to-zinc-500">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message key={msg.id || index} text={msg.text} user={msg.user} isBot={msg.user === "AI Bot"} />
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
        )}
      </div>

      {/* Input Section */}
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
