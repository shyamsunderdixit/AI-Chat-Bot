import { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/Firebase"; // Firebase config import
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../context/UseAuth"; // Context for global auth state

const Navbar = () => {
  const [user, setUser] = useState(null); // Local user state
  const { isLoggedIn, login, logout } = useAuth(); // Auth state from context
  const [isProfileVisible, setIsProfileVisible] = useState(false); // For controlling the visibility of profile modal
  const navigate = useNavigate(); // For navigation after logout

  // Load stored user info from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          name: currentUser.displayName || "User",
          email: currentUser.email,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
        login(userData); // Update global auth state
      } else {
        logout(); // Clear global auth state if user is logged out
        setUser(null); // Clear local user state
        localStorage.removeItem("user"); // Clear localStorage
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [login, logout]);

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        logout(); // Clear global auth state
        setUser(null); // Clear local user state
        localStorage.removeItem("user"); // Remove user from localStorage
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <nav className="bg-gray-100 px-8 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        <img src="./logo.jpg" alt="Logo" className="h-16 rounded-xl shadow-xl" />
      </Link>

      {/* Navbar Right Section */}
      <div>
        {isLoggedIn ? (
          <>
            {/* Display user name */}
            <span
              onClick={() => {
                setIsProfileVisible(true);
              }}
              className="bg-amber-500 px-4 py-2 mr-4 text-white font-semibold rounded-lg cursor-pointer hover:bg-amber-600"
            >
              <i className="ri-user-line mr-2"></i>{user?.name}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 mt-6 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-green-600 text-white px-4 py-2 rounded shadow-xl cursor-pointer hover:bg-green-700">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Profile Modal */}
      {isProfileVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-white mb-4">User Profile</h2>

            {user ? (
              <div className="text-white">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>

                <div className="space-y-3 bg-gray-700 p-4 rounded-lg text-sm sm:text-base">
                  <p>
                    <span className="text-gray-400">Name:</span>
                    <span className="ml-2 font-medium">{user.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span>
                    <span className="ml-2 font-medium">{user.email}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            <button
              onClick={() => setIsProfileVisible(false)} // Close profile modal
              className="absolute top-4 right-6 text-gray-400 hover:text-white"
            >
              <i className="ri-close-large-line cursor-pointer"></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
