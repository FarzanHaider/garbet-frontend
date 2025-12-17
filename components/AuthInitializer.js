"use client";

import { useEffect } from "react";
import { authAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function AuthInitializer() {
  const auth = useAuth();

  // Always call hooks unconditionally; guard inside effect
  const setUser = auth?.setUser;
  const logout = auth?.logout;

  useEffect(() => {
    if (!setUser || !logout) return;

    const loadSession = async () => {
      try {
        const res = await authAPI.me();
        setUser(res.data);
      } catch (err) {
        try {
          await authAPI.refresh();
          const res = await authAPI.me();
          setUser(res.data);
        } catch {
          logout();
        }
      }
    };

    loadSession();
  }, [setUser, logout]);

  return null;
}
