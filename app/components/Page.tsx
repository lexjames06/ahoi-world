import React, { ReactNode, forwardRef } from 'react'
import { TiSocialTwitter, TiSocialLinkedin } from "react-icons/ti";
import Link from "next/link";
import { navOptions } from "./constants";
import styles from "./Page.module.scss";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

type Ref = HTMLElement;

const Page = forwardRef<Ref, Props>((props, ref) => {
  const { children, ...restProps } = props;

  const social = [
    {
      name: 'twitter',
      link: 'https://www.twitter.com/seaj_ctc',
      icon: TiSocialTwitter,
      target: '_blank',
    },
    {
      name: 'linkedin',
      link: 'https://www.linkedin.com/in/alexander-j-stewart/',
      icon: TiSocialLinkedin,
      target: '_blank',
    },
  ];

  return (
    <>
      <main {...restProps} ref={ref ?? null}>
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
            {social.map((platform) => (
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
});

export default Page;