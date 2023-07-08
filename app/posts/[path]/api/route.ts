import { getPostData } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { path: string } }) {
  let { path } = params;

  const post = await getPostData(path);

  if (post) {
    const { image, title } = post;
    return NextResponse.json({ image, title });
  } else {
    return NextResponse.json({ image: undefined, title: undefined });
  }
}