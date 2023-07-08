import { getPostData } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { path: string } }) {
  let { path } = params;

  const { image, title } = await getPostData(path);

  return NextResponse.json({ image, title });
}