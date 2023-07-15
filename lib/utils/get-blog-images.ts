import { getImage } from "./get-image";

export const getBlogImages = (blogBody: string[]): string[] => {
  const markdownImages = blogBody.filter((section) => section.startsWith("!["));
  const imagePaths = markdownImages.map((markdown) => {
    return markdown.split("](")?.[1].split(")")?.[0];
  });
  const imageUrls = imagePaths.map((path) => getImage(path));
  return imageUrls;
}

export const convertBlogImages = (blogBody: string[]): string[] => {
  const convertedBody = blogBody.map((section) => {
    if (!section.startsWith("![")) {
      return section;
    }

    const url = section.split("](")?.[1].split(")")?.[0];
    const convertedUrl = getImage(url);
    const convertedSection = `${section.split("](")}](${convertedUrl})`;

    return convertedSection;
  });

  return convertedBody;
}