import UserDetailPage from "@/components/user/userDetail";

export default function User({ params }: { params: { id: string } }) {
    return (
        <UserDetailPage userId={params.id} />
    )
}