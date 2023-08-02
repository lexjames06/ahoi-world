import { BsFillPersonFill } from "react-icons/bs";
import styles from "./UserIcon.module.scss";
import { User } from "@ahoi-world/types/UserTypes";

type Props = {
  user: User | null;
  size?: number;
  isMenu?: boolean;
};

export function UserIcon({ user, size = 1, isMenu = false }: Props) {
  if (!user) {
    return (
      <span className={styles.container} data-ismenu={isMenu} style={{height: `calc(${size} * 2.25rem)`}}>
        <BsFillPersonFill height={20} width={20} style={{
          transform: `scale(calc(${size} * 1.75))`,
          marginTop: `calc(${size} * 0.3rem)`,
        }} />
      </span>
    );
  }

  const { photoURL, displayName, email } = user;
  const profileInitial = displayName?.slice(0, 1) ?? email?.slice(0, 1) ?? "";
  
  return (
    <span className={styles.container} data-ismenu={isMenu} style={{height: `calc(${size} * 2.25rem)`}}>
      {!!photoURL && (
        <img src={photoURL} alt={displayName ?? "user"} />
      )}

      {!photoURL && profileInitial.toUpperCase()}
    </span>
  );
}