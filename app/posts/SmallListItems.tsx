import React from 'react'
import Link from "next/link";
import SmallListItem from "../components/blog/SmallListItem";
import styles from "./SmallListItems.module.css";

type Props = {
  posts: BlogPost[];
}

export default function SmallListItems({ posts }: Props) {
  return (
    <section className={styles.list}>
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <SmallListItem post={post} />
        </Link>
      ))}
    </section>
  );
}
