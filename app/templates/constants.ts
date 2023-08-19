import { ReactIcons } from "@ahoi-world/atoms";
import type { IconType } from "react-icons";

export type Option = {
	label: string;
	icon: IconType;
	link: string;
	divider?: boolean;
	target?: string;
};

export const navOptions: Option[] = [
  {
    label: "About",
    icon: ReactIcons.MdAccountBox,
    link: "/about",
  },
  {
    label: "Blog",
    icon: ReactIcons.MdArticle,
    link: "/posts",
  },
  // {
  //   label: "Contact",
  //   icon: MdEmail,
  //   link: "mailto:a.stewart.developer@gmail.com",
  //   divider: true,
  //   target: "_blank",
  // },
];

export const socialPlatforms = [
  {
    name: 'twitter',
    link: 'https://www.twitter.com/seaj_ctc',
    icon: ReactIcons.TiSocialTwitter,
    target: '_blank',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/alexander-j-stewart/',
    icon: ReactIcons.TiSocialLinkedin,
    target: '_blank',
  },
];