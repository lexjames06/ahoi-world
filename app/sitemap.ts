import { getSortedPostsData } from "@ahoi-world/lib/posts";

export default async function sitemap() {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

	const { posts } = await getSortedPostsData();
	const postUrls = posts?.map((post) => ({
		url: `${BASE_URL}/posts/${post.path}`,
		lastModified: new Date(),
	}));

	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/posts`,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
		},
		...postUrls,
	];
}
