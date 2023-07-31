import { storage } from "@/firebase/app";
import { firebaseConfig } from "@/firebase/config";
import { getDownloadURL, ref } from "firebase/storage";

export const getImage = (url: string): string => {
	// return await printUrl(url);
	const path = url.replace(/\//g, "%2F");
	if (process.env.NODE_ENV === "development") {
		return `http://localhost:9199/v0/b/${firebaseConfig.storageBucket}/o/images${path}?alt=media`;
	}
	return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/images${path}?alt=media`;
};

async function printUrl(url: string) {
	return getDownloadURL(ref(storage, `images/${url}`))
		.then((url) => url);
}