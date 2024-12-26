import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants';

export function Verify() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Verify Email - {APP_NAME}</title>
      </Helmet>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <MailCheck className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent you a verification link. Please check your email to
              continue.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}