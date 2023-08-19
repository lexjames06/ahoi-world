import styles from "./page.module.scss";
import { SeedOptions } from "@ahoi-world/types/Seed";
import { SeedButton } from "@ahoi-world/atoms";
import { getUserProfileByUsername } from "@ahoi-world/lib/users";
import { UserProfile } from "@ahoi-world/organisms/user-profile/user-profile";

export default async function Profile({ params }: { params: { username: string } }) {
  const { username } = params;
  const userProfile = await getUserProfileByUsername(username);

  if (!userProfile) {
    return (
      <main className={styles.noData}>
				<span className={styles.noUser}>User <span className={styles.name}>@{username}</span> was not found</span>
				{/* <SeedButton option={SeedOptions.USERS} /> */}
			</main>
    )
  }

  return <UserProfile profile={userProfile} />;
}