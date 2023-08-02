"use client";
import { useState } from "react";
import styles from "./UserNavIcon.module.scss";
import { UserNavMenu } from "../UserNavMenu";
import { UserIcon } from "@ahoi-world/atoms/UserIcon";
import { User } from "@ahoi-world/types/UserTypes";

export function UserNavIcon({ user }: { user: User | null }) {
  const [showUserMenu, setShow] = useState(false);

  const toggleMenu = () => {
    setShow((flag) => !flag);
  };

  const closeMenu = () => {
    console.log("closing");
    setShow(false);
  };

  return (
    <>
      <button className={styles.container} data-active={showUserMenu} onClick={toggleMenu}>
        <UserIcon user={user} isMenu={true} />
      </button>

      {showUserMenu && (
        <UserNavMenu closeMenu={closeMenu} isOpen={showUserMenu} user={user} />
      )}
    </>
  );
}