"use client";
import { useEffect, useState } from "react";

type OnScrollProps = {
  container?: string;
};

type ScrollDetails = {
  scrollHeight: number;
  pageHeight: number;
  viewHeight: number;
}

export const useOnScroll = (props: OnScrollProps = {}) => {
	const [scrollDetails, setDetails] = useState<ScrollDetails>({
		scrollHeight: 0,
		pageHeight: 0,
		viewHeight: 0,
	});

	useEffect(() => {
		const handleScroll = () => {
			const body = document.body;
			const html = document.documentElement;
			let fullHeight = Math.max(
				body.scrollHeight,
				body.offsetHeight,
				html.clientHeight,
				html.scrollHeight,
				html.offsetHeight
			);

			if (props.container) {
				const client = document.getElementsByTagName(props.container)?.[0]
				fullHeight = Number(client?.clientHeight) || 0;
			}

			setDetails({
				scrollHeight: window.scrollY,
				pageHeight: fullHeight,
				viewHeight: window.innerHeight,
			});
		};

		window.addEventListener("scroll", handleScroll);

		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [props.container]);

	return scrollDetails;
}