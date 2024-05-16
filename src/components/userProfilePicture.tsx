import Image from 'next/image';

interface UserProfilePictureProps {
    imageUrl: string;
    size: number;
}

const UserProfilePicture = ({ imageUrl, size }: UserProfilePictureProps) => {
  const defaultImageUrl = '/default-profile-img.png';

  return (
    <div 
      className="rounded-full overflow-hidden border-primary border-2 m-1 flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl || defaultImageUrl}
        alt="Profile"
        width={size}
        height={size}
        priority
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default UserProfilePicture;
