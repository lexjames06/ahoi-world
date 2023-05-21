"use client";
import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import styles from "./Navbar.module.css";
import Link from "next/link";
import Menu from "./Menu";

export default function Navbar() {
  const [menuOpen, toggleMenu] = useState(false);

  if (typeof window !== "undefined") {
    let prevScrollpos = window.pageYOffset;
    
    window.onscroll = function() {
      const windowWith = window.innerWidth;

      if (windowWith > 480) {
        return;
      }

      if (!menuOpen) {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollpos > currentScrollPos || currentScrollPos < 50) {
          document.getElementsByTagName("nav")[0].style.top = "0";
        } else {
          document.getElementsByTagName("nav")[0].style.top = "-3.125rem";
        }

        prevScrollpos = currentScrollPos;
      }
    }
  }

  return (
    <nav className="nav">
      <span className={styles.mobileMenu}><Menu show={menuOpen} toggleMenu={toggleMenu} /></span>

      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {/* <p>
            ahoi.
          </p>
          <p>
            world
          </p> */}
          <p>
            a house
          </p>
          <p>
            of ideas
          </p>
        </Link>
        
        <span className={styles.menuButton} onClick={() => toggleMenu((state) => !state)}>
          <MdMenu />
        </span>

        <div className={styles.desktopMenu} onClick={() => toggleMenu(false)}>
          <Menu show={menuOpen} />
        </div>
      </div>
    </nav>
  );
}
