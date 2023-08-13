import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@ahoi-world/firebase/app";
import { getImage } from "./utils/get-image";
import type { Video } from "@ahoi-world/types/Video";

interface PlaylistData {
	videos: Video[];
	playlistId: string;
}

function convertFirestoreVideoToVideo(doc: DocumentData) {
	const data = doc.data();

	const thumbnail = getImage(data.thumbnail ?? "");

	const video: Video = {
		id: data.id,
		thumbnail,
		playlistId: data.playlistId,
		playlistName: data.playlistName,
	};

	return video;
}

const SORT_ORDER = "desc";

export async function getUserPlaylistData(playlistId: string): Promise<PlaylistData> {
	const musicVideosRef = collection(firestore, "music-videos");
	const q = query(musicVideosRef,  where("playlistId", "==", playlistId));

	const videos: Video[] = [];

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		const post = convertFirestoreVideoToVideo(doc);
		videos.push(post);
	});

	// Sort by date
	videos.sort((a, b) => a.id > b.id ? (SORT_ORDER === "desc" ? -1 : 1) : (SORT_ORDER === "desc" ? 1 : -1));

	return {
		videos,
		playlistId,
	};
}
