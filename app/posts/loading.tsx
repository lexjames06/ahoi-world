import Skeleton from "../components/Skeleton";
import CategoriesSlider from "../components/blog/CategoriesSlider";
import LargeListItem from "../components/blog/LargeListItem";
import SmallListItems from "./SmallListItems";
import { dummyPost } from "./utils/skeleton-post";

export default function Loading() {
	return (
		<Skeleton>
			<CategoriesSlider categories={[]} loading={true} />
			<LargeListItem post={dummyPost} loading={true} />
			<SmallListItems posts={[dummyPost]} loading={true} />
		</Skeleton>
	);
}
