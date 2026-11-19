import { PageLoader } from "@/components/common/loaders/page-loader";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/lib/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearUser, setLoading } = useAuthStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (data) {
      setUser(data.data);
    } else {
      clearUser();
    }
  }, [data, isError, setUser, clearUser, isLoading]);

  if (isLoading) {
    return (
      <>
        <PageLoader />
      </>
    );
  }

  return children;
};
