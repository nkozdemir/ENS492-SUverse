import { PostDetailValues } from '@/types/interfaces';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface PostCardProps {
  post: PostDetailValues;
  onLike: (post: PostDetailValues) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  return (
    <div className="shadow-xl overflow-hidden sm:rounded-lg my-4 relative">
      <div className="bg-base-200 px-4 py-5 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="avatar placeholder mr-4">
            <div className="rounded-full border w-12">
              <Link href={`/user/${post.userId}`}>
                <Image src={'/default-profile-img.png'} alt={post.user.name} width={48} height={48} className="rounded-full" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium leading-6">{post.title}</h3>
            <Link href={`/user/${post.userId}`} className="mt-1 max-w-2xl text-sm">
              {post.user.name} @{post.user.username}
            </Link>
            <br />
            <Link href={`/category/${post.categoryId}/${post.category.name}`} className='mt-1 max-w-2xl text-sm font-bold'>
              {post.category.name}
            </Link>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className='inline-flex btn btn-ghost btn-circle'
            onClick={() => {
              onLike(post);
            }}
          >
            {post.isLiked ? <BiSolidLike size={20} /> : <BiLike size={20}/>}
            {post.likeCount}
          </button>
          <Link href={`/post/${post.id}`} className='inline-flex btn btn-ghost btn-circle'>
            <FaRegComment size={20}/>
            {post.commentCount}
          </Link>
        </div>
      </div>
      <div className="border-t">
        <dl>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dd className="mt-1 text-sm sm:col-span-2">
              <Link href={`/post/${post.id}`}>
                {post.content}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
      <div className="absolute bottom-2 right-2 text-sm">{formatDate(post.createdAt)}</div>
    </div>
  );
};

export default PostCard;