/* eslint-disable @next/next/no-img-element */
import React from "react";

export const prepareBodyForParse = (body: string[]) => {
	const listItemRegEx = /^[0-9]\./;
	const listItems = body.filter((section) => listItemRegEx.test(section));

	if (!listItems.length) {
		return body;
	}

	const list = listItems.reduce((listString, item, index) => {
		const string = item.split(listItemRegEx)[1].trimStart();
		
		if (index === 0) {
			return "ORDERED-LIST: " + string;
		}

		return listString + "\n" + string;
	}, "");

	const firstListItemIndex = body.indexOf(listItems[0]);
	const preppedBody = body;
	preppedBody.splice(firstListItemIndex, listItems.length, list);

	return preppedBody;
};

export const generateHeader = (markdownHeader: string) => {
	const headerNumber = markdownHeader.split(" ")[0].length;
	const header = React.createElement(
		`h${headerNumber}`,
		[],
		markdownHeader.slice(headerNumber),
	);

	return header;
};

export const generateImage = (markdownImage: string) => {
	const alt = markdownImage.split("[")[1].split("]")[0];
	const src = markdownImage.split("(")[1].split(")")[0];

	return <img src={src} alt={alt} loading="lazy" />
}

export const generateOrderedList = (markdownListItem: string) => {
	const listItems = markdownListItem.slice(14).split("\n");
	
	return (
		<ol>
			{listItems.map((item, index) => <li key={`${item.slice(0, 10)} ${index}`}>{item}</li>)}
		</ol>
	);
};