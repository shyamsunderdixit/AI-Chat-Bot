import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../config/Firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/UseAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  // Handle input change for both email and password fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  // Handle sign-in form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

         // Reload user to get the latest data
    await user.reload();

      const loggedInUser = { 
        name: auth.currentUser.displayName || "User",
      email: auth.currentUser.email,
       };

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Update login status using context
      login(loggedInUser); // Set login status to true

      navigate("/chatroom"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  const googleSignIn = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const loggedInUser = { name: user.displayName || "User", email: user.email };
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Update login status using context
      login(loggedInUser); // Set login status to true

      navigate("/chatroom"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pl-5 pr-5">
      <div className="shadow-lg p-8 rounded-xl w-full max-w-md bg-white">
        <h2 className="text-3xl font-bold text-center">Welcome Back!</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none transition bg-gray-100 border-gray-300 text-gray-900"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none transition bg-gray-100 border-gray-300 text-gray-900"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold transition hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>

        {/* Google Sign-In */}
        <button
          onClick={googleSignIn}
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg font-semibold transition hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Sign In with Google"}
        </button>

        <p className="text-center mt-4">
          Do not have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
