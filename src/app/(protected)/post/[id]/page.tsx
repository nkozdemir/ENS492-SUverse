"use client";

import Toast from "@/components/toast";
import { fetchUserLikes } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CommentValues, PostValues } from "@/types/interfaces";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; 
import CommentList from "@/components/comment/commentlist";

interface CommentFormValues {
    content: string;
    attachments: string[];
}

export default function Post({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<PostValues>({} as PostValues);
    const [userLikes, setUserLikes] = useState<PostValues[]>([]);
    const [liked, setLiked] = useState(false);

    const [postComments, setPostComments] = useState<CommentValues[]>([]);

    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);

    const { data: session, status } = useSession();
    const router = useRouter();

    const fetchPostDetails = async () => {
        try {
            const res = await fetch(`/api/posts/get/detail?postId=${params.id}`);
            const data = await res.json();
            console.log('Post Details Response:', data);
            if (data.status === 200) {
                const postData: PostValues = data.data;
                console.log('Post Details:', postData);
                setPost(postData);
                setIsOwner(postData.userId === session?.user?.id);
                setLiked(userLikes.some((likedPost) => likedPost.postId === postData.postId));
            } else {
                if (data.status === 404) Toast('err', 'Post not found');
                else Toast('err', 'Internal server error. Please try again.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/api/posts/deletePost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: post.postId }),
            });

            const data = await res.json();
            console.log('Delete post response:', data);
            if (data.status === 200) {
                Toast('ok', 'Post deleted successfully.');
                // Redirect to previous page
                router.back();
            } else {
                Toast('err', 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Toast('err', 'Internal server error.');
        }
    };

    const handleLikePost = async () => {
        // If post is already liked, unlike it
        if (liked) {
            // Remove like locally, reduce post.post.likeCount by 1
            setLiked(false);
            setPost({ ...post, post: { ...post.post, likeCount: post.post.likeCount - 1 } });
            try {
                const res = await fetch(`/api/posts/like/deleteLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId: post.postId }),
                });

                const data = await res.json();
                console.log('Unlike post response:', data);
                if (data.status !== 200) Toast('err', 'Failed to unlike post.');
            } catch (error) {
                console.error('Error unliking post:', error);
                Toast('err', 'Internal server error.');
            }
        } else {
            // Add like locally, increase post.post.likeCount by 1
            setLiked(true);
            setPost({ ...post, post: { ...post.post, likeCount: post.post.likeCount + 1 } });
            try {
                const res = await fetch(`/api/posts/like/createLike`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId: post.postId }),
                });

                const data = await res.json();
                console.log('Like post response:', data);
                if (data.status !== 201) Toast('err', 'Failed to like post.');
            } catch (error) {
                console.error('Error liking post:', error);
                Toast('err', 'Internal server error.');
            }
        }
    };

    const submitComment = async (values: CommentFormValues) => {
        const body = {
            postId: post.postId,
            content: values.content,
            attachments: values.attachments,
        };
        console.log('Add comment body:', body);
        try {
            const res = await fetch(`/api/comments/createComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            console.log('Add comment response:', data);
            if (data.status === 201) Toast('ok', 'Comment added successfully.');
            else Toast('err', 'Failed to add comment.');
        } catch (error) {
            console.error('Error adding comment:', error);
            Toast('err', 'Internal server error.');
        }
    } 

    const getPostComments = async (id: string) => {
        try {
            const res = await fetch(`/api/posts/get/getAllPostComments?postId=${id}`);
            const data = await res.json();
            console.log('Post comments response:', data);
            if (data.status === 200) {
                setPostComments(data.data);
            } else {
                Toast('err', 'Failed to fetch comments.');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            Toast('err', 'Internal server error.');
        } finally {
            setLoadingComments(false);
        }
    }

    useEffect(() => {
        getPostComments(params.id);
    }, []);

    useEffect(() => {
        fetchPostDetails();
    }, [userLikes]);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchData = async () => {
                const data = await fetchUserLikes(session?.user?.id);
                setUserLikes(data);
            };
            fetchData();
        }
    }, [status]);

    return (
        <div className="container mx-auto mt-4">
            <h1 className="font-bold text-2xl mb-8">Post Details</h1>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-lg"></span>
                </div>
            ) : (
                <>
                    {/* Post Details */}
                    <div className="bg-base-200 p-6 mb-8 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">{post.post.title}</h2>
                        <Link href={`/user/${session?.user.id}`} className="font-semibold mb-2">
                            {post.post.user.name} (@{post.post.user.username})
                        </Link>
                        <br />
                        <Link href={`/category/${post.post.categoryId}/${post.post.category.name}`} className="font-semibold mb-2">
                            {post.post.category.name}
                        </Link>
                        <br />
                        <p>{post.post.content}</p>
                        <br />
                        <p>Created: {formatDate(new Date(post.post.createdAt))}</p>
                        <p>Updated: {formatDate(new Date(post.post.updatedAt))}</p>
                    </div>
    
                    {/* Post Actions */}
                    <div className="bg-base-200 rounded p-4 mb-8 flex items-center space-x-4">
                        <button
                            className="inline-flex items-center btn btn-ghost btn-circle"
                            onClick={handleLikePost}
                        >
                            {liked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                            <span>{post.post.likeCount}</span>
                        </button>
                        {isOwner && (
                            <>
                                <button className="inline-flex items-center btn btn-ghost btn-circle">
                                    <MdEdit size={20} />
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="inline-flex items-center btn btn-ghost btn-circle"
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </>
                        )}
                    </div>
    
                    {/* Comments Section */}
                    <div className="bg-base-200 rounded p-6">
                        <h2 className="text-2xl font-semibold mb-4">Comments ({post.post.commentCount})</h2>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Add a Comment</h2>
                            <Formik
                                initialValues={{ content: '', attachments: [] }}
                                validationSchema={Yup.object({
                                    content: Yup.string().required('Content is required'),
                                })}
                                onSubmit={async (values, { resetForm }) => {
                                    await submitComment(values);
                                    resetForm(); // Reset form after submission
                                }}
                            >
                                {({ isValid, dirty, isSubmitting }) => (
                                    <Form>
                                        <label className="form-control">
                                            <div className="label">
                                                <span className="label-text">Your comment</span>
                                            </div>
                                            <Field
                                                as="textarea"
                                                id="content"
                                                name="content"
                                                rows="4"
                                                className="textarea textarea-bordered h-24"
                                                placeholder="Enter your comment..."
                                            />
                                            <ErrorMessage name="content">
                                                {msg => (
                                                    <div className="label">
                                                        <span className="label-text-alt text-red-500">{msg}</span>
                                                    </div>
                                                )}
                                            </ErrorMessage>
                                        </label>
                                        <button
                                            type="submit"
                                            className={`btn btn-primary mt-4 ${!(isValid && dirty) ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={!(isValid && dirty) || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    Submitting
                                                    <span className="animate-spin mr-2">&#9696;</span>
                                                </>
                                            ) : 'Submit'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        {loadingComments ? (
                            <div className="flex items-center justify-center">
                                <span className="loading loading-lg"></span>
                            </div>
                        ) : postComments.length === 0 ? (
                            <p>No comments found.</p>
                        ) : (
                            <CommentList comments={postComments} />
                        )}
                    </div>
                </>
            )}
        </div>
    ); 
}