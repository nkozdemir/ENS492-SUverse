import UserDetailPage from "@/components/user/userDetail";
import { isValidHexId } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function User({ params }: { params: { id: string } }) {
    if (!isValidHexId(params.id)) {
        notFound();
    }

    return (
        <UserDetailPage userId={params.id} />
    )
}