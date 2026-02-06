import { auth } from '@/auth';
import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};
const LoginPage = async () => {
  const session = await auth();
  if (session) {
    redirect('/en/home');
  }
  return (
    <LoginForm session={session} />
  )
}


export default LoginPage