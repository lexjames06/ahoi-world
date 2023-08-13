import { BsFillPersonFill } from "react-icons/bs";
import styles from "./UserIcon.module.scss";
import { User } from "@ahoi-world/types/UserTypes";
import Image from "next/image";

type Props = {
  user: User | null;
  size?: number;
  isMenu?: boolean;
  isClickable?: boolean;
  allowClose?: boolean;
};

export function UserIcon({ user, size = 1, isMenu = false, isClickable = false, allowClose = false }: Props) {
  if (!user) {
    return (
      <span
        className={styles.container}
        data-isclickable={isClickable}
        data-ismenu={isMenu}
        data-allowclose={allowClose}
        style={{height: `calc(${size} * 2.25rem)`}}
      >
        <BsFillPersonFill data-allowclose={allowClose} height={20} width={20} style={{
          transform: `scale(calc(${size} * 1.75))`,
          marginTop: `calc(${size} * 0.3rem)`,
        }} />
      </span>
    );
  }

  const { photoURL, displayName, email, username } = user;
  const profileInitial = displayName?.slice(0, 1) ?? username?.slice(0, 1) ?? email?.slice(0, 1) ?? "";
  
  return (
    <span
      className={styles.container}
      data-isclickable={isClickable}
      data-ismenu={isMenu}
      data-allowclose={allowClose}
      style={{height: `calc(${size} * 2.25rem)`, fontSize: `${size * 1.5}rem`}}
    >
      {!!photoURL && (
        <Image src={photoURL} alt={displayName ?? "user"} data-allowclose={allowClose} />
      )}

      {!photoURL && profileInitial.toUpperCase()}
    </span>
  );
}