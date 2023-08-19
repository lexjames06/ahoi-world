import Link from "next/link";
import { getSortedPostsData } from "@ahoi-world/lib/posts";

import { SmallBlogCardList } from "./SmallBlogCardList";
import styles from "./page.module.scss";
import { Selector, LargeBlogCard, SeedButton, CurrentlyPlayingBanner } from "@ahoi-world/atoms";
import { Page } from "@ahoi-world/templates";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { redirect } from "next/navigation";
import { SelectorOption } from "@ahoi-world/atoms/Selector";
import { CategoriesSelector } from "@ahoi-world/molecules";
import { NoPosts } from "./NoPosts";

interface Props {
	searchParams?: Record<"category", string>;
}

export function generateMetadata({ searchParams }: Props) {
	const category = searchParams?.["category"];

	if (!category) {
		return { title: "Blogs" };
	}

	return { title: `Blogs/${category}` };
}

export default async function Posts(props: Props) {
	const { searchParams } = props;
	const category = searchParams?.category;
	const { posts, categories } = await getSortedPostsData(category);

	if (!posts.length) {
		return (
			<NoPosts />
		);
	}

	const largeItemPost = posts.shift()!;

	return (
		<Page>
			<CategoriesSelector categories={categories} category={category} />
			<Link href={`/posts/${largeItemPost.path}`}>
				<LargeBlogCard post={largeItemPost} />
			</Link>
			<SmallBlogCardList posts={posts} />
			<span className={styles.listEnd}>That&#39;s all the posts for now</span>
		</Page>
	);
}
