"use client";
import React, { useCallback, useEffect, useState } from "react";
import Youtube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useSearchParams } from "next/navigation";
import { getUserPlaylistData } from "@ahoi-world/lib/playlists";
import type { Video } from "@ahoi-world/types/Video";

export enum VideoState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
}

export enum PlaylistRepeat {
  ALL = "all",
  NONE = "none",
  ONE = "one",
}

type CurrentPlaylistValues = {
  currentVideoId?: string;
  currentPlaylist?: string;
  videos: Video[];
  author?: string;
  title?: string;
  thumbnail?: string;
  playing: boolean;
  repeat: PlaylistRepeat;
  shuffled: boolean;
  loadingVideo: boolean;
  loadingVideos: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  nextVideo: () => void;
  previousVideo: () => void;
  selectVideo: (video: Video, userSelected?: boolean) => void;
  togglePlaying: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
};

const defaultCurrentPlaylistValues = {
  videos: [],
  playing: false,
  repeat: PlaylistRepeat.NONE,
  shuffled: false,
  loadingVideo: false,
  loadingVideos: false,
  canGoBack: false,
  canGoForward: false,
  nextVideo: () => {},
  previousVideo: () => {},
  togglePlaying: () => {},
  toggleRepeat: () => {},
  selectVideo: () => {},
  toggleShuffle: () => {},
}

export const CurrentPlaylistContext = React.createContext<CurrentPlaylistValues>(defaultCurrentPlaylistValues);

export const useCurrentPlaylistContext = () => React.useContext(CurrentPlaylistContext);

