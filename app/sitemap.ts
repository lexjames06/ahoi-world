import { getSortedFirebasePostsData } from "@/lib/posts";

export default async function sitemap() {
  const baseUrl = process.env.BASE_URL;

  const { posts } = await getSortedFirebasePostsData();
  const postUrls = posts?.map((post) => ({
    url: `${baseUrl}/posts/${post.path}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}