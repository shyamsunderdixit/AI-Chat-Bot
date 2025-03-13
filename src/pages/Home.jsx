import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-200 ">
      <img src="./logo.jpg" alt="" className="h-28 rounded-4xl mb-10"/>
      <h1 className="text-4xl font-bold text-gray-700">Welcome to Chat App</h1>
      <p className="text-gray-600 mt-2">Chat with AI  in real-time.</p>
      
      <Link to="/chatroom">
        <button className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-lg cursor-pointer">
          Start Chatting
        </button>
      </Link>
    </div>
  );
};

export default Home;
