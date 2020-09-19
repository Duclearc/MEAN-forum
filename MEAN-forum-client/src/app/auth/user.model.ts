export interface User {
  username: string;
  email: string;
  password: string;
  imgPath: string;
}

export type UserLoginData = Omit<User, 'username' | 'imgPath'>;

export interface UserProfileData {
  id: string;
  username: string;
  imgPath: string;
}
