import React, { useContext, useState } from "react";
import { PropsWithChildren } from "react";

interface UserType {
  user: Record<string, string>;
  setCurrentUser?: React.Dispatch<any>;
}

const UserContext = React.createContext<UserType>({ user: {} });

type Special = PropsWithChildren<{ user: UserType["user"] }>;

function UserProvider({ user, children }: Special): JSX.Element {
  const [currentUser, setCurrentUser] = useState(user);
  return (
    <UserContext.Provider value={{ user: currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * A simple custom hook to consume our context in the child components.
 * @returns  `UserType` via context.
 */
function useUserAuthenticated(): UserType {
  return useContext(UserContext);
}

export { UserContext, UserProvider, useUserAuthenticated };
export type { UserType };
