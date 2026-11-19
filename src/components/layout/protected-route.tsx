import { APP_ROUTES } from '@/lib/constant/route-constant';
import { useAuthStore } from '@/lib/store/auth.store';
// import { PageLoader } from "../common/loaders/page-loader";
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore(); // Replace with real auth state
  if (isLoading) {
    // return <PageLoader />;
  }
  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
