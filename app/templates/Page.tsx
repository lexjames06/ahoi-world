import React, { ReactNode } from 'react'
import Link from "next/link";
import { navOptions, socialPlatforms } from "./constants";
import styles from "./Page.module.scss";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Page({ children, ...restProps }: Props) {
  return (
    <>
      <main {...restProps}>
        {children}
      </main>

      <footer>
        <div className={styles.sections}>
          <div className={`${styles.section} ${styles.brand}`}>
            <span>A HOUSE</span>
            <span>OF IDEAS</span>
          </div>
          <div className={styles.section}>
            <h3>Pages</h3>
            {navOptions.map((option) => (
              <Link key={option?.label} href={option?.link} target={option?.target}>
                {option.label}
              </Link>
            ))}
          </div>
          <div className={`${styles.section} ${styles.socialIcons}`}>
            {socialPlatforms.map((platform) => (
              <Link key={platform.name} href={platform.link} target={platform.target}>
                <platform.icon />
              </Link>
            ))}
          </div>
        </div>
        <span className={styles.copyright}>
          &#169; {new Date().getFullYear()} ahoi.world All rights reserved
        </span>
      </footer>
    </>
  );
}
