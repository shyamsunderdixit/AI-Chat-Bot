import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AuthProvider from "./pages/AuthProvider";

const AppRoutes = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthProvider />} />
      <Route path="/login" element={<LoginPage  />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/chatroom" element={<ChatRoom />} />
    </Routes>
  </Router>
);

export default AppRoutes;
