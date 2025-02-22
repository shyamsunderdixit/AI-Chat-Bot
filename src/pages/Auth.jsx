import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
  
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
  
        // Store name in Firebase user profile
        await updateProfile(user, { displayName: formData.name });
  
        // Ensure the UI updates immediately
        const updatedUser = { name: formData.name, email: user.email };
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        setTimeout(() => window.location.reload(), 500); //  Reload after small delay
      } else {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
  
        // Retrieve name from Firebase Auth
        const name = user.displayName || "User";
        const loggedInUser = { name, email: user.email };
  
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(loggedInUser));
  
        alert("Sign-in successful!");
        navigate("/chatroom");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Sign-In
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google Sign-in successful!");
      navigate("/chatroom");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center">{isSignUp ? "Create an Account" : "Welcome Back!"}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name Field (Only for Sign Up) */}
          {isSignUp && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold cursor-pointer">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Google Sign-In */}
        <button onClick={googleSignIn} className="w-full bg-red-500 text-white py-2 mt-4 rounded-lg font-semibold cursor-pointer">
          Sign In with Google
        </button>

        <p className="text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="text-blue-600 cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
