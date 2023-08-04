"use client";
import { useRouter } from "next/navigation";
import styles from "./SeedButton.module.scss";
import { SeedOptions } from "@ahoi-world/types/Seed";

type Props = {
  option: SeedOptions;
};

export function SeedButton({ option }: Props) {
  const router = useRouter();
  const seedData = async () => {
    const url = "/seed/api";

    const { message, error } = await fetch(url,{
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ option }),
		}).then((res) => res.json());
    
    if (error) {
      console.log("There was an error seeding the data: ", error.errors);
      return;
    }

    console.log({message});
    
    router.refresh();
  };

  return (
    <button className={styles.seed} onClick={seedData}>
      Add Data
    </button>
  );
};