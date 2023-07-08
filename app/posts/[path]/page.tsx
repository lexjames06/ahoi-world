import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "@/app/components/blog/BackButton";
import ShareIcon, { SocialPlatform } from "@/app/components/blog/ShareIcon";
import Page from "@/app/components/Page";
import getFormattedDate from "@/lib/getFormattedDate";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import styles from "./page.module.scss";

export async function generateStaticParams() {
	const { posts } = await getSortedPostsData();

	return posts.map((post) => ({
		path: post.path,
	}));
}

export async function generateMetadata({ params }: { params: { path: string } }) {
	const { path } = params;
	const post = await getPostData(path);

	if (!post) {
		return {
			title: "Post Not Found",
			descritption: "The post you are looking for does not exist",
		};
	}

	return {
		title: post.title,
		description: post.description,
	};
}

export default async function Post({ params }: { params: { path: string } }) {
	const { path } = params;
	const post = await getPostData(path)
  const socialPlatforms: SocialPlatform[] = ["facebook", "linkedIn", "twitter", "share"];

	if (!post) {
		return notFound();
	}

	const { title, date: dateString, length, image, contentHtml } = post;
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
