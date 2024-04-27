import PostDetailPage from "@/components/post/postDetail";

export default function Post({ params }: { params: { id: string } }) {
    return (
        <PostDetailPage postId={params.id} />
    )
}