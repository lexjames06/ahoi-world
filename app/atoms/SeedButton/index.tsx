"use client";
import { useRouter } from "next/navigation";
import styles from "./SeedButton.module.scss";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { User } from "@ahoi-world/types/UserTypes";

type Props = {
  option: SeedOptions;
  userId?: string | null;
  label?: string;
};

export function SeedButton({ option, userId = null, label }: Props) {
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
			body: JSON.stringify({ option, userId }),
		})
      .then((res) => res.json())
      .catch((error) => {
        console.log("seed error: ", error);
        return {
          message: "ERROR",
          error,
        };
      });
    
    if (error) {
      console.log("There was an error seeding the data: ", error.errors);
      return;
    }

    console.log({message});
    
    router.refresh();
  };

  return (
    <button className={styles.seed} onClick={seedData}>
      {label ?? "Add Data"}
    </button>
  );
};