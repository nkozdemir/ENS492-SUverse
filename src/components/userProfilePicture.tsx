import Image from 'next/image';

interface UserProfilePictureProps {
    imageUrl: string;
    size: number;
}

const UserProfilePicture = ({ imageUrl, size }: UserProfilePictureProps) => {
  const defaultImageUrl = '/default-profile-img.png';

  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden border-gray-300 border-2 p-1`}>
      <Image
        src={imageUrl || defaultImageUrl}
        alt="Profile"
        width={size}
        height={size}
        layout="responsive"
        className="object-cover"
        priority
      />
    </div>
  );
};

export default UserProfilePicture;