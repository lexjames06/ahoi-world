"use client";
import { useRouter } from "next/navigation";
import styles from "./SeedButton.module.scss";

export function SeedButton() {
  const router = useRouter();
  const seedData = async () => {
    const url = "/seed/api";
    console.log({url})
    const { message } = await fetch(url).then((res) => res.json());
    console.log({message});
    router.refresh();
  };

  return (
    <button className={styles.seed} onClick={seedData}>
      Add Data
    </button>
  );
};