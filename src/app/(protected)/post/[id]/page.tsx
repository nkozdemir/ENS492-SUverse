import PostDetailPage from "@/components/post/postDetail";
import { notFound } from "next/navigation";
import { isValidHexId } from "@/lib/utils";

export default function Post({ params }: { params: { id: string } }) {
    if (!isValidHexId(params.id)) {
        notFound();
    }
    
    return (
        <PostDetailPage postId={params.id} />
    )
}