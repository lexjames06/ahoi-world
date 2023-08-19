"use client";
import { User, UserPlaylist } from "@ahoi-world/types/UserTypes";
import styles from "./PlaylistGrid.module.scss";
import { PlaylistTile, SeedButton } from "@ahoi-world/atoms";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getImage } from "@ahoi-world/lib/utils/get-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video } from "@ahoi-world/types/Video";
import { getUserPlaylistData } from "@ahoi-world/lib/playlists";
import { SkeletonModule } from "@ahoi-world/templates/SkeletonPage";
import { useCurrentPlaylistContext } from "@ahoi-world/providers/CurrentPlaylist";

type Props = {
	user: User;
	owner: boolean;
	playlist: string;
	videos: Video[];
	loading: boolean;
};

export function PlaylistGrid({ user, owner, playlist, videos, loading }: Props) {
	const pathname = usePathname();
	const { currentVideoId, selectVideo } = useCurrentPlaylistContext();

	if (!playlist) {
		const playlistsUrl = pathname.split("&playlist")[0];
		return (
			<div className={styles.noData}>
				<span className={styles.noPlaylists}>It looks like there`&apos;`s no playlist here</span>
				{owner && (
					<span className={styles.noPlaylists}>
						Why not go back to your other playlists and add one if you haven&apos;t yet?
					</span>
				)}
				{!owner && (
					<span className={styles.noPlaylists}>
						Why not see if <span className={styles.name}>@{user.username}</span> has any other playlists?
					</span>
				)}
				<Link href={playlistsUrl}>Go to Playlists</Link>
			</div>
		);
	}

	if (loading) {
		return (
			<SkeletonModule>
				<section className={styles.grid}>
					{Array.from(Array(9)).map((_, index) => (
						<span key={index} className={styles.card}>
							<span className={styles.loadingTile} />
						</span>
					))}
				</section>
			</SkeletonModule>
		);
	}

	const name = user.playlists.find((list) => list.id === playlist)?.name;

	return (
		<div className={styles.playlist}>
			<h2>{name}</h2>
			<div className={styles.tiles}>
				<div className={styles.grid}>
					{videos.length > 0 &&
						videos.map((video) => (
							<span key={video.id} className={styles.card}>
								<PlaylistTile
									video={video}
									selected={currentVideoId === video.id}
									idle={!!currentVideoId && currentVideoId !== video.id}
									selectVideo={selectVideo}
								/>
							</span>
						))}
				</div>
				<span className={styles.listEnd}>You&apos;ve reached the end of the playlist</span>
			</div>
		</div>
	);
}
