import { DocumentData, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/app";
import { ConvertTime } from "./utils/convert-time";
import { generateBlogPostId, generateUserId } from "./utils/generate-UUIDV4";
import { convertBlogImages, getBlogImages } from "./utils/get-blog-images";
import { getImage } from "./utils/get-image";

interface SortedPostsData {
	posts: BlogPost[];
	categories: string[];
}

const SORT_ORDER = "desc";

function convertFirestorePostToBlogPost(doc: DocumentData) {
	const data = doc.data();

	const imageUrl = getImage(data.imagePath ?? "");
	const images = getBlogImages(data.body);
	const body = convertBlogImages(data.body);

	const post: BlogPost = {
		id: generateBlogPostId(doc.id),
		userId: generateUserId(data.userId),
		path: data.path,
		date: ConvertTime.fromTimestamp(data.date),
		description: data.description,
		image: imageUrl,
		images,
		length: data.length,
		title: data.title,
		category: data.category,
		body: body,
	};

	return post;
}

export async function getSortedFirebasePostsData(category?: string): Promise<SortedPostsData> {
	const postsRef = collection(firestore, "posts");
	const clause = category ? where("category", "==", category) : null;
	const q = clause ? query(postsRef, clause, orderBy("date", SORT_ORDER)) : query(postsRef, orderBy("date", SORT_ORDER));

	const posts: BlogPost[] = [];

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach(async (doc) => {
		posts.push(convertFirestorePostToBlogPost(doc));
	});

	// Sort by date
	posts.sort((a, b) => a.date > b.date ? (SORT_ORDER === "desc" ? -1 : 1) : (SORT_ORDER === "desc" ? 1 : -1));

	const categoriesDoc = doc(firestore, "categories", "all");
	const document = await getDoc(categoriesDoc);
	const categories = document.data()?.list ?? [];

	return {
		posts,
		categories,
	};
}

export async function getFirebasePostData(path: string): Promise<BlogPost> {
	const postsRef = collection(firestore, "posts");
	const q = query(postsRef, where("path", "==", path));
	const querySnapshots = await getDocs(q);
	const posts: BlogPost[] = [];
	querySnapshots.forEach((doc) => posts.push(convertFirestorePostToBlogPost(doc)));

	return posts?.[0];
}
