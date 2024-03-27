import { User, Category, Like } from "@prisma/client";

export interface Post {
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