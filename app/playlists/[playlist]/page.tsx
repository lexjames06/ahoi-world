import { notFound } from "next/navigation";
import { getSortedFirebasePlaylistData, getSortedFirebasePlaylistsData } from "@ahoi-world/lib/playlists";
import PlayerPage from "@ahoi-world/pages/playlist/player-page";
import styles from "./page.module.scss";
import Link from "next/link";

export async function generateStaticParams() {
	const playlists = await getSortedFirebasePlaylistsData();

	return playlists.map((playlist) => ({
		playlist,
	}));
}

export async function generateMetadata({ params }: { params: { playlist: string } }) {
	const { playlist } = params;

	if (!playlist) {
		return {
			title: "Playlist Not Found",
			descritption: "The playlist you are looking for does not exist",
		};
	}

	const title = `${playlist} playlist`;
	const description = `${playlist} playlist to play in the background`;

	return {
		alternates: {
			canonical: `/playlists/${playlist}`,
		},
		title: title,
		description: description,
		twitter: {
			card: "summary_large_image",
			title: title,
			description: description,
			creator: "@seaj_ahoi",
		},
		// openGraph: {
		// 	title: post.title,
		// 	description: post.description,
		// 	siteName: 'AHOI',
		// 	locale: 'en_GB',
		// 	type: 'website',
		// },
	};
}

export default async function Playlist({ params }: { params: { playlist: string } }) {
	const { playlist } = params;
	const { playlist: paylistName, videos } = await getSortedFirebasePlaylistData(playlist);

	if (videos && videos.length < 1) {
		return (
			<main className={styles.noData}>
				<span className={styles.noPlaylists}>Sorry, we don't have a <span className={styles.name}>{playlist}</span> playlist</span>
				<span className={styles.noPlaylists}>Why not check out what we do have?</span>
				<Link href="/playlists">Go to playlists</Link>
			</main>
		);
	}

	return (
		<PlayerPage videos={videos} />
	);
}
