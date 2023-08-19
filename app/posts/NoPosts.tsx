"use client";
import { SeedButton } from "@ahoi-world/atoms";
import styles from "./NoPosts.module.scss";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";

export function NoPosts() {
  const { user } = useAuthContext();

  return (
    <main className={styles.noData}>
      <span className={styles.noPosts}>There are no posts available at this time</span>
      {!!user && user.username === "seaj" && (
        <SeedButton option={SeedOptions.BLOGS} userId={user?.id} />
      )}
    </main>
  )
}