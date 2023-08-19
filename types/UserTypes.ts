import { UUIDV4 } from "./GeneralTypes";

export type UserProfileOptions = {
  showEmailButton: boolean;
  showHeadline: boolean;
}

export type UserPlaylist = {
  id: string;
  name: string;
  thumbnail: string;
};

export type User = {
  id: UUIDV4<User>;
  uid: string;
  username: string | null;
  email: string | null;
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  photoURL: string | null;
  backgroundImagePath: string;
  playlists: UserPlaylist[];
  profileOptions: UserProfileOptions;
};
