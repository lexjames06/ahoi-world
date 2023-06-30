import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "@/app/components/blog/BackButton";
import ShareIcon, { SocialPlatform } from "@/app/components/blog/ShareIcon";
import Page from "@/app/components/Page";
import getFormattedDate from "@/lib/getFormattedDate";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import styles from "./page.module.scss";
import { kebabCase } from "lodash";

export function generateStaticParams() {
	const { posts } = getSortedPostsData();

	return posts.map((post) => ({
		path: post.path,
	}));
}

export function generateMetadata({ params }: { params: { path: string } }) {
	const { posts } = getSortedPostsData();
	const { path } = params;

	const post = posts.find((post) => post.path === path);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.title,
	};
}

export default async function Post({ params }: { params: { path: string } }) {
	const { posts } = getSortedPostsData();
	const { path } = params;
  const socialPlatforms: SocialPlatform[] = ["facebook", "linkedIn", "twitter", "share"];

	if (!posts.find((post) => post.path === path)) {
		return notFound();
	}

	const { title, date: dateString, length, image, contentHtml } = await getPostData(path);

	const date = getFormattedDate(dateString);

	return (
		<Page>
      <BackButton />

			<span className={styles.coverImage}>
				<Image src={`data:image/png;base64,${image}`} fill={true} alt={title} />
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

			<article className={styles.blog} dangerouslySetInnerHTML={{ __html: contentHtml }} />
			
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
