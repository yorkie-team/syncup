import { useState, useEffect } from "react";
import { User } from "@/types/types";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        console.log("User fetched successfully");
        setUser(await res.json());
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return user;
}
