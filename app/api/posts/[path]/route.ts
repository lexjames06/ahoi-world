import { getPostData } from "@ahoi-world/lib/posts";
import { getFirebaseUserData } from "@ahoi-world/lib/users";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { path: string } }) {
	let { path } = params;

	const post = await getPostData(path);

	if (post) {
		const { image, title, userId } = post;
		const user = await getFirebaseUserData({ userId });
		return NextResponse.json({ image, title, user });
	} else {
		return NextResponse.json({ image: undefined, title: undefined, user: null });
	}
}
