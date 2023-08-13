"use client";
import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "@ahoi-world/firebase/app";
import { createFirebaseUser, getFirebaseUserData } from "@ahoi-world/lib/users";
import { User } from "@ahoi-world/types/UserTypes";

export const AuthContext = React.createContext<{ user: User | null }>({ user: null });

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await getFirebaseUserData({ firebaseUID: firebaseUser.uid });

        if (userProfile) {
          setUser(userProfile);
        } else {
          const firestoreUser = await createFirebaseUser(firebaseUser);
          setUser(firestoreUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading? "loading" : children}
    </AuthContext.Provider>
  );
}