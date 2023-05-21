type ImagePathAndBase64String = {
  base64String: string;
  path: string;
}

type BlogPost = {
  id: string;
  author: string;
  date: string;
  image: string;
  images?: ImagePathAndBase64String[];
  length: number;
  title: string;
  category: string;
}

type Project = {
  id: string;
  company: string;
  name: string;
  start: string;
  end: string;
  role: string;
  technologies: string[];
}
