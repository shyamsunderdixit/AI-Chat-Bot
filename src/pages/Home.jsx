import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-400 to-white ">
      <h1 className="text-4xl font-bold text-gray-700">Welcome to Chat App</h1>
      <p className="text-gray-600 mt-2">Chat with AI or your friends in real-time.</p>
      
      <Link to="/chatroom">
        <button className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-lg cursor-pointer">
          Start Chatting
        </button>
      </Link>
    </div>
  );
};

export default Home;
