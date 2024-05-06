"use server"
import { utapi } from "../server/uploadthing";

export const removeImage = async (imageKey: string) => {
    try {
        await utapi.deleteFiles(imageKey);
        return { success: true}
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false }
    }
}