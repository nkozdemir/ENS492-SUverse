import { useState } from 'react';
import { NotificationValues, PostValues, CommentValues } from '@/types/interfaces';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { NotificationType } from '@/types/interfaces';
import { FaCircle } from 'react-icons/fa';
import { FiCircle } from 'react-icons/fi';

interface NotificationCardProps {
  notification: NotificationValues;
  showAll: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, showAll }) => {
//   const [showAll, setShowAll] = useState<boolean>(true);

  const renderContent = () => {
    switch (notification.type) {
      case NotificationType.FOLLOW:
        return (
          <span className="text-sm">started following you</span>
        );
      case NotificationType.POSTLIKE:
        return (
          <span className="text-sm">
            liked your <Link href={`/post/${notification.postId}`}><span className="font-semibold">post</span></Link>
          </span>
          );
      case NotificationType.COMMENTLIKE:
        return (
          <span className="text-sm">
            liked your <Link href={`/post/${notification.postId}`}><span className="font-semibold">comment</span></Link>
            <span>  "{notification.comment?.content}" :</span>
          </span>
        );
      case NotificationType.POSTREPLY:
        return (
          <span className="text-sm">
            replied to your <Link href={`/post/${notification.postId}`}><span className="font-semibold">post</span></Link>:
          </span>
        );
      case NotificationType.COMMENTREPLY:
        return (
          <span className="text-sm">
            replied to your <Link href={`/post/${notification.postId}`}><span className="font-semibold">comment</span></Link>
            <span>  "{notification.comment?.parent.content}" :</span>
          </span>
            
        );
      default:
        return '';
    }
  };

  const renderContentBox = (content: string) => {
    return (
      <div className="bg-gray-100 p-2 mt-2 rounded-md">
        <span className="text-sm">{content}</span>
      </div>
    );
  };

  // Filter notifications based on showAll state
  if (!showAll && notification.isRead) {
    return null;
  }

  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 mb-4 ${notification.isRead ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href={`/user/${notification.notifierId}`}>
            <span>
              <div className="rounded-full overflow-hidden bg-gray-200">
                <img
                  src={notification.notifier.profilePic || '/default-profile-img.png'}
                  alt={notification.notifier.name}
                  className="w-10 h-10 object-cover"
                />
              </div>
            </span>
          </Link>
          <div>
            <Link href={`/user/${notification.notifierId}`}>
              <span className="font-semibold">{notification.notifier.name}</span>
              <span className="text-gray-500 text-sm"> @{notification.notifier.username}</span>
            </Link>
            <span className="text-gray-500 text-sm mx-1"> ~ </span>
            {renderContent()}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!notification.isRead? <FaCircle className="text-blue-500" /> : <FiCircle className="text-gray-500" />}
          <span className="text-gray-500 text-sm">{formatDate(notification.createdAt)}</span>
        </div>
      </div>
      {notification.comment?.parent && renderContentBox(notification.comment.parent.content)}
    </div>
  );
};

export default NotificationCard;