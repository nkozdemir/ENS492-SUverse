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

export interface LikedPostValues {
  id: string;
  userId: string;
  postId: string;
  post: Post;
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