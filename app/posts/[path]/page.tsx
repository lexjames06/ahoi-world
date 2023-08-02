/* eslint-disable @next/next/no-img-element */
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import getFormattedDate from "@ahoi-world/lib/getFormattedDate";
import { getFirebasePostData, getSortedFirebasePostsData } from "@ahoi-world/lib/posts";
import styles from "./page.module.scss";
import { generateHeader, generateImage, generateOrderedList, prepareBodyForParse } from "./utils/blog-formatter";
import { ShareIcon, SocialPlatform } from "@ahoi-world/atoms/ShareIcon";
import { FloatingBackButton } from "@ahoi-world/atoms";
import { Page } from "@ahoi-world/templates";

// const authFeature = getFeatureFlag("auth");

export async function generateStaticParams() {
	const { posts } = await getSortedFirebasePostsData();

	return posts.map((post) => ({
		path: post.path,
	}));
}

export async function generateMetadata({ params }: { params: { path: string } }) {
	const { path } = params;
	const post = await getFirebasePostData(path);

	if (!post) {
		return {
			title: "Post Not Found",
			descritption: "The post you are looking for does not exist",
		};
	}

	return {
		alternates: {
			canonical: `/posts/${post.path}`,
		},
		title: post.title,
		description: post.description,
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			creator: "@seaj_ahoi",
		},
		// openGraph: {
		// 	title: post.title,
		// 	description: post.description,
		// 	siteName: 'AHOI',
		// 	locale: 'en_GB',
		// 	type: 'website',
		// },
	};
}

export default async function Post({ params }: { params: { path: string } }) {
	const { path } = params;
	const post = await getFirebasePostData(path);

	const socialPlatforms: SocialPlatform[] = ["facebook", "linkedIn", "twitter", "share"];

	if (!post) {
		return notFound();
	}

	const { title, date: unformattedDate, length, image, body } = post;
	const date = getFormattedDate(unformattedDate);

	const parseBlogBody = (body: string[]) => {
		if (!body || !body.length) {
			return null;
		}

		const preppedBody = prepareBodyForParse(body);

		return (
			<>
				{preppedBody?.map((section, index) => {
					if (section.startsWith("#")) {
						return generateHeader(section);
					} else if (section.startsWith("![")) {
						return generateImage(section);
					} else if (section.startsWith("ORDERED-LIST:")) {
						return generateOrderedList(section);
					}

					return <p key={`${section.slice(0, 10)} ${index}`}>{section}</p>;
				})}
			</>
		);
	};

	return (
		<Page>
			<FloatingBackButton />

			<span className={styles.coverImage}>
				<Image src={image} fill={true} alt={title} />
			</span>

			<span className={styles.articleHeader}>
				<h2>{title}</h2>

				<p>
					{length} min read • {date}
				</p>

				<span className={styles.shareIcons}>
					{socialPlatforms.map((platform) => (
						<ShareIcon key={platform} platform={platform} title={title} />
					))}
				</span>
			</span>

			<article className={styles.blog}>{parseBlogBody(body)}</article>

			<div className={styles.articleFooter}>
				<span className={styles.shareIcons}>
					{socialPlatforms.map((platform) => (
						<ShareIcon key={platform} platform={platform} title={title} />
					))}
				</span>
			</div>
		</Page>
	);
}
