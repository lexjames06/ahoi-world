// External Libraries
import { User } from "@ahoi-world/types/UserTypes";
import React, { useState } from "react";

export type UserState = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const defaultUserState: UserState = {
  user: null,
  setUser: () => {},
};

export const useUserStore = () => {
  const [user, setUser] = useState<User | null>(defaultUserState.user);

  const store = {
    user,
    setUser,
  };

  return store;
};
