export interface BlogPost {
  id: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  author: string;
  authorRole: string;
} 