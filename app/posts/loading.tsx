import { SkeletonPage } from "@ahoi-world/templates";
import { SmallBlogCardList } from "./SmallBlogCardList";
import { dummyPost } from "./utils/skeleton-post";
import { CategoriesSelector, LargeBlogCard } from "@ahoi-world/atoms";

export default function Loading() {
	return (
		<SkeletonPage>
			<CategoriesSelector categories={[]} loading={true} />
			<LargeBlogCard post={dummyPost} loading={true} />
			<SmallBlogCardList posts={[dummyPost]} loading={true} />
		</SkeletonPage>
	);
}
