"use client";
import { useState } from "react";
import styles from "./UserNavIcon.module.scss";
import { UserNavMenu } from "../UserNavMenu";
import { UserIcon } from "@ahoi-world/atoms/UserIcon";
import { User } from "@ahoi-world/types/UserTypes";

type Props = {
  user: User | null;
  isDesktop?: boolean;
}

export function UserNavIcon({ user, isDesktop = false }: Props) {
  const [showUserMenu, setShow] = useState(false);

  const toggleMenu = () => {
    if (isDesktop) {
      setShow((flag) => !flag);
    }
  };

  const closeMenu = () => {
    if (isDesktop) {
      setShow(false);
    }
  };

  return (
    <>
      <button className={styles.container} data-active={showUserMenu} onClick={toggleMenu}>
        <UserIcon isClickable={true} user={user} isMenu={true} />
      </button>

      {showUserMenu && (
        <UserNavMenu closeMenu={closeMenu} isOpen={showUserMenu} user={user} />
      )}
    </>
  );
}