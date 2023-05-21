import { getPostData } from "@/lib/posts";
import { ImageResponse } from "next/server";
import Image from "next/image";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function handler({ params: { postId } }: { params: { postId: string } }) {
	const { image, title } = await getPostData(postId);

	return new ImageResponse(
		(
			<div>
				<Image src={`data:image/png;base64,${image}`} fill={true} alt={title} />
			</div>
		),
		{ ...size }
	);
}
