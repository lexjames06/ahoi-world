"use client";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import Page from "@/app/components/Page";

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