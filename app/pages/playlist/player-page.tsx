"use client";
import { Page } from "@ahoi-world/templates";
import { useCallback, useState } from "react";
import { CurrentlyPlaying, PlaylistTile } from "@ahoi-world/atoms";
import { Video } from "@ahoi-world/types/Video";
import styles from "./player-page.module.scss";

type Props = {
  videos: Video[];
};

export default function PlayerPage({ videos }: Props) {
	const [currentlyPlaying, setPlaying] = useState<string>("");

	const selectVideo = useCallback((id: string) => {
		if (currentlyPlaying !== id) {
			setPlaying(id);
		}
	}, []);

  const currentVideo = videos.find((video) => video.id === currentlyPlaying);

	return (
		<Page className={styles.page}>
			<div className={styles.container} data-playing={!!currentVideo}>
				{currentVideo && <CurrentlyPlaying currentVideo={currentVideo} />}
        <div className={styles.tileContainer}>
          <div className={styles.tiles}>
            {videos.map((video) => (
              <PlaylistTile
                key={video.id}
                video={video}
                playing={currentlyPlaying === video.id}
                idle={!!currentlyPlaying && currentlyPlaying !== video.id}
                selectVideo={selectVideo}
              />
            ))}
          </div>
        </div>
			</div>
		</Page>
	);
}
