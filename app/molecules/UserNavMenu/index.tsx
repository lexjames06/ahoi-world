"use client";
import { signout } from "@ahoi-world/lib/users";
import { PiSignOut, PiSignIn } from "react-icons/pi"
import { FaHouseUser } from "react-icons/fa"
import { IoMdSettings } from "react-icons/io"
import styles from "./UserNavMenu.module.scss";
import { useCallback, useEffect } from "react";
import { UserIcon } from "@ahoi-world/atoms/UserIcon";
import Link from "next/link";
import { IconType } from "react-icons";
import { User } from "@ahoi-world/types/UserTypes";
import { usePathname } from "next/navigation";

type UserMenuOption = {
  label: string;
  action: () => {},
  icon: IconType;
}

const options: UserMenuOption[] = [] ?? [
  {
    label: "profile",
    action: () => {},
    icon: FaHouseUser,
  },
  {
    label: "settings",
    action: () => {},
    icon: IoMdSettings,
  },
];

const signoutOption = {
  label: "sign out",
  action: signout,
  icon: PiSignOut,
};

const signinOption = {
  label: "sign in",
  action: "/sign-in",
  icon: PiSignIn,
};

type Props = {
  isOpen: boolean;
  user: User | null;
  closeMenu: () => void;
}

export function UserNavMenu({ isOpen, user, closeMenu }: Props) {
  const pathname = usePathname();

  const handleMenuToggle = useCallback((e: Event) => {
    const isMenu = (e.target as HTMLElement).getAttribute('data-ismenu');
      if (!isMenu && isOpen) {
        closeMenu();
      }
  }, [closeMenu, isOpen]);

  useEffect(() => {
    window.addEventListener("click", handleMenuToggle);

    return () => {
      window.removeEventListener("click", handleMenuToggle);
    }
  }, []);

  if (!user) {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.userNavMenu} data-ismenu={true}>
            <div className={styles.mainMenu}>
              {!user && (
                <Link href={signinOption.action} className={styles.option}>
                  <signinOption.icon />
                  {signinOption.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { displayName, username } = user;
  const isUserProfile = pathname.includes("/users/") && pathname.split("/").length === 3;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.userNavMenu} data-ismenu={true}>
          <div className={styles.mainMenu}>
            <span className={styles.header}>
              <Link href={`/users/${username}`} data-ismenu={false} className={styles.userIcon} onClick={closeMenu}>
                <UserIcon isClickable={!isUserProfile} user={user} size={2} />
              </Link>
              {displayName && <span className={styles.displayName}>{displayName}</span>}
              {username && <span className={styles.username}>@{username}</span>}
            </span>

            {options.length > 0 && (
              <span className={styles.options}>
                {options.map((option) => (
                  <button key={option.label} className={styles.option} onClick={option.action}>
                    <option.icon />
                    {option.label}
                  </button>
                ))}
              </span>
            )}
          </div>

          <button key={signoutOption.label} className={styles.option} data-signout onClick={signoutOption.action}>
            <signoutOption.icon />
            {signoutOption.label}
          </button>
        </div>
      </div>
    </div>
  );
}