/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

// Load font
const interBoldP = fetch(new URL(`${baseUrl}/fonts/Inter-Bold.ttf`, import.meta.url))
	.then((res) => res.arrayBuffer())
	.catch((err) => console.log({err}));

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "A House Of Ideas";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image({ params: { path } }: { params: { path: string } }) {
	try {
		const { image, title, user } = await fetch(`${baseUrl}/posts/${path}/api`).then((res) => res.json());
		const username = user ? `@${user.username}` : "";
		const subtext = username ? "written by" : "an idea from the house";
		const green = "#2FE282";
	
		const interBold = await interBoldP as ArrayBuffer;
	
		return new ImageResponse(
			(
				<div style={{
					width: `${size.width}px`,
					height: `${size.height}px`,
					display: "flex",
					position: "relative",
					fontFamily: "Inter",
					fontWeight: 700,
					backgroundColor: "black",
				}}>
					<div style={{
						position: "absolute",
						display: "flex",
						width: "100%",
						height: "100%",
						backgroundColor: "#000",
						opacity: "0.5",
					}}>
						<img style={{
							display: "flex",
							width: `100%`,
							height: `100%`,
							opacity: "0.75",
						}} src={image} alt={title} />
					</div>
					<div style={{
						display: "flex",
						width: "70%",
						height: "auto",
						margin: "5rem 10rem",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "flex-start",
						fontWeight: "bold",
					}}>
						<div style={{
							display: "flex",
							backgroundColor: green,
							padding: "0.125rem 1rem",
							borderRadius: "0.25rem",
						}}>
							<h2 style={{
								color: "#222",
								fontSize: "30px",
								lineHeight: "30px",
							}}>AHOI.WORLD</h2>
						</div>
						<h2 style={{
							color: "#FFFFFF",
							fontSize: "70px",
							lineHeight: "75px",
							textShadow: "4px 4px 4px rgba(0, 0, 0, 0.2)"
						}}>{title}</h2>
						<span style={{display: "flex", width: "100%", height: "5px", backgroundColor: green, margin: "1rem 0"}}></span>
						<h2 style={{
							color: "#fff",
							fontSize: "38px",
							lineHeight: "30px",
							textShadow: "4px 4px 4px rgba(0, 0, 0, 0.2)"
						}}>{subtext}<span style={{display: "flex", color: green, marginLeft: "0.75rem"}}>{username}</span></h2>
					</div>
					<div style={{display: "flex", position: "absolute", bottom: "0", right: "0", padding: "2.5rem 4rem"}}>
						<h2 style={{display: "flex", color: "#e4e4e4", fontSize: "20px",}}>A House Of Ideas</h2>
					</div>
				</div>
			),
			{
				...size,
				fonts: [
					{
						name: "Inter",
						data: interBold,
						style: "normal",
						weight: 700,
					},
				]
			}
		);
	} catch (error: any) {
		if (error.message) {
			console.log(error?.message);
		}
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
	}
}
