import { MdHome, MdAccountBox, MdArticle, MdEmail } from "react-icons/md";
import type { IconType } from "react-icons";

export type Option = {
	label: string;
	icon: IconType;
	link: string;
	divider?: boolean;
	target?: string;
};

export const navOptions: Option[] = [
  // {
  //   label: "Home",
  //   icon: MdHome,
  //   link: "/",
  // },
  {
    label: "About",
    icon: MdAccountBox,
    link: "/about",
  },
  {
    label: "Blog",
    icon: MdArticle,
    link: "/posts",
  },
  {
    label: "Contact",
    icon: MdEmail,
    link: "mailto:a.stewart.developer@gmail.com",
    divider: true,
    target: "_blank",
  },
];