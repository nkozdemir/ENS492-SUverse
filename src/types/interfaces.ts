import { User, Category } from "@prisma/client";

export interface Post {
  id: string;
  user: User;
  category: Category;
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}