"use client";
import React, { SetStateAction } from "react";
import styles from "./Menu.module.css";
import type { IconType } from "react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Option, navOptions } from "./constants";
import { useTheme } from "next-themes";

type Props = {
	show: boolean;
	toggleMenu?: React.Dispatch<SetStateAction<boolean>>;
};

export default function Menu({ show, toggleMenu }: Props) {
	const pathname = usePathname();
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;

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
		const preventClose = (e.target as HTMLElement).getAttribute('data-preventclose');
		if (!preventClose && toggleMenu) {
			toggleMenu(false);
		}
	}

	return (
		<div className={styles.overlay} id="menu" data-show={show} onClick={(e) => handleMenuToggle(e)}>
			<div className={styles.container}>
				<div className={styles.menu}>
					<div className={`${styles.option} ${styles.darkmode}`} data-preventclose={true} data-bottomdivider={true}>
						<span>Dark Mode</span>
						<div
							className={styles.toggle}
							onClick={() => toggleTheme(currentTheme ?? "dark")}
							data-toggled={currentTheme === "dark"}
							data-preventclose={true}
						>
							<div className={styles.toggleThumb} data-preventclose={true} />
						</div>
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
				</div>
			</div>
		</div>
	);
}
