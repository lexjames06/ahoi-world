import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "@ahoi-world/firebase/app";
import { ConvertTime } from "./utils/convert-time";
import { generateBlogPostId, generateUserId } from "./utils/generate-UUIDV4";
import { getEndOfUUIDV4 } from "./utils/get-end-of-UUIDV4";
import { ref, uploadBytes } from "firebase/storage";
import { Video } from "@ahoi-world/types/Video";
import { UserPlaylist } from "@ahoi-world/types/UserTypes";

// <-- BLOGS -->

const postsDirectory = path.join(process.cwd(), "blogposts");

function formatBlogForWrite(matterResult: matter.GrayMatterFile<string>, folder: string, giveUserId?: string) {
	const body = matterResult.content.split("\n").reduce((body: string[], block: string) => {
		if (block.startsWith("![")) {
			const paths = block.split("](");
			block = [paths[0], paths[1].slice(1)].join("](");
		}

		return block ? [...body, block] : body;
	}, []);

	const userId = giveUserId ?? generateUserId(matterResult.data.userId);
	const id = generateBlogPostId(matterResult.data.id);
	const imagePath = matterResult.data.image.slice(1);

	return {
		category: matterResult.data.category,
		date: new Date(matterResult.data.date),
		description: matterResult.data.description,
		imagePath,
		length: matterResult.data.length,
		title: matterResult.data.title,
		userId,
		id,
		body,
    path: `${folder}-${getEndOfUUIDV4(id)}`,
	};
}

async function writeBlogs(posts: any[]) {
	posts.forEach(async (post) => {
		const docRef = doc(firestore, "posts", post.id);
		await setDoc(docRef, {
			userId: post.userId,
			date: ConvertTime.toTimestamp(post.date),
			description: post.description,
			imagePath: post.imagePath,
			length: post.length,
			title: post.title,
			category: post.category,
			body: post.body,
      path: post.path,
		});
	});

	console.log(`written ${posts.length} posts to the database`);
}

async function writeCategories(categories: string[]) {
	const docRef = doc(firestore, "categories", "all");
	await setDoc(docRef, {
		list: arrayUnion(...categories),
	});

	console.log(`added ${categories.length} categories to the database`);
}

async function uploadImage(storagePath: string, file: Buffer) {
	const storageRef = ref(storage, storagePath);
	const metadata = {
		contentType: 'image/jpeg',
	};

	uploadBytes(storageRef, file, metadata)
		.then((snapshot) => {
			console.log(`Uploaded image to "${storagePath}"`);
		})
		.catch((error) => console.log({uploadImageError: error}));
}

export async function uploadMarkdownBlogs(userId?: string) {
	const folders = fs.readdirSync(postsDirectory);
	const categories: string[] = [];

	const allPostsData = folders.reduce((posts: any[], folder) => {
		if (folder === ".DS_Store") {
			return posts;
		}

		const folderPath = path.join(postsDirectory, folder);

		// images
		const files = fs.readdirSync(folderPath);
		files.forEach((filename) => {
			if (filename === ".DS_Store") {
				return;
			}

			if (!isImageFile(filename)) {
				return;
			}

			const storagePath = path.join("images/", folder, filename);
			const filePath = path.join(folderPath, filename);

			const file = fs.readFileSync(filePath);

			uploadImage(storagePath, file);
		})

		// Read markdown file as string
		const blogFilePath = path.join(folderPath, "blog.md");
		const fileContents = fs.readFileSync(blogFilePath, "utf-8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);
		categories.push(matterResult.data.category);

		const blogPost = formatBlogForWrite(matterResult, folder, userId);

		return [...posts, blogPost];
	}, []);

	const uniqueCategories = Array.from(new Set(categories));

	writeBlogs(allPostsData);
	writeCategories(uniqueCategories);
}

function isImageFile(filename: string) {
	return filename.endsWith(".jpeg") || filename.endsWith(".jpg");
}

// <-- PLAYLISTS -->

const playlistsDirectory = path.join(process.cwd(), "playlists");

async function addPlaylistsToUser(userId: string, playlists: Video[][]) {
	const userPlaylists: UserPlaylist[] = [];
	console.log(`gathering list of playlists to add to the user with ID ${userId}`);

	playlists.forEach(async (playlist) => {
		const userPlaylist: Partial<UserPlaylist> = {};

		playlist.forEach(async (video, index) => {
			if (index !== 0) {
				return;
			}

			userPlaylist.id = video.playlistId;
			userPlaylist.name = video.playlistName;
			userPlaylist.thumbnail = video.thumbnail;

			console.log(`adding the ${userPlaylist.name} to the list`);

			userPlaylists.push(userPlaylist as UserPlaylist);
		});
	});

	const docRef = doc(firestore, "users", userId);
	await updateDoc(docRef, { playlists: userPlaylists });

	if (playlists.length > 1) {
		console.log(`written ${userPlaylists.length} playlists to the user with ID ${userId}`);
	} else {
		console.log(`written ${userPlaylists.length} playlist to the user with ID ${userId}`);
	}
}

async function writeMusicVideos(playlists: Video[][]) {
	playlists.forEach(async (playlist) => {
		playlist.forEach(async (video) => {
			const docRef = doc(firestore, "music-videos", video.id);
			await setDoc(docRef, video);
		});

		console.log(`written playlist to database with ${playlist.length} videos`);
	});

	if (playlists.length > 1) {
		console.log(`all videos in ${playlists.length} playlists have been written to the database`);
	} else {
		console.log(`All videos in the playlist have been written to the database`);
	}
}

export async function uploadPlaylistsVideos(userId?: string) {
	const folders = fs.readdirSync(playlistsDirectory);

	const allPlaylistsData = folders.reduce((playlists: Video[][], playlistFolder) => {
		if (playlistFolder === ".DS_Store") {
			return playlists;
		}

		const playlistFolderPath = path.join(playlistsDirectory, playlistFolder);

		const videoFolders = fs.readdirSync(playlistFolderPath);

		const allVideosData = videoFolders.reduce((videos: Video[], videoFolder) => {
			const folderPath = path.join(playlistFolderPath, videoFolder);

			// images
			const files = fs.readdirSync(folderPath);
			files.forEach((filename) => {
				if (filename === ".DS_Store") {
					return;
				}
	
				if (!isImageFile(filename)) {
					return;
				}
	
				const storagePath = path.join("images/", videoFolder, filename);
				const filePath = path.join(folderPath, filename);
	
				const file = fs.readFileSync(filePath);
	
				uploadImage(storagePath, file);
			});
	
			// Read markdown file as string
			const videoFilePath = path.join(folderPath, "details.md");
			const fileContents = fs.readFileSync(videoFilePath, "utf-8");
	
			// Use gray-matter to parse the post metadata section
			const matterResult = matter(fileContents);
	
			const video: Video = {
				id: matterResult.data.videoId,
				thumbnail: matterResult.data.thumbnail,
				playlistId: matterResult.data.playlistId,
				playlistName: matterResult.data.playlistName,
			};
	
			return [...videos, video];
		}, []);

		return [...playlists, allVideosData];
	}, []);

	writeMusicVideos(allPlaylistsData);

	if (userId) {
		addPlaylistsToUser(userId, allPlaylistsData);
	}
}