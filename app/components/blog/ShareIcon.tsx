"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { AiFillTwitterSquare, AiFillFacebook, AiFillLinkedin } from "react-icons/ai";
import { MdShare } from "react-icons/md";

export type SocialPlatform = "twitter" | "facebook" | "linkedIn" | "share";

type Props = {
  platform: SocialPlatform;
  title: string;
}

export default function ShareIcon({ platform, title }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location);
    }
  }, []);

  if (!location || (platform === "share" && !navigator?.share)) {
    return null;
  }

  const share = async (platform: string) => {
    switch(platform) {
      case "twitter":
        return router.push(`http://twitter.com/share?text=${encodeURIComponent(title ?? "")}&url=${location?.href}&hashtags=AHouseOfIdeas`);
      case "facebook":
        return router.push(`https://www.facebook.com/sharer/sharer.php?u=${location?.href}`);
      case "reddit":
        return router.push(`https://www.reddit.com/submit?url=${location?.href}&title=${encodeURIComponent(title ?? "")}&selftext=true`);
      case "share":
        await navigator.share({
          title: title,
          text: title,
          url: location?.href,
        }).then(() => console.log("success"))
          .catch((err) => console.log(err));
      default:
        return null;
    }
  }

  const getButton = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <AiFillFacebook color="#4267B2" />;
      case "linkedIn":
        return <AiFillLinkedin color="#0072b1" />;
      case "twitter":
        return <AiFillTwitterSquare color="#00acee" />;
      case "share":
        return <MdShare />;
      default:
        return null;
    }
  };

  return (
    <button onClick={() => share(platform)}>
      {getButton(platform)}
    </button>
  );
}