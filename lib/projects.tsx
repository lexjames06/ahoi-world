import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateProjectId, generateUserId } from "./utils/generateUUIDV4";

interface Details {
	bio?: string;
	name?: string;
	job?: string;
	image?: string;
}

interface SortedProjectsData {
	projects: Project[];
	bio?: string;
	name?: string;
	job?: string;
	image?: string;
}

const projectsDirectory = path.join(process.cwd(), "projects");

export function getSortedProjectsData(): SortedProjectsData {
	//  Get file names under /posts
	const files = fs.readdirSync(projectsDirectory);
	const details: Details = {};
	const allProjectsData = files.reduce((projects: Project[], file) => {
		const filePath = path.join(projectsDirectory, file);

		// Convert image to base64 string and add to details
		if (filePath.includes(".jpg")) {
			const imageContent = fs.readFileSync(filePath);
			const image = imageContent.toString("base64");
			details.image = image;
			return projects;
		}

		// Read markdown file as string
		const fileContents = fs.readFileSync(filePath, "utf-8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Add details
		if (matterResult.data.bio) {
			details.bio = matterResult.data.bio;
			details.job = matterResult.data.job;
			details.name = matterResult.data.name;
			return projects;
		}

		// Convert string IDs to UUIDV4
		const id = generateProjectId(matterResult.data.id);
		const userId = generateUserId(matterResult.data.userId);

		const project: Project = {
			id,
			userId,
			company: matterResult.data.company,
			name: matterResult.data.name,
			start: matterResult.data.start,
			end: matterResult.data.end,
			role: matterResult.data.role,
			technologies: matterResult.data.technologies.split(", "),
		};

		return [...projects, project];
	}, []);

	const sortedProjects = allProjectsData.sort((a, b) => (a.end < b.end ? 1 : -1));

	return {
		projects: sortedProjects,
		...details,
	};
}
