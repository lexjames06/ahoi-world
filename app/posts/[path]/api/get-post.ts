import { getPostData } from "@/lib/posts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getPost(req: NextApiRequest, res: NextApiResponse<{ image: string, title: string }>) {
  let { postId } = req.query as { postId: string };

  const { image, title } = await getPostData(postId);

  res.status(200);
  res.json({ image, title });
}