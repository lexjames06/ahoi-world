"use client";
import { useState } from "react";
import styles from "./UserNavIcon.module.scss";
import UserNavMenu from "./UserNavMenu";

export default function UserNavIcon({ user, onClick }: { user: User, onClick: () => void }) {
  const [showUserMenu, setShow] = useState(false);
  const { photoURL, displayName, email } = user;

  const toggleMenu = () => {
    setShow((flag) => !flag);
  };

  const closeMenu = () => {
    console.log("closing");
    setShow(false);
  };

  return (
    <>
      <button className={styles.container} data-active={showUserMenu} data-ismenu={true} onClick={toggleMenu}>
        {!!photoURL && (
          <img src={photoURL} alt={displayName ?? "user"} />
        )}

        {!photoURL && displayName && displayName.slice(0, 1)}

        {!photoURL && email && email.slice(0, 1)}

      </button>

      {showUserMenu && (
        <UserNavMenu closeMenu={closeMenu} isOpen={showUserMenu} />
      )}
    </>
  );
}