import React from 'react';
import Image from "next/image";
import styles from "./SmallBlogCard.module.scss";
import { BlogPost } from "@ahoi-world/types/PostTypes";
import getFormattedDate from "@ahoi-world/lib/getFormattedDate";

type Props = {
  post: BlogPost;
  loading?: boolean;
}

export function SmallBlogCard({ post, loading = false }: Props) {
  const {
    title,
    date: unformattedDate,
    image,
    length,
  } = post;
  const date = getFormattedDate(unformattedDate);

  if (loading) {
    return (
      <div className={styles.skeleton_card}>
        <div className={styles.skeleton_details}>
          <h3 />
          <h3 />
          <p />
        </div>
        <span className={styles.skeleton_coverImage} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{length} min read • {date}</p>
      </div>
      <span className={styles.coverImage}>
				<Image src={image} fill={true} alt={title} />
			</span>
    </div>
  );
}