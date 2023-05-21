import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Page from "../components/Page";
import CategoriesSlider from "../components/blog/CategoriesSlider";
import LargeListItem from "../components/blog/LargeListItem";
import SmallListItems from "./SmallListItems";
import styles from "./page.module.css";

interface Props {
	searchParams?: Record<'category', string>;
}

export default function Posts(props: Props) {
	const { searchParams } = props;
	const category = searchParams?.category;
	const { posts, categories } = getSortedPostsData(category);

	if (!posts.length) {
		return (
			<main className={styles.main}>
				<span className={styles.noPosts}>There are no posts available at this time</span>
			</main>
		);
	}

	const largeItemPost = posts.shift()!;

	return (
		<Page>
			<CategoriesSlider categories={categories} />
			<Link href={`/posts/${largeItemPost.id}`}>
				<LargeListItem post={largeItemPost} />
			</Link>
			<SmallListItems posts={posts} />
			<span className={styles.listEnd}>That&#39;s all the posts for now</span>
		</Page>
	);
}
