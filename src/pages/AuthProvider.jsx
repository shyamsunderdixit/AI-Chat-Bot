import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext"; // Import the context

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle async operations

  // Function to get user from localStorage safely
  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser && parsedUser.email ? parsedUser : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  };

  // Check localStorage for user data on mount
  useEffect(() => {
    const parsedUser = getStoredUser();

    if (parsedUser) {
      setUser(parsedUser);
      setIsLoggedIn(true);
    } 
    setLoading(false); 
  }, []);

  // Login function with additional checks
  const login = (userData) => {
    if (isLoggedIn) return; // Prevent login if already logged in
    if (userData && typeof userData === "object" && userData.email) {
      console.log("Logging in:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    } else {
      console.error("Invalid user data provided for login.", userData);
    }
  };

  // Logout function
  const logout = () => {
    // console.log("Logging out...");
    localStorage.removeItem("user");  // Remove stored user data
    sessionStorage.clear();  // Extra safety to prevent session persistence
    setUser(null);
    setIsLoggedIn(false);
  };

  // If the component is loading, return null or a loading spinner
  if (loading) {
    return <div>Loading...</div>; // Could be a spinner or skeleton loader
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,  // Ensures children is a valid React node
  };

export default AuthProvider;
