"use client";
import React, { SetStateAction } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import styles from "./Menu.module.scss";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";
import { signout } from "@ahoi-world/lib/users";

import { useFeatureFlagContext } from "@ahoi-world/providers/FeatureFlag";
import { Option, navOptions } from "@ahoi-world/templates/constants";
import { UserNavIcon } from "../UserNavIcon";
import { Toggle } from "@ahoi-world/atoms";

type Props = {
	show: boolean;
	toggleMenu?: React.Dispatch<SetStateAction<boolean>>;
};

export function Menu({ show, toggleMenu }: Props) {
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
		const preventClose = (e.target as HTMLElement).getAttribute("data-preventclose");
		if (!preventClose && toggleMenu) {
			toggleMenu(false);
		}
	};

	return (
		<div className={styles.overlay} id="menu" data-show={show} onClick={handleMenuToggle}>
			<div className={styles.container}>
				<div className={styles.menu}>
					<div className={`${styles.option} ${styles.darkmode}`} data-preventclose={true} data-bottomdivider={true}>
						<span>Dark Mode</span>
						<Toggle onClick={() => toggleTheme(currentTheme ?? "dark")} toggled={currentTheme === "dark"} />
					</div>

					{options.map((option, index) =>
						option ? (
							<Link
								href={option.link}
								key={option.label}
								className={styles.option}
								data-active={pathname.includes(option.link)}
								data-divider={option?.divider}
								target={option?.target}
							>
								<span>{option.label}</span>
								<option.icon />
							</Link>
						) : (
							<span key={index} className={styles.line} />
						)
					)}

					{!!auth && auth.enabled && <UserNavIcon user={user} isDesktop={true} />}
				</div>
			</div>
		</div>
	);
}
