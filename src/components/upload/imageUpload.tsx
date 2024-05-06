// Import React and useState
import React, { useState } from 'react';
import { UploadButton } from '@/utils/uploadthing';
import Image from 'next/image';
import { removeImage } from '@/app/actions/removeImage'; 

const ImageUpload = ({ onImageUpload }: { onImageUpload: (imageUrl: string) => void }) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageKey, setImageKey] = useState<string>('');

    // Function to handle image upload completion
    const handleImageUploadComplete = (res: any) => {
        console.log("Files:", res);
        const uploadedImageUrl = res[0].url;
        setImageUrl(uploadedImageUrl);
        const uploadedImageKey = res[0].key;
        setImageKey(uploadedImageKey);
        // Call the parent component's function to pass the uploaded image URL
        onImageUpload(uploadedImageUrl);
    };

    // Function to handle image upload error
    const handleImageUploadError = (error: Error) => {
        console.error("Upload error:", error);
        alert("Upload error!");
    };

    const handleRemoveImage = () => {
        removeImage(imageKey);
        // Reset both imageUrl and imageKey to empty strings
        setImageUrl('');
        setImageKey('');
    };

    return (
        <div>            
            {/* Render the uploaded image if imageUrl is not empty */}
            {imageUrl.length ? (
                <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold mb-4">Uploaded image:</p>
                <div className="relative">
                    <Image src={imageUrl} alt="Uploaded image" width={256} height={256} className="rounded-lg" />
                </div>
                <button
                    onClick={handleRemoveImage}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none mt-4"
                >
                    Remove Image
                </button>
            </div>
            
            ) : <UploadButton 
                endpoint='imageUploader' 
                onClientUploadComplete={handleImageUploadComplete}
                onUploadError={handleImageUploadError}
            />
            }
        </div>
    );
}

export default ImageUpload;