// External Libraries
import { createContext } from "react";
// Local Paths
import { UserState, defaultUserState, useUserStore } from "./user";

type State = UserState;

const defaultState: State = {
  ...defaultUserState,
};


export const StoreContext = createContext(defaultState);

const Store = ({ children }: { children: React.ReactNode }) => {
  const userStore = useUserStore();

  const store = {
    ...userStore,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default Store;