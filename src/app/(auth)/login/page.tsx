import { redirect } from 'next/navigation';
import LoginForm from '@/components/loginForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');

  return <LoginForm />;
}