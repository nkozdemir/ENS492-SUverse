import { User, Category, Post, CommentLike } from "@prisma/client";

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
  editedAt: Date;
  likeCount: number; 
  commentCount: number;
  isDeleted: boolean;
  isLiked: boolean;
}

export interface PostValues {
  id: string;
  userId: string;
  postId: string;
  post: PostDetailValues;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date;
  comments?: CommentValues[];
}

export interface CategoryValues {
  id: string;
  name: string;
}

export interface UserValues {
  bio: string;
  createdAt: string;
  email?: string; 
  id: string;
  name: string;
  password: string;
  profilePic: string;
  tag: string;
  updatedAt: string;
  username: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface CommentValues {
  id: string;
  user: User;
  userId: string;
  post: Post;
  postId: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date;
  parent?: CommentValues;
  parentId?: string;
  children: CommentValues[];
  likes: CommentLike[];
  likeCount: number;
  isLiked: boolean;
  isDeleted: boolean;
}