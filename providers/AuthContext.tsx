"use client";
import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth, firestore } from "@ahoi-world/firebase/app";
import { createFirebaseUser, getFirebaseUserData } from "@ahoi-world/lib/users";
import { User } from "@ahoi-world/types/UserTypes";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";

export const AuthContext = React.createContext<{ user: User | null }>({ user: null });

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser: Unsubscribe | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await getFirebaseUserData({ firebaseUID: firebaseUser.uid });
        let userId = userProfile?.id;

        if (userProfile) {
          setUser(userProfile);
          unsubscribeUser = onSnapshot(doc(firestore, "users", userProfile.id), (doc) => {
            setUser(doc.data() as User);
          });
        } else {
          const firestoreUser = await createFirebaseUser(firebaseUser);
          if (firestoreUser) {
            userId = firestoreUser.id;
          }
          setUser(firestoreUser);
        }

        if (userId) {
          unsubscribeUser = onSnapshot(doc(firestore, "users", userId), (doc) => {
            setUser(doc.data() as User);
          });
        }
      } else {
        if (unsubscribeUser) {
          unsubscribeUser();
        }
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading? "loading" : children}
    </AuthContext.Provider>
  );
}