export interface Post {
  _id: string;
  title: string;
  content: string;
  imgPath: string;
  creator: string;
}

export type PostData = Omit<Post, '_id'>;
