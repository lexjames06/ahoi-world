import { getPostData } from "@/lib/posts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getPost(req: NextApiRequest, res: NextApiResponse<{ image: string, title: string }>) {
  let { path } = req.query as { path: string };

  const { image, title } = await getPostData(path);

  res.status(200);
  res.json({ image, title });
}