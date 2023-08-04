import Link from "next/link";
import { getSortedFirebasePostsData } from "@ahoi-world/lib/posts";

import { SmallBlogCardList } from "./SmallBlogCardList";
import styles from "./page.module.scss";
import { CategoriesSelector, LargeBlogCard, SeedButton } from "@ahoi-world/atoms";
import { Page } from "@ahoi-world/templates";
import { SeedOptions } from "@ahoi-world/types/Seed";

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
	const { posts, categories } = await getSortedFirebasePostsData(category);

	if (!posts.length) {
		return (
			<main className={styles.noData}>
				<span className={styles.noPosts}>There are no posts available at this time</span>
				<SeedButton option={SeedOptions.BLOGS} />
			</main>
		);
	}

	const largeItemPost = posts.shift()!;

	return (
		<Page>
			<CategoriesSelector categories={categories} />
			<Link href={`/posts/${largeItemPost.path}`}>
				<LargeBlogCard post={largeItemPost} />
			</Link>
			<SmallBlogCardList posts={posts} />
			<span className={styles.listEnd}>That&#39;s all the posts for now</span>
		</Page>
	);
}
