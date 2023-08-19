"use client";
import { User, UserPlaylist } from "@ahoi-world/types/UserTypes";
import styles from "./PlaylistsGrid.module.scss";
import { SeedButton } from "@ahoi-world/atoms";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getImage } from "@ahoi-world/lib/utils/get-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContentPage } from "@ahoi-world/organisms/user-profile/user-profile";

type Props = {
	user: User;
  owner: boolean;
};

export function PlaylistsGrid({ user, owner }: Props) {
	const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
	const pathname = usePathname();

	useEffect(() => {
		if ((!playlists && user.playlists?.length) || (playlists.length !== user.playlists?.length)) {
			setPlaylists(user.playlists);
		}
	}, [user, playlists]);

	if (!playlists.length && owner) {
		return (
			<div className={styles.noData}>
				<span className={styles.noPlaylists}>Adding your own playlists will come soon.</span>
				<span className={styles.noPlaylists}>
					For now, why not add our <span className={styles.name}>Lofi</span> playlist.
				</span>
				<SeedButton userId={user.id} option={SeedOptions.PLAYLISTS} label={"Add Lofi"} />
			</div>
		);
	}

  if (!playlists.length && !owner) {
    return (
			<div className={styles.noData}>
				<span className={styles.noPlaylists}>It looks like <span className={styles.name}>@{user.username}</span> doesn&apos;t have any playlists yet</span>
			</div>
		);
  }

	return (
    <div className={styles.tiles}>
		  <div className={styles.grid}>
        {playlists.length > 0 &&
          playlists.map((playlist) => {
            const thumbnail = getImage(playlist.thumbnail);
            return (
              <Link key={playlist.id} href={`${pathname}?content=${ContentPage.PLAYLISTS}&playlist=${playlist.id}`} className={styles.card}>
                <Image src={thumbnail} alt={playlist.name} fill />
                <span className={styles.label}>{playlist.name}</span>
              </Link>
            );
          })
        }
      </div>
			<span className={styles.listEnd}>
				That&#39;s all of <span className={styles.name}>@{user.username}</span> playlists for now
			</span>
		</div>
	);
}
