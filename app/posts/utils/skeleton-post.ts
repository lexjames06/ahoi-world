import { generateBlogPostId, generateUserId } from "@ahoi-world/lib/utils/generate-UUIDV4";
import { BlogPost } from "@ahoi-world/types/PostTypes";

const dummyPostId = "";
const dummyUserId = "";

export const dummyPost: BlogPost = {
	id: generateBlogPostId(dummyPostId),
	userId: generateUserId(dummyUserId),
	path: "skeleton-post",
	date: new Date("01-01-1990"),
	description: "skeleton post",
	image: "/images/skeleton",
	length: 0,
	title: "Skeleton",
	category: "skeleton",
	body: [],
};
