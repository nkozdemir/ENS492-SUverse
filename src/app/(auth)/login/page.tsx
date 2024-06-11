import { redirect } from 'next/navigation';
import LoginForm from '@/components/loginForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/utils/authoptions';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/home');

  return <LoginForm />;
}