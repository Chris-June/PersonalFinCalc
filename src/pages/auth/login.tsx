import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants';

export function Login() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Login - {APP_NAME}</title>
      </Helmet>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Calculator className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account or sign in
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </>
  );
}