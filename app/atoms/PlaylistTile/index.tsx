"use client";
import Youtube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import styles from "./PlaylistTile.module.scss";
import { useCallback, useEffect, useState } from "react";
import { Video } from "@ahoi-world/types/Video";
import Image from "next/image";

type Props = {
  video: Video;
  playing: boolean;
  idle: boolean;
  selectVideo: (id: string) => void;
}

export function PlaylistTile({ video, playing, idle, selectVideo }: Props) {
  const togglePlaying = () => {
    if (!playing) {
      selectVideo(video.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button className={styles.container} data-playing={playing} data-idle={idle} onClick={togglePlaying}>
      <Image src={video.thumbnail} alt="Lofi Music" fill={true} />
    </button>
  );
}
