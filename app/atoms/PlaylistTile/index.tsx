"use client";
import styles from "./PlaylistTile.module.scss";
import { Video } from "@ahoi-world/types/Video";
import Image from "next/image";

type Props = {
	video: Video;
	selected: boolean;
	idle: boolean;
	selectVideo: (video: Video, userSelected?: boolean) => void;
};

export function PlaylistTile({ video, selected, idle, selectVideo }: Props) {
	const handleClick = () => {
		if (!selected) {
			selectVideo(video, true);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<button className={styles.container} data-playing={selected} data-idle={idle} onClick={handleClick}>
			<Image src={video.thumbnail} alt={`${video.playlistName} music`} fill={true} />
		</button>
	);
}
