import { DocumentData, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@ahoi-world/firebase/app";
import { getImage } from "./utils/get-image";
import type { Video } from "@ahoi-world/types/Video";

interface PlaylistData {
	videos: Video[];
	playlist: string;
}

function convertFirestoreVideoToVideo(doc: DocumentData) {
	const data = doc.data();

	const thumbnail = getImage(data.thumbnail ?? "");

	const video: Video = {
		id: data.id,
		thumbnail,
		playlist: data.playlist,
	};

	return video;
}

const SORT_ORDER = "desc";

export async function getSortedFirebasePlaylistData(playlist?: string): Promise<PlaylistData> {
	const musicVideosRef = collection(firestore, "playlists");
	const clause = playlist ? where("playlist", "==", playlist) : null;
	const q = clause ? query(musicVideosRef, clause) : query(musicVideosRef);

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
		playlist: playlist ?? "",
	};
}

export async function getSortedFirebasePlaylistsData(): Promise<string[]> {
	const playlistsDoc = doc(firestore, "playlists", "all");
	const document = await getDoc(playlistsDoc);
	const playlists = document.data()?.list ?? [];

	return playlists;
}
