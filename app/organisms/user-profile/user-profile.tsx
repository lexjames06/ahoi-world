"use client";
import { User } from "@ahoi-world/types/UserTypes";
import styles from "./user-profile.module.scss";
import { Page } from "@ahoi-world/templates";
import { CurrentlyPlayingSquare, Selector, Toggle, UserIcon } from "@ahoi-world/atoms";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";
import { ReactIcons } from "@ahoi-world/atoms";
import { UserError, isUser, isUserError, updateUser } from "@ahoi-world/lib/users";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getImage } from "@ahoi-world/lib/utils/get-image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getUserPlaylistData } from "@ahoi-world/lib/playlists";
import { Video } from "@ahoi-world/types/Video";
import { UserContent } from "@ahoi-world/molecules";
import { isEqual } from "@ahoi-world/utils/is-equal";
import { useCurrentPlaylistContext } from "@ahoi-world/providers/CurrentPlaylist";

type Props = {
	profile: User;
};

export enum ContentPage {
	ALBUMS = "ALBUMS",
	BLOGS = "BLOGS",
	PLAYLISTS = "PLAYLISTS",
}

type ContentPages = {
	[key in ContentPage]: string;
};

const contentPages: ContentPages = {
	BLOGS: "blogs",
	PLAYLISTS: "playlists",
	ALBUMS: "albums",
};

const contentPageOptions = Object.entries(contentPages).map(([key, value]) => ({
	key,
	value,
}));

export function UserProfile({ profile }: Props) {
	const { currentVideoId } = useCurrentPlaylistContext();
	const [user, setUser] = useState<User>(profile);
	const [activeContentPage, setActiveContentPage] = useState<ContentPage | null>(null);

	const searchParams = useSearchParams();
	const content = (searchParams.get("content") as ContentPage) ?? ContentPage.BLOGS;

	const { user: currentUser } = useAuthContext();
	const router = useRouter();
	const pathname = usePathname();

	const owner = !!currentUser && currentUser.id === user.id;
	const showHeadline = owner || (user.profileOptions.showHeadline && !!user.headline);
	const showBio = owner || !!user.bio;
	const showDetails = showHeadline || showBio;
	const showEmailButton = owner || (user.profileOptions.showEmailButton && !!user.email);
	const emailButtonDisabled = !user.profileOptions.showEmailButton;

	const toggleShowEmailButton = async (currentFlag: boolean) => {
		if (owner) {
			const response = await updateUser(currentUser, {
				profileOptions: {
					...currentUser.profileOptions,
					showEmailButton: !currentFlag,
				},
			});

			if (isUserError(response)) {
				console.log({ response });
			}

			if (isUser(response)) {
				setUser(response);
			}
		}
	};

	const changeContentPage = (page: string) => {
		router.push(`${pathname}?content=${page}`);
	};

	useEffect(() => {
		if (content !== activeContentPage) {
			setActiveContentPage(content);
		}
	}, [content, activeContentPage]);

	useEffect(() => {
		if (user.id === currentUser?.id && !isEqual(user, currentUser)) {
			setUser(currentUser);
		}
	}, [user, currentUser]);

	return (
		<div className={styles.container}>
			<Page className={styles.page}>
				<section className={styles.sidebarContainer} style={{ backgroundImage: `url(${getImage(user.backgroundImagePath)})` }}>
					<div className={styles.sidebar}>
						<div className={styles.header}>
							<span className={styles.profilePhoto}>
								<UserIcon user={user} size={4.5} />
							</span>
							<h2>{user.displayName}</h2>
							<h3>@{user.username}</h3>
						</div>

						{showDetails && (
							<div className={styles.details}>
								{showHeadline && (
									<div className={styles.headline}>
										<h3 className={styles.label}>Headline</h3>
										<p className={styles.info} data-exists={!!user.headline}>
											{user.headline ?? "None"}
										</p>
									</div>
								)}

								{showBio && (
									<div className={styles.bio}>
										<h3 className={styles.label}>Bio</h3>
										<p className={styles.info} data-exists={!!user.bio}>
											{user.bio ?? "None"}
										</p>
									</div>
								)}
							</div>
						)}

						{currentVideoId && (
							<div className={styles.auioPlayer}>
								<CurrentlyPlayingSquare />
							</div>
						)}

						<div className={styles.footer}>
							{showEmailButton && (
								<div className={styles.email}>
									<Link
										href={`mailto:${user.email}`}
										target="_blank"
										className={styles.emailButton}
										data-disabled={emailButtonDisabled}
										data-owner={owner}
									>
										<ReactIcons.MdEmail />
										Email
									</Link>
									{owner && (
										<div className={styles.option}>
											Direct email option:
											<Toggle
												toggled={!emailButtonDisabled}
												onClick={() => toggleShowEmailButton(user.profileOptions.showEmailButton)}
											/>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</section>

				<section className={styles.content}>
					<Selector activeOption={activeContentPage} options={contentPageOptions} onSelect={changeContentPage} />
					<UserContent owner={owner} user={user} activePage={activeContentPage} />
				</section>
			</Page>
		</div>
	);
}
