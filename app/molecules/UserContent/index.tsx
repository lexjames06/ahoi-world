"use client";
import { User } from "@ahoi-world/types/UserTypes";
import { AlbumGrid } from "./AlbumGrid";
import { BlogGrid } from "./BlogGrid";
import { PlaylistGrid } from "./PlaylistGrid";
import { PlaylistsGrid } from "./PlaylistsGrid";
import { ContentPage } from "@ahoi-world/organisms/user-profile/user-profile";
import { useCallback, useEffect, useState } from "react";
import { Video } from "@ahoi-world/types/Video";
import { useSearchParams } from "next/navigation";
import { getUserPlaylistData } from "@ahoi-world/lib/playlists";
import styles from "./UserContent.module.scss";

type Props = {
  owner: boolean;
  user: User;
  activePage: ContentPage | null;
  setCurrent: React.Dispatch<React.SetStateAction<Video | null>>;
}

export function UserContent({ owner, user, activePage, setCurrent }: Props) {
  const searchParams = useSearchParams();
  const searchedPlaylist = searchParams.get("playlist");

  const [activePlaylist, setActivePlaylist] = useState<string>("");
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentlyPlaying, setPlaying] = useState<string>("");

  const selectVideo = useCallback((id: string) => {
		if (currentlyPlaying !== id) {
      const currentVideo = videos.find((video) => video.id === id) ?? null;
			setPlaying(id);
      setCurrent(currentVideo);
		}
	}, [currentlyPlaying]);

  const loadVideos = useCallback(async (id: string) => {
    const { videos: videoList } = await getUserPlaylistData(id);
    setVideos(videoList);
    setLoadingVideos(false);
  }, []);

  useEffect(() => {
    if (activePlaylist !== searchedPlaylist) {
      
      if (!!searchedPlaylist) {
        loadVideos(searchedPlaylist);
        setActivePlaylist(searchedPlaylist);
      } else {
        setActivePlaylist("");
        setVideos([]);
      }
    }
  }, [searchedPlaylist, activePlaylist, loadVideos]);

  if (activePage === ContentPage.ALBUMS) {
    return (
      <div className={styles.contentGrid}>
        <AlbumGrid />
      </div>
    );
  }

  if (activePage === ContentPage.BLOGS) {
    return (
      <div className={styles.contentGrid}>
        <BlogGrid user={user} />
      </div>
    );
  }

  if (activePage === ContentPage.PLAYLISTS && !activePlaylist) {
    return (
      <div className={styles.contentGrid}>
        <PlaylistsGrid user={user} owner={owner} />
      </div>
    );
  }

  if (activePage === ContentPage.PLAYLISTS && !!activePlaylist) {
    return (
      <div className={styles.contentGrid}>
        <PlaylistGrid
          user={user}
          owner={owner}
          playlist={activePlaylist}
          videos={videos}
          loading={loadingVideos}
          currentlyPlaying={currentlyPlaying}
          selectVideo={selectVideo}
        />
      </div>
    );
  }

  return null;
}