"use client";
import React, { useEffect, useState } from 'react'
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useOnScroll } from "@ahoi-world/hooks/use-on-scroll";
import styles from "./FloatingBackButton.module.scss"

type Props = {}

export function FloatingBackButton({}: Props) {
  const router = useRouter();
  const { pageHeight, viewHeight, scrollHeight } = useOnScroll({ container: "main" });
  const [progressBarWidth, setProgress] = useState<number>(0);

  useEffect(() => {
		if (pageHeight) {
			const complete = pageHeight - viewHeight;
			const calculatedProgress = (scrollHeight / complete) * 100;
			const progress = Math.min(calculatedProgress, 100);

      if (scrollHeight < 0) {
        setProgress(0);
      } else {
        setProgress(progress);
      }
		}
	}, [pageHeight, viewHeight, scrollHeight]);

  const onClick = () => {
    if (window && window.history.length > 1) {
      console.log("going back")
      router.back();
    } else {
      console.log("going to posts")
      router.push("/posts");
    }
  }

  return (
    <button className={styles.back} onClick={onClick}>
      <MdArrowBack />
      <svg viewBox="0 0 36 36" className={styles.circle}>
        <path
          strokeDasharray={`${progressBarWidth} 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
    </button>
  )
}