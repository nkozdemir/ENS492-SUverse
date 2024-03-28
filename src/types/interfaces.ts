import { User, Category, Like, Post } from "@prisma/client";

export interface PostValues {
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
  likes: Like[]; 
  likeCount: number; 
}

export interface CategoryValues {
  id: string;
  name: string;
}

export interface LikeValues {
  id: string;
  userId: string;
  postId: string;
  post: Post;
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