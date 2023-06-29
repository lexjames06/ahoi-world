"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./CategoriesSlider.module.scss";

type Props = {
	categories: string[];
};

const convertCategoryName = (category: string): string => {
	return category.replace(/_/g, " ");
};

export default function CategoriesSlider({ categories }: Props) {
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
