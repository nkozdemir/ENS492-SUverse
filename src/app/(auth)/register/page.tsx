import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RegistrationForm from '@/components/registrationForm';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/home');
  
  return <RegistrationForm />;
}