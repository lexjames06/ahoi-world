import { getPostData } from "@/lib/posts";
import Ahoi from "./ahoi";
import Navbar from "./components/Navbar";
import "./styles/styles.scss";

export const metadata = {
  title: {
    default: "AHOI",
    template: `%s | AHOI`,
  },
  description: {
    default: "A House Of Ideas",
    template: `%s`,
  },
};

type MetadataParams = {
	params: { id: string };
};

// export async function generateMetadata({ params }: MetadataParams) {
// 	const post = await getPostData(params.id);
// 	return {
// 		title: post.title,
// 		applicationName: "A House Of Ideas",
// 		authors: { name: "AJ Stewart", url: "https://www.ahoi.world" },
//     creator: 'AJ Stewart',
// 	};
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Ahoi>
					<Navbar />
					{children}
				</Ahoi>
			</body>
		</html>
	);
}
