export interface BlogPost {
  id: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  content?: {
    introduction: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export interface BlogPostDetail extends Omit<BlogPost, 'content'> {
  content: string;
  author: string;
  authorRole: string;
} 