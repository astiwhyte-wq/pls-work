import { createContext, useContext, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isError: false,
  isAdmin: false,
  isApproved: false,
  isPending: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    },
  });

  const isAdmin = user?.role === "admin";
  const isApproved = user?.status === "approved" || isAdmin;
  const isPending = user?.status === "pending";

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, isAdmin, isApproved, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
