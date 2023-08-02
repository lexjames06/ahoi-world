"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import { Page } from "@ahoi-world/templates/Page";
import { LoadingSpinner } from "@ahoi-world/atoms";

export default function AuthAction() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const mode = searchParams.get("mode");
	const oobCode = searchParams.get("oobCode");

	if (mode === "resetPassword") {
		const path = `/sign-in/reset-password?oobCode=${oobCode}`;

		router.push(path);
	}

	return (
		<Page className={styles.container}>
			<LoadingSpinner />
		</Page>
	);
}
