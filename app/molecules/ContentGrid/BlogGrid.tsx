"use client";
import { User } from "@ahoi-world/types/UserTypes";
import styles from "./BlogGrid.module.scss";
import { getUserBlogs } from "@ahoi-world/lib/posts";
import { SmallBlogCard } from "@ahoi-world/atoms";
import { useCallback, useEffect, useState } from "react";
import { BlogPost } from "@ahoi-world/types/PostTypes";
import Link from "next/link";
import { dummyPost } from "@ahoi-world/posts/utils/skeleton-post";
import { SkeletonModule } from "@ahoi-world/templates/SkeletonPage";

type Props = {
  user: User;
}

export function BlogGrid({ user }: Props) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const loadBlogs = useCallback(async () => {
    const blogList = await getUserBlogs(user);
    setBlogs(blogList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!blogs.length) {
      loadBlogs();
    }
  }, [blogs, loadBlogs]);

  if (loading) {
    return (
      <SkeletonModule>
        <section className={styles.grid}>
          {Array.from(Array(9)).map((_, index) => (
            <span key={index} className={styles.card}>
              <SmallBlogCard key={index} post={dummyPost} loading={true} />
            </span>
          ))}
        </section>
      </SkeletonModule>
    );
  }

  return (
    <div className={styles.grid}>
      {blogs.length > 0 && blogs.map((blog) => (
        <Link key={blog.id} href={`/posts/${blog.path}`} className={styles.card}>
          <SmallBlogCard post={blog} loading={loading} />
        </Link>
      ))}
      <span className={styles.listEnd}>
        That&#39;s all of <span className={styles.username}>@{user.username}</span> posts for now
      </span>
    </div>
  );
}