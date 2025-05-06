import { useState, useEffect } from "react";
import { User } from "@/types/types";
import { toast } from "sonner";

export function useFetchUser() {
  const [user, setUser] = useState<User | undefined>(undefined);
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
          setUser(undefined);
        }
      } catch (error) {
        toast.error("Failed to fetch user");
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
}
