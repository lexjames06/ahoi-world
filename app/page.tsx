import { getSortedPostsData } from "@/lib/posts";
import styles from './page.module.css';
import Page from "./components/Page";

export default function Home() {
  const posts = getSortedPostsData();
  
  return (
    <Page>
      Home
    </Page>
  )
}
