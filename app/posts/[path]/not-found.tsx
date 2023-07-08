"use client";
import Page from "@/app/components/Page";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./not-found.module.scss";

export default function NotFound() {
	const router = useRouter();

	return (
		<Page className={styles.container}>
			<div className={styles.title}>The post you are looking for does not exist</div>
			<button className={styles.button} onClick={() => router.push("/posts")}>
				Go to Blog
			</button>
		</Page>
	);
}
