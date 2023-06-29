import React from 'react';
import Image from "next/image";
import getFormattedDate from "@/lib/getFormattedDate";
import styles from "./LargeListItem.module.scss";

type Props = {
  post: BlogPost;
  loading?: boolean;
}

export default function LargeListItem({ post, loading = false }: Props) {
  const {
    title,
    date: dateString,
    image,
    length,
  } = post;
  const date = getFormattedDate(dateString);

  if (loading) {
    return (
      <div className={styles.skeleton_item}>
        <div className={styles.skeleton_details}>
          <h2 />
          <h2 />
          <p />
        </div>
        <span className={styles.skeleton_coverImage} />
      </div>
    );
  }

  return (
    <div className={styles.item}>
      <div className={styles.details}>
        <h2>{title}</h2>
        <p>{length} min read • {date}</p>
      </div>
      <span className={styles.coverImage}>
				<Image src={`data:image/png;base64,${image}`} fill={true} alt={title} />
			</span>
    </div>
  );
}