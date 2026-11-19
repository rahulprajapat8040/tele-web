import { queryClient } from "@/api/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export const QueryProivder = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
