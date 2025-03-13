import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../context/UseAuth";

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error

    try {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }

      // Create the user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update the profile with the user's display name
      await updateProfile(user, { displayName: formData.name });

         // Reload user to get updated profile
    await user.reload();

      // Create a user object
      const updatedUser = { 
        name: auth.currentUser.displayName || formData.name, // Ensure name is stored
      email: auth.currentUser.email,
        };

      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update login status in context
      login(updatedUser); // Call the login function to update the global login state

      // Navigate to the dashboard
      navigate("/chatroom");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pl-5 pr-5">
      <div className="shadow-lg p-8 rounded-xl w-full max-w-md bg-white">
        <h2 className="text-3xl font-bold text-center">Create an Account</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none transition bg-gray-100 border-gray-300 text-gray-900"
            required
          />

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
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-blue-400 hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
