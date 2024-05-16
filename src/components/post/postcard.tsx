import { PostDetailValues } from '@/types/interfaces';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import UserProfilePicture from '../userProfilePicture';

interface PostCardProps {
  post: PostDetailValues;
  onLike: (post: PostDetailValues) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const renderShortenedContent = (content: string, maxLength: number) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + "...";
    }
    return content;
  };

  return (
    <div className="shadow-xl overflow-hidden rounded-lg my-4 relative">
      <div className="bg-base-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className='mr-2'>
            <Link href={`/user/${post.userId}`}>
              <UserProfilePicture imageUrl={post.user.profilePic} size={50} />
            </Link>
          </div>
          <div className="text-md">
            <div className="flex items-center lg:space-x-8 space-x-4 mb-1 mt-1">
              <h3 className="text-lg font-semibold leading-5 mr-2">
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </h3>
              
            </div>
            <div className='bg-primary-content rounded-full text-center mb-1 mt-2 px-4'>
              <Link href={`/category/${post.categoryId}/${post.category.name}`} className="text-sm font-bold">
                {post.category.name}
              </Link>
            </div>
            <div className="flex items-center lg:space-x-8 space-x-4 mb-1">
              <Link href={`/user/${post.userId}`} className="text-sm font-medium">
                  {post.user.name} (@{post.user.username})
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary">
        <dl>
          <div className="p-2 mx-2">
            <dd className="mt-1 text-md">
              <Link href={`/post/${post.id}`}>
                {renderShortenedContent(post.content, 75)}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mx-4 flex items-center justify-between border-t border-primary">
        <div className="flex space-x-2 items-center"> 
          <button 
            className='inline-flex btn btn-ghost btn-circle text-sm'
            onClick={() => {
              onLike(post);
            }}
          >
            {post.isLiked ? <BiSolidLike size={18} /> : <BiLike size={18}/>}
            <span className="ml-1">{post.likeCount}</span>
          </button>
          <Link href={`/post/${post.id}`} className='inline-flex btn btn-ghost btn-circle text-sm'>
            <div className='flex flex-row space-x-2'>
              <FaRegComment size={18}/>
              <span className="ml-1">{post.commentCount}</span>
            </div>
          </Link>
        </div>
        <div className="text-sm">{formatDate(post.createdAt)}</div>
      </div>
    </div>
  );
};

export default PostCard;
