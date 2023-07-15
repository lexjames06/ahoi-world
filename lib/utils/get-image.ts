import { firebaseConfig } from "@/firebase/config";

export const getImage = (url: string) => {
	const path = url.replace(/\//g, "%2F");
	return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/images${path}?alt=media`;
};