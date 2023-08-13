"use client";
import React, { SetStateAction } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Option, navOptions } from "@ahoi-world/templates/constants";
import styles from "./MobileMenu.module.scss";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";
import { signout } from "@ahoi-world/lib/users";
import { UserNavIcon } from "../UserNavIcon";
import { useFeatureFlagContext } from "@ahoi-world/providers/FeatureFlag";
import { Toggle, UserIcon } from "@ahoi-world/atoms";
import { PiSignOut, PiSignIn } from "react-icons/pi";

type Props = {
	show: boolean;
	toggleMenu?: React.Dispatch<SetStateAction<boolean>>;
};

const signoutOption = {
  label: "Sign Out",
  action: signout,
  icon: PiSignOut,
};

const signinOption = {
  label: "Sign In",
  action: "/sign-in",
  icon: PiSignIn,
};

export function MobileMenu({ show, toggleMenu }: Props) {
	const router = useRouter();
	const { user } = useAuthContext();
	const pathname = usePathname();
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;
	const { auth } = useFeatureFlagContext();

	const toggleTheme = (current: string) => {
		const toggled = current === "dark" ? "light" : "dark";
		setTheme(toggled);
	};

	const options = navOptions.reduce((list: (Option | null)[], option, index) => {
		if (index === 0) {
			return [...list, option];
		}

		return [...list, null, option];
	}, []);

	const handleMenuToggle = (e: React.MouseEvent) => {
		const allowClose = (e.target as HTMLElement).getAttribute("data-allowclose");
		if (allowClose && toggleMenu) {
			toggleMenu(false);
		}
	};

	const isUserProfile = pathname.includes("/users/") && pathname.split("/").length === 3;

	const goToUserProfile = () => {
		if (!isUserProfile && !!user) {
			router.push(`/users/${user.username}`);
		}
	};

	return (
		<div className={styles.overlay} id="menu" data-show={show} onClick={handleMenuToggle}>
			<div className={styles.container} data-allowclose={true}>
				<div className={styles.menu}>
					{!!auth && auth.enabled && (
						user && (
							<div className={styles.optionsSection}>
								<div className={styles.profileHeader}>
									<span className={styles.userDetails}>
										<span>{user.displayName}</span>
										<span className={styles.username}>@{user.username}</span>
									</span>

									{isUserProfile && (
										<span className={styles.userIcon}>
											<UserIcon isClickable={false} user={user} size={1.5} />
										</span>
									)}

									{!isUserProfile && (
										<button onClick={goToUserProfile}>
											<span className={styles.userIcon} data-allowclose={true}>
												<UserIcon isClickable={false} user={user} size={1.5} allowClose={true} />
											</span>
										</button>
									)}
								</div>
							</div>
						)
					)}
					
					<div className={styles.optionsSection}>
						<div className={`${styles.option} ${styles.darkmode}`}>
							<span>Dark Mode</span>
							<Toggle onClick={() => toggleTheme(currentTheme ?? "dark")} toggled={currentTheme === "dark"} />
						</div>
					</div>

					<div className={styles.optionsSection}>
						{navOptions.map((option, index) =>
							option ? (
								<Link
									href={option.link}
									key={option.label}
									className={styles.option}
									data-active={pathname.includes(option.link)}
									data-divider={option?.divider}
									data-allowclose={true}
									target={option?.target}
								>
									<span>{option.label}</span>
									<option.icon />
								</Link>
							) : (
								<span key={index} className={styles.line} />
							)
						)}
					</div>

					{!!auth && auth.enabled && (
						user && (
							<div className={styles.optionsSection}>
								<div className={styles.option} data-allowclose={true} data-useraction={true} onClick={signoutOption.action}>
									<span>{signoutOption.label}</span>
									<signoutOption.icon />
								</div>
							</div>
						)
					) || (
						!user && (
							<div className={styles.optionsSection}>
								<Link href={signinOption.action} className={styles.option} data-allowclose={true} data-useraction={true}>
									<span>{signinOption.label}</span>
									<signinOption.icon />
								</Link>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
