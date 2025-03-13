

import { useState, useEffect, useRef } from "react";
import { db, auth } from "../config/Firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getAIResponse } from "../config/Ai";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; 
// import toast from "react-hot-toast";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [guestQuestionCount, setGuestQuestionCount] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup
  const [user, setUser] = useState(null);
  const maxGuestQuestions = 5;
  // const user = auth.currentUser;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

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
  }, [user]);

  const sendMessage = async () => {
    if (!input || loading) return;
  
    // Check guest question limit
    if (!user && guestQuestionCount >= maxGuestQuestions) {
      setShowLoginPopup(true); // Show login popup
      return;
    }
  
    setLoading(true);
  
    if (!user) {
      setGuestQuestionCount((prevCount) => prevCount + 1);
    }
  
    const userChatRef = user ? collection(db, `chats/${user.uid}/messages`) : null;
  
    if (userChatRef) {
      await addDoc(userChatRef, {
        text: input,
        user: user?.displayName || "Guest",
        timestamp: serverTimestamp(),
      });
    }
  
    // Manually update the messages state with user input
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text: input, user: user?.displayName || "Guest" },
    ]);
  
    // Scroll down immediately after user sends a message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  
    setInput("");
  
    try {
      const aiReply = await getAIResponse(input);
  
      if (userChatRef) {
        await addDoc(userChatRef, {
          text: aiReply,
          user: "AI Bot",
          timestamp: serverTimestamp(),
        });
      }
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now() + 1, text: aiReply, user: "AI Bot" },
      ]);
  
      //  Auto-scroll after AI response
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
  
    } catch (error) {
      console.error("AI Response Error:", error);
    }
  
    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Clear Conversation Function
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
    <div className="h-[650px] mx-auto p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold">Chat Room</h2>

        {/* Clear Conversation Button - Visible only if logged in */}
        {user && (
          <button
            onClick={clearConversation}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-red-600 transition"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Scrollable chat container */}
      <div
        ref={chatContainerRef}
        className="h-[85%] overflow-y-auto bg-black p-4 rounded-lg bg-gradient-to-tr from-black to-zinc-500"
      >
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
          onKeyDown={handleKeyPress} // Handle Enter key
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

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl p-4">
        <div className="bg-white p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-lg text-center">
          <h3 className="text-lg md:text-xl font-semibold">Login Required</h3>
          <p className="text-gray-600 text-sm md:text-base">
            You have reached the guest limit of 5 questions. Please log in to continue.
          </p>
          <Link to="/auth">
          <button
            onClick={() => setShowLoginPopup(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-md text-sm md:text-base"
          >
            OK
          </button>
          </Link>
          
        </div>
      </div>
      
      )}
    </div>
  );
};

export default ChatRoom;



