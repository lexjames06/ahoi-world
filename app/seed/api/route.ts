import { uploadMarkdownBlogs, uploadPlaylistsVideos } from "@ahoi-world/lib/seed";
import { NextResponse } from "next/server";
import { seedSchema } from "../utils/zod-schema";
import { SeedOptions } from "@ahoi-world/types/Seed";

export async function POST(request: Request) {
  const body = await request.json();

  const response = seedSchema.safeParse(body);

  if (!response.success) {
    const errors = response.error.format();

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  const { option } = response.data;

  console.log(`seeding ${option} posts`);

  if (option === SeedOptions.ALL || option === SeedOptions.BLOGS) {
    await uploadMarkdownBlogs();
  }

  if (option === SeedOptions.ALL || option === SeedOptions.PLAYLISTS) {
    await uploadPlaylistsVideos();
  }

  return NextResponse.json({ message: `successfully seeded ${option} data` });
}