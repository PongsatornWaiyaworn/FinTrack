import { useContext } from "react";
import { AuthContext } from "@/types/authContext";

export function useAuth() {
  return useContext(AuthContext);
}