export const CurrentPlaylistContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  // Player
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<PlaylistRepeat>(PlaylistRepeat.NONE);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  
  // Current Video Details
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>();
  const [author, setAuthor] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  
  // Current Playlist Details
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<string | undefined>();
  
  let backToBeginning = false;

  setTimeout(() => {
    backToBeginning = true;
  }, 5000);

  const loadVideos = useCallback(async (id: string) => {
    const { videos: videoList } = await getUserPlaylistData(id);
    return videoList;
  }, []);

  function nextVideo() {
    setLoadingVideo(true);

    if (repeat === PlaylistRepeat.ONE) {
      restartVideo();
      return;
    }

    const currentIndex = videos.findIndex((video) => video.id === currentVideoId);
    const nextIndex = currentIndex + 1 === videos.length ? 0 : currentIndex + 1;

    if (repeat === PlaylistRepeat.NONE && nextIndex === 0) {
      stopVideo();
      return;
    }

    if (!canGoBack) {
      setCanGoBack(true);
    }

    if (nextIndex === videos.length - 1 && canGoForward) {
      setCanGoForward(false);
    }

    const nextUp = videos[nextIndex];
    selectVideo(nextUp);
  }

  function previousVideo() {
    setLoadingVideo(true);

    if (repeat === PlaylistRepeat.ONE || backToBeginning) {
      restartVideo();
      return;
    }

    const currentIndex = videos.findIndex((video) => video.id === currentVideoId);
    const nextIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;

    if (repeat === PlaylistRepeat.NONE && nextIndex === 0 && canGoBack) {
      setCanGoBack(false);
    }

    if (!canGoForward) {
      setCanGoForward(true);
    }

    const nextUp = videos[nextIndex];
    selectVideo(nextUp);
  }

  function toggleRepeat() {
    switch (repeat) {
      case PlaylistRepeat.NONE:
        if (!canGoBack) {
          setCanGoBack(true);
        }
        if (!canGoForward) {
          setCanGoForward(true);
        }
        setRepeat(PlaylistRepeat.ALL);
        return;
      case PlaylistRepeat.ALL:
        if (!canGoBack) {
          setCanGoBack(true);
        }
        if (!canGoForward) {
          setCanGoForward(true);
        }
        setRepeat(PlaylistRepeat.ONE);
        return;
      case PlaylistRepeat.ONE:
        const currentIndex = videos.findIndex((video) => video.id === currentVideoId);
        if (currentIndex === 0 && canGoBack) {
          setCanGoBack(false);
        }
        if (currentIndex === videos.length - 1 && canGoForward) {
          setCanGoForward(false);
        }
        setRepeat(PlaylistRepeat.NONE);
        return;
    }

    return repeat satisfies never;
  }

  function shuffleVideos(videoList: Video[]) {
    const shuffledVideosList = [];
    const oldVideosList = videoList;

    for (let i = oldVideosList.length; i > 0; i--) {
      const j = Math.floor(Math.random() * (i));
      const [removed] = oldVideosList.splice(j, 1);
      shuffledVideosList.push(removed);
    }

    return shuffledVideosList;
  };

  function toggleShuffle() {
    const previous = shuffled;

    if (previous) {
      const videosToOrder = videos;
      videosToOrder.sort((a, b) => a.id > b.id ? -1 : 1);
      setVideos(videosToOrder);
      setShuffled(false);
      return;
    }

    const shuffledVideosList = shuffleVideos(videos);

    setVideos(shuffledVideosList);
    setShuffled(true);
  }

  async function selectVideo(video: Video, userSelected: boolean = false) {
    if (!loadingVideo) {
      setLoadingVideo(true);
    }

    let videoList = [];
    const shouldLoadVideos = !videos.length || videos[0].playlistId !== video.playlistId;
    const shouldReorderVideos = userSelected || shouldLoadVideos;

    if (shouldLoadVideos) {
      setLoadingVideos(true);
      const loadedVideos = await loadVideos(video.playlistId);
      loadedVideos.sort((a, b) => a.id > b.id ? -1 : 1);
      videoList.push(...loadedVideos);
    }

    if (shouldReorderVideos) {
      if (shuffled) {
        videoList = shuffleVideos(videoList);
      }

      const first = videoList.findIndex((item) => item.id === video.id);
      // Set the first video to the one we clicked on
      videoList = videoList.slice(first).concat(videoList.slice(0, first));
    }

    if (userSelected) {
      if (repeat === PlaylistRepeat.NONE && canGoBack) {
        setCanGoBack(false);
      }
  
      // investigate why this isn't always happeneing
      // recreate: select video, repeat all, back, shuffle, repeat none, select video
      if (!canGoForward && videoList.length > 1) {
        setCanGoForward(true);
      }
    }

    if (shouldLoadVideos || shouldReorderVideos) {
      setVideos(videoList);
      setLoadingVideos(false);
    }

    if (currentPlaylist !== video.playlistId) {
      setCurrentPlaylist(video.playlistId);
    }

    setCurrentVideoId(video.id);
    setThumbnail(video.thumbnail);
  }

  function onPlayerReady(event: YouTubeEvent) {
    const youtubePlayer = event.target;
    youtubePlayer.seekTo(0);

    console.log("reading")

    setPlayer(youtubePlayer);

    const videoData = youtubePlayer.getVideoData();
    setAuthor(videoData.author);
    setTitle(videoData.title);
  }

  function onPlayerStateChange(event: any) {
    const videoData = player.getVideoData();

    if (!author && videoData.author) {
      setAuthor(videoData.author);
    }

    if (!title && videoData.title) {
      setTitle(videoData.title);
    }

    switch(event.data) {
      case VideoState.PAUSED:
      case VideoState.VIDEO_CUED:
        if (playing) {
          setPlaying(false);
        }
        break;
      case VideoState.PLAYING:
        if (!playing) {
          setPlaying(true);
        }
        break;
    }

    if (event.data === VideoState.UNSTARTED) {
      console.log("restarting");
      restartVideo();
    }

    if (event.data === VideoState.ENDED) {
      nextVideo();
    }

    if (event.data === VideoState.BUFFERING && !loadingVideo) {
      setLoadingVideo(true);
    } else if (event.data !== VideoState.BUFFERING && loadingVideo) {
      setLoadingVideo(false);
    }
  }

  function restartVideo() {
    if (!!player) {
      player.seekTo(0);
    }
    
    if (!playing) {
      playVideo();
    }

    if (loadingVideo) {
      setLoadingVideo(false);
    }
  }

  function playVideo() {
    if (!!player) {
      setPlaying(true);
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
      setPlaying(false);
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

  return (
    <CurrentPlaylistContext.Provider value={{
      loadingVideo,
      playing,
      shuffled,
      repeat,
      currentVideoId,
      author,
      title,
      thumbnail,
      loadingVideos,
      videos,
      currentPlaylist,
      canGoBack,
      canGoForward,
      nextVideo,
      previousVideo,
      togglePlaying,
      toggleRepeat,
      toggleShuffle,
      selectVideo,
    }}>
      {children}
      <div style={{display: "none"}}>
        <Youtube
          videoId={currentVideoId}
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
    </CurrentPlaylistContext.Provider>
  );
}