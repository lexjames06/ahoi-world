"use client";
import React, { useEffect, useState } from "react";
import { ReactIcons } from "@ahoi-world/atoms";
import Link from "next/link";

export type SocialPlatform = "twitter" | "facebook" | "linkedIn" | "share";

type Props = {
	platform: SocialPlatform;
	title: string;
};

export function ShareIcon({ platform, title }: Props) {
	const [location, setLocation] = useState<Location>();

	useEffect(() => {
		if (typeof window !== "undefined") {
			setLocation(window.location);
		}
	}, []);

	if (!location || (platform === "share" && !navigator?.share)) {
		return null;
	}

	const getLink = (platform: string): string => {
		switch (platform) {
			case "twitter":
				return `http://twitter.com/share?text=${encodeURIComponent(title ?? "")}&url=${
					location?.href
				}&hashtags=AHouseOfIdeas`;
			case "facebook":
				return `https://www.facebook.com/sharer/sharer.php?u=${location?.href}`;
			case "linkedIn":
				return `https://www.linkedin.com/sharing/share-offsite/?url=${location?.href}`;
			default:
				return "";
		}
	};

	const share = async () => {
		await navigator
			.share({
				title: title,
				text: title,
				url: location?.href,
			})
			.then(() => console.log("success"))
			.catch((err) => console.log(err));
	};

	const getIcon = (platform: string) => {
		switch (platform) {
			case "facebook":
				return <ReactIcons.AiFillFacebook color="#4267B2" />;
			case "linkedIn":
				return <ReactIcons.AiFillLinkedin color="#0072b1" />;
			case "twitter":
				return <ReactIcons.AiFillTwitterSquare color="#00acee" />;
			case "share":
				return <ReactIcons.MdShare />;
			default:
				return null;
		}
	};

	if (platform === "share") {
		return <button onClick={() => share()}>{getIcon(platform)}</button>;
	}

	return (
		<Link href={getLink(platform)} target="_blank">
			{getIcon(platform)}
		</Link>
	);
}
