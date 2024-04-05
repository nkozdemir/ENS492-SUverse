import { User, Category } from "@prisma/client";

export interface PostDetailValues {
  id: string;
  user: User;
  userId: string; 
  category: Category;
  categoryId: string; 
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  likeCount: number; 
}

export interface PostValues {
  id: string;
  userId: string;
  postId: string;
  post: PostDetailValues;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryValues {
  id: string;
  name: string;
}

export interface UserValues {
  bio: string;
  createdAt: string;
  email?: string; 
  followers: string[];
  following: string[];
  id: string;
  name: string;
  password: string;
  profilePic: string;
  tag: string;
  updatedAt: string;
  username: string;
}