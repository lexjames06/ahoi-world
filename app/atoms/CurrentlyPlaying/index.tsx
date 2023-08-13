"use client";
import Youtube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import styles from "./CurrentlyPlaying.module.scss";
import { useEffect, useState } from "react";
import { Video } from "@ahoi-world/types/Video";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import Image from "next/image";
import { LoadingSpinner } from "../LoadingSpinner";

type Props = {
  currentVideo: Video;
}

type PlayerInfo = {
  title?: string;
  author?: string;
};

export function CurrentlyPlaying({ currentVideo }: Props) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({});
  const [playing, setPlaying] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const tickerInfo = !!playerInfo.title || !!playerInfo.author
    ? `${playerInfo.title} | ${playerInfo.author}`
    : null;

  console.log({tickerInfo});
  console.log({length: tickerInfo?.length});

  function onPlayerReady(event: YouTubeEvent) {
    const youtubePlayer = event.target;

    setPlayer(youtubePlayer);

    const videoData = youtubePlayer.getVideoData();
    setPlayerInfo({
      title: videoData.title,
      author: videoData.author,
    });
  }

  function updatePlayerInfo(currentInfo: PlayerInfo) {
    const newInfo: PlayerInfo = {};

    if (!currentInfo.author) {
      const videoData = player.getVideoData();
      if (videoData.author) {
        newInfo.author = videoData.author;
      }
    }

    if (!currentInfo.title) {
      const videoData = player.getVideoData();
      if (videoData.title) {
        newInfo.title = videoData.title;
      }
    }
    
    setPlayerInfo({ ...currentInfo, ...newInfo });
  }

  function onPlayerStateChange(event: any) {
    if (!playerInfo.title || !playerInfo.author) {
      updatePlayerInfo(playerInfo);
    }

    if ([-1, 0, 2, 5].includes(event.data)) {
      setPlaying(false);
    } else if (event.data === 1) {
      setPlaying(true);
    }

    if (event.data === 3 && !loading) {
      setLoading(true);
    } else if (event.data !== 3 && loading) {
      setLoading(false);
    }
  }

  function playVideo() {
    if (!!player) {
      player.playVideo();
    }
  }

  function stopVideo() {
    if (!!player) {
      player.stopVideo();
    }
  }

  function pauseVideo() {
    if (!!player) {
      player.pauseVideo();
    }
  }

  function togglePlaying() {
    if (playing) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideo]);

  return (
    <div className={styles.container} data-playing={playing}>
      <div className={styles.video}>
        <Youtube
          videoId={currentVideo.id}
          opts={{
            height: "200",
            width: "200",
            playerVars: {
              controls: 0,
              modestbranding: 1,
              autoplay: 1,
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          style={{ display: "none" }}
        />
      </div>
      <span className={styles.thumbnail}>
        <Image src={currentVideo.thumbnail} alt="Currently Playing" fill={true} />
      </span>
      <div className={styles.detailsTicker}>
        {tickerInfo && (
          <div className={styles.ticker} data-playing={playing}>
            <span  className={styles.details}>{playerInfo.title} | {playerInfo.author}</span>
            <span  className={styles.details}>{playerInfo.title} | {playerInfo.author}</span>
          </div>
        )}
      </div>
      <button className={styles.playPause} disabled={loading} onClick={togglePlaying}>
        {loading ? <LoadingSpinner /> : playing ? <GiPauseButton /> : <GiPlayButton />}
      </button>
    </div>
  );
}