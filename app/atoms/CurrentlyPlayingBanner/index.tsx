"use client";
import { useState } from "react";
import Image from "next/image";
import { PlaylistRepeat, useCurrentPlaylistContext } from "@ahoi-world/providers/CurrentPlaylist";
import { ReactIcons } from "@ahoi-world/atoms";
import { LoadingSpinner } from "../LoadingSpinner";
import styles from "./CurrentlyPlayingBanner.module.scss";
import { usePathname } from "next/navigation";

export function CurrentlyPlayingBanner() {
	const {
		author,
		title,
		thumbnail,
		playing,
		loadingVideo,
		shuffled,
		repeat,
		canGoBack,
		canGoForward,
		currentVideoId,
		togglePlaying,
		toggleShuffle,
		toggleRepeat,
		nextVideo,
		previousVideo,
	} = useCurrentPlaylistContext();
	const pathname = usePathname();

	const tickerInfo = !!title || !!author ? `${title} | ${author}` : null;
	const userPage = pathname.startsWith("/users/");
	console.log({pathname})
	console.log({userPage})
	console.log({repeat})

	if (!currentVideoId || userPage) {
		return null;
	}

	return (
		<div className={styles.container} data-playing={playing}>
			<span className={styles.thumbnail}>
				<Image src={thumbnail ?? ""} alt="Currently Playing" fill={true} />
			</span>
			<div className={styles.innerContainer}>
				<div className={styles.detailsTicker}>
					{tickerInfo && (
						<div className={styles.ticker} data-playing={playing}>
							<span className={styles.details}>
								{title} | {author}
							</span>
							<span className={styles.details}>
								{title} | {author}
							</span>
						</div>
					)}
				</div>

				<div className={styles.controls}>
					<button className={styles.control} data-operation="previous" disabled={!canGoBack} onClick={previousVideo}>
						<ReactIcons.GiPreviousButton />
					</button>
					<button
						className={styles.control}
						data-operation="repeat"
						data-off={repeat === PlaylistRepeat.NONE}
						onClick={toggleRepeat}
					>
						{repeat === PlaylistRepeat.ONE ? <ReactIcons.PiRepeatOnceBold /> : <ReactIcons.PiRepeatBold />}
					</button>
					<button className={styles.control} data-operation="play-pause" disabled={loadingVideo} onClick={togglePlaying}>
						{loadingVideo ? (
							<LoadingSpinner scale={0.5} />
						) : playing ? (
							<ReactIcons.GiPauseButton />
						) : (
							<ReactIcons.GiPlayButton />
						)}
					</button>
					<button className={styles.control} data-operation="shuffle" data-off={!shuffled} onClick={toggleShuffle}>
						<ReactIcons.PiShuffleBold />
					</button>
					<button className={styles.control} data-operation="next" disabled={!canGoForward} onClick={nextVideo}>
						<ReactIcons.GiNextButton />
					</button>
				</div>
			</div>
		</div>
	);
}
