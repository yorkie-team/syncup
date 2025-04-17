import { useState, useEffect } from "react";
import { User } from "@/types/types";
import { toast } from "sonner";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.ok) {
          setUser(await res.json());
        } else {
          setUser(null);
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
}
