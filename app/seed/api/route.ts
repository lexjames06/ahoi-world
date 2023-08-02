import { uploadMarkdownBlogs } from "@ahoi-world/lib/seed";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
  console.log("seeding blog posts");
  await uploadMarkdownBlogs();

  return NextResponse.json({ message: "successfully seeded data" });
}