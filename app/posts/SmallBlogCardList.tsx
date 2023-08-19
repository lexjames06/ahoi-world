import React from 'react'
import Link from "next/link";
import { BlogPost } from "@ahoi-world/types/PostTypes";
import { SmallBlogCard } from "@ahoi-world/atoms";
import styles from "./SmallBlogCardList.module.scss";

type Props = {
  posts: BlogPost[];
  loading?: boolean;
}

export function SmallBlogCardList({ posts, loading = false }: Props) {
  if (loading) {
    return (
      <section className={styles.list}>
        {Array.from(Array(9)).map((_, index) => (
          <SmallBlogCard key={index} post={posts[0]} loading={true} />
        ))}
      </section>
    );
  }

  return (
    <section className={styles.list}>
      {posts.map((post) => (
        <Link href={`/posts/${post.path}`} key={post.id}>
          <SmallBlogCard post={post} />
        </Link>
      ))}
    </section>
  );
}
