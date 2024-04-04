export default function Post({ params } : { params: { id: string } }) {
    return (
        <>
            <h1>Post {params.id} Details</h1>
        </>
    );
}