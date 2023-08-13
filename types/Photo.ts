import { UUIDV4 } from "./GeneralTypes";
import { User } from "./UserTypes";

export type Photo = {
	id: UUIDV4<Photo>;
	path: string;
	caption: string;
	album: string;
	date: Date;
	filename: string;
};

export type PhotoData = Photo & {
	new: boolean;
};

export type AlbumDetails = {
	name: string;
	admins: UUIDV4<User>[],
}