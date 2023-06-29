"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./CategoriesSlider.module.scss";

type Props = {
	categories: string[];
  loading?: boolean;
};

const convertCategoryName = (category: string): string => {
	return category.replace(/_/g, " ");
};

export default function CategoriesSlider({ categories, loading = false }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const activeCategory = searchParams.get("category");

	const onCategoryClick = (category: string): void => {
		if (category === "all") {
			router.push("/posts");
			return;
		}

		router.push(`/posts?category=${category}`);
	};

  if (loading) {
    return (
      <div className={styles.skeleton_container}>
        {Array.from(Array(5)).map((_, index) => (
          <span
            key={index}
            className={styles.skeleton_category}
          />
        ))}
      </div>
    );
  }

	return (
		<div className={styles.container}>
      <div className={styles.overflowContainer}>
        <span
          className={styles.category}
          onClick={() => onCategoryClick('all')}
          data-active={!activeCategory}
        >
          All
        </span>
        {categories.map((category) => (
          <span
            key={category}
            className={styles.category}
            onClick={() => onCategoryClick(category)}
            data-active={activeCategory === category}
          >
            {convertCategoryName(category)}
          </span>
        ))}
      </div>
		</div>
	);
}
