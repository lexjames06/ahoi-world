import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

interface SortedPostsData {
	posts: BlogPost[];
	categories: string[];
}

const postsDirectory = path.join(process.cwd(), "blogposts");

export function getSortedPostsData(category?: string): SortedPostsData {
	//  Get file names under /posts
	const folders = fs.readdirSync(postsDirectory);
	const categories: string[] = [];
	const allPostsData = folders.reduce((posts: BlogPost[], folder) => {
		const folderPath = path.join(postsDirectory, folder);

		// Read markdown file as string
		const blogFilePath = path.join(folderPath, "blog.md");
		const fileContents = fs.readFileSync(blogFilePath, "utf-8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);
		categories.push(matterResult.data.category);

		if (category && matterResult.data.category !== category) {
			return posts;
		}

		// Convert cover image to base64 string
		const coverImagePath = matterResult.data.image.replace(".", "blogposts");
		const coverImageContent = fs.readFileSync(coverImagePath);
		const coverImage = coverImageContent.toString("base64");

		const blogPost: BlogPost = {
			id: folder,
			author: matterResult.data.author,
			category: matterResult.data.category,
			date: matterResult.data.date,
			image:coverImage,
			length: matterResult.data.length,
			title: matterResult.data.title,
		};

		return [...posts, blogPost];
	}, []);

	const uniqueCategories = Array.from(new Set(categories)).sort((a, b) => a > b ? 1 : -1).reduce((list: string[], category) => {
		if (category === 'general') {
			return [category, ...list];
		}
		return [...list, category];
	}, []);
	const sortedPosts = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

	return {
		posts: sortedPosts,
		categories: uniqueCategories,
	}
}

export async function getPostData(id: string) {
  const folderPath = path.join(postsDirectory, id);
	const blogFilePath = path.join(folderPath, "blog.md");
	const fileContents = fs.readFileSync(blogFilePath, "utf-8");

  // User gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const initialContentHtml = processedContent.toString();

  // Get all fileNames from blog folder
  const fileNames = fs.readdirSync(folderPath);

	// Convert cover image to base64 string
	const coverImagePath = matterResult.data.image.replace(".", "blogposts");
	const coverImageContent = fs.readFileSync(coverImagePath);
	const coverImage = coverImageContent.toString("base64");

	// Convert body images to base64 string and inject into html
  const imageNames = fileNames.filter((file) => file !== "blog.md");
  const imagePaths = imageNames.map((image) => `blogposts/${id}/${image}`);
	const contentHtml = imagePaths.reduce((html, imagePath) => {
		const file = fs.readFileSync(imagePath);
		const relativeImagePath = imagePath.replace("blogposts", ".");
		const imageSource = `data:image/png;base64,${file.toString("base64")}`;

		return html.replaceAll(relativeImagePath, imageSource);
	}, initialContentHtml);

  const blogPostWithHTML: BlogPost & { contentHtml: string } = {
    id,
    author: matterResult.data.author,
		category: matterResult.data.category,
    contentHtml,
    date: matterResult.data.date,
    image: coverImage,
    length: matterResult.data.length,
    title: matterResult.data.title,
  };

  return blogPostWithHTML;
}
