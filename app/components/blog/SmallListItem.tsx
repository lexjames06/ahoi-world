import React from 'react';
import Image from "next/image";
import getFormattedDate from "@/lib/getFormattedDate";
import styles from "./SmallListItem.module.scss";

type Props = {
  post: BlogPost;
}

export default function SmallListItem({ post }: Props) {
  const {
    title,
    date: dateString,
    image,
    length,
  } = post;
  const date = getFormattedDate(dateString);

  return (
    <div className={styles.item}>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{length} min read • {date}</p>
      </div>
      <span className={styles.coverImage}>
				<Image src={`data:image/png;base64,${image}`} fill={true} alt={title} />
			</span>
    </div>
  );
}