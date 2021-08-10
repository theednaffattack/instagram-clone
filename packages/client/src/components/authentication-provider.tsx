import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ContextProps {
  authState: AuthState | undefined;
  setAuthToken: (token: string) => void | undefined;
  signIn: (token: string, userId: string) => void | undefined;
  signOut: () => void | undefined;
}

const AuthContext = createContext<ContextProps>({
  authState: undefined,
  setAuthToken: undefined,
  signIn: undefined,
  signOut: undefined,
});

interface AuthState {
  token: string;
  userId: string;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

function AuthenticationProvider({
  children,
}: PropsWithChildren<AuthenticationProviderProps>): JSX.Element {
  const initialAuthState = {
    token: undefined,
    userId: undefined,
  };
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  function signIn(token: string, userId: string) {
    setAuthState({
      ...authState,
      userId,
      token,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId);
    }
  }

  function setAuthToken(token: string) {
    setAuthState({
      ...authState,
      token,
    });
  }

  function signOut() {
    setAuthState(initialAuthState);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userId");
    }
  }
  useEffect(() => {
    if (localStorage.getItem("userId") !== authState.userId) {
      setAuthState({
        ...authState,
        userId: localStorage.getItem("userId"),
      });
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): ContextProps {
  return useContext(AuthContext);
}

export default AuthenticationProvider;

export { useAuth };
