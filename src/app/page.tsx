export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing";
import authOptions from "@/utils/authoptions";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/home");

  return <LandingPage />;
}