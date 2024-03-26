import { Post } from '@/types/interfaces';
import { MdDelete } from "react-icons/md";

interface PostCardProps {
  post: Post;
  onDelete: (postId: Post["id"]) => void; 
}

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
};

const CustomPostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  return (
    <div className="shadow overflow-hidden sm:rounded-lg my-4">
      <div className="bg-base-300 px-4 py-5 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="avatar placeholder mr-4">
            <div className="bg-neutral text-neutral-content rounded-full w-16">
              <span className="text-3xl">{post.user.name[0]}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium leading-6">{post.title}</h3>
            <p className="mt-1 max-w-2xl text-sm">{post.user.name} - {formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className="inline-flex items-center btn btn-error btn-circle"
        >
          <MdDelete size={20}/>
        </button>
      </div>
      <div className="border-t">
        <dl>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dd className="mt-1 text-sm sm:col-span-2">{post.content}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default CustomPostCard;
