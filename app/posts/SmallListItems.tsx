import React from 'react'
import Link from "next/link";
import SmallListItem from "../components/blog/SmallListItem";
import styles from "./SmallListItems.module.scss";

type Props = {
  posts: BlogPost[];
  loading?: boolean;
}

export default function SmallListItems({ posts, loading = false }: Props) {
  if (loading) {
    return (
      <section className={styles.list}>
        {Array.from(Array(9)).map((_, index) => (
          <SmallListItem key={index} post={posts[0]} loading={true} />
        ))}
      </section>
    );
  }

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
