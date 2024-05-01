import VerifyUserPage from "@/components/userVerification";

export default function User({ params }: { params: { token: string } }) {

    return (
        <VerifyUserPage token={params.token} />
    )
}