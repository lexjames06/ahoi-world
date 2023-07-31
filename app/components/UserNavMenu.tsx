"use client";
import { signout } from "@/lib/users";
import { PiSignOut } from "react-icons/pi"
import styles from "./UserNavMenu.module.scss";
import { useCallback, useEffect } from "react";

const options = [
  {
    label: "sign out",
    action: signout,
    icon: PiSignOut,
  },
];

type Props = {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function UserNavMenu({ isOpen, closeMenu }: Props) {
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

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.userNavMenu} data-ismenu={true}>
          {options.map((option) => (
            <button key={option.label} className={styles.option} onClick={option.action}>
              <option.icon />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}