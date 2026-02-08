import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, hasConfig } from "../firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  hasConfig: false,
  signIn: async () => {},
  signUp: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasConfig);

  useEffect(() => {
    if (!hasConfig || !auth) {
      setLoading(false);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      hasConfig,
      signIn: async (email, password) => {
        if (!auth) throw new Error("Firebase ayarlari eksik.");
        return signInWithEmailAndPassword(auth, email, password);
      },
      signUp: async (email, password) => {
        if (!auth) throw new Error("Firebase ayarlari eksik.");
        return createUserWithEmailAndPassword(auth, email, password);
      },
      signOutUser: async () => {
        if (!auth) return Promise.resolve();
        return signOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
