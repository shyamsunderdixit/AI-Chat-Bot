
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //  Fetch stored user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    //  Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          name: currentUser.displayName || "User",
          email: currentUser.email,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); //  Store in localStorage
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gradient-to-tr from-white to-purple-400  shadow-2xl p-4  flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">ChatApp</Link>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Hello, {user.name}</span>
            <button 
              onClick={() => {
                signOut(auth);
                setUser(null);
                localStorage.removeItem("user");
                window.location.reload(); //  Refresh UI on logout
              }} 
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/auth">
            <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
