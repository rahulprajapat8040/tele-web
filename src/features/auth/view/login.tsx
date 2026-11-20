import { LoginForm } from '../components/login-form';
import { LoginHeader } from '../components/login-header';

export const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh max-w-sm mx-auto text-center space-y-6">
      <LoginHeader />
      <LoginForm />
    </div>
  );
};
