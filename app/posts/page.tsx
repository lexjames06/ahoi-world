import Link from "next/link";
import { getSortedFirebasePostsData } from "@/lib/posts";
import Page from "../components/Page";
import CategoriesSlider from "../components/blog/CategoriesSlider";
import LargeListItem from "../components/blog/LargeListItem";
import SmallListItems from "./SmallListItems";
import styles from "./page.module.scss";
import { SeedData } from "../components/SeedButton";

interface Props {
	searchParams?: Record<'category', string>;
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
				<SeedData />
			</main>
		);
	}

	const largeItemPost = posts.shift()!;

	return (
		<Page>
			<CategoriesSlider categories={categories} />
			<Link href={`/posts/${largeItemPost.path}`}>
				<LargeListItem post={largeItemPost} />
			</Link>
			<SmallListItems posts={posts} />
			<span className={styles.listEnd}>That&#39;s all the posts for now</span>
		</Page>
	);
}
