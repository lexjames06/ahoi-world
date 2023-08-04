import Link from "next/link";
import { getSortedFirebasePostsData } from "@ahoi-world/lib/posts";
import { CategoriesSelector, LargeBlogCard, SeedButton } from "@ahoi-world/atoms";
import { Page } from "@ahoi-world/templates";
import styles from "./page.module.scss";
import { getSortedFirebasePlaylistsData } from "@ahoi-world/lib/playlists";
import { SeedOptions } from "@ahoi-world/types/Seed";

export function generateMetadata() {

	return { title: "Playlists" };
}

export default async function Playlists() {
	const playlists = await getSortedFirebasePlaylistsData();

	if (!playlists.length) {
		return (
			<main className={styles.noData}>
				<span className={styles.noPlaylists}>There are no playlists available at this time</span>
				<SeedButton option={SeedOptions.PLAYLISTS} />
			</main>
		);
	}

	return (
		<Page className={styles.container}>
      {playlists.map((playlist) => (
        <Link key={playlist} href={`/playlists/${playlist}`}>
          <h2>{playlist}</h2>
        </Link>
      ))}
		</Page>
	);
}
