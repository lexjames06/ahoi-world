import { SkeletonPage } from "@ahoi-world/templates";
import { SmallBlogCardList } from "./SmallBlogCardList";
import { dummyPost } from "./utils/skeleton-post";
import { LargeBlogCard } from "@ahoi-world/atoms";
import { CategoriesSelector } from "@ahoi-world/molecules";

export default function Loading() {
	return (
		<SkeletonPage>
			<CategoriesSelector categories={[]} category={""} loading={true} />
			<LargeBlogCard post={dummyPost} loading={true} />
			<SmallBlogCardList posts={[dummyPost]} loading={true} />
		</SkeletonPage>
	);
}
