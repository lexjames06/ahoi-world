import { Inter } from "next/font/google";
import Theme from "./theme";
import { AuthContextProvider } from "@ahoi-world/providers/AuthContext";
import { FeatureFlagContextProvider } from "@ahoi-world/providers/FeatureFlag";
import { Navbar } from "@ahoi-world/molecules";
import "./styles/styles.scss";

const { BASE_URL } = process.env as Record<string, string>;

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	metadataBase: new URL(BASE_URL),
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
		<html lang="en" className={inter.className}>
			<body>
				<Theme>
					<AuthContextProvider>
						<FeatureFlagContextProvider>
							<Navbar />
							{children}
						</FeatureFlagContextProvider>
					</AuthContextProvider>
				</Theme>
			</body>
		</html>
	);
}
