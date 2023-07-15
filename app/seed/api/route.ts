import { uploadMarkdownBlogs } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  await uploadMarkdownBlogs();

  return NextResponse.json({ message: "successfully seeded data" });
}