import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Import the context

export const useAuth = () => {
  return useContext(AuthContext);
};
