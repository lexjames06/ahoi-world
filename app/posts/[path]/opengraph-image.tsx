import { getPostData } from "@/lib/posts";
import { ImageResponse } from "next/server";
import NextImage from "next/image";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "A House Of Ideas";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image({ params: { path } }: { params: { path: string } }) {
	const { image, title } = await fetch(`https://ahoi.world/posts/${path}/get-post`).then((res) => res.json());

	return new ImageResponse(
		(
			<div>
				<NextImage src={`data:image/png;base64,${image}`} fill={true} alt={title} />
			</div>
		),
		{ ...size }
	);
}
