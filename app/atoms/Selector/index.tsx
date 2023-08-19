"use client";
import React from "react";
import styles from "./Selector.module.scss";

export type SelectorOption = {
  key: string;
  value: string;
}

type Props = {
  activeOption: string | null;
	options: SelectorOption[];
	loading?: boolean;
	includeAll?: boolean;
	onSelect: (option: string) => void;
};

export function Selector({ activeOption, options, loading = false, includeAll = false, onSelect }: Props) {
	if (loading) {
		return (
			<div className={styles.skeleton_container}>
				{Array.from(Array(5)).map((_, index) => (
					<span key={index} className={styles.skeleton_option} />
				))}
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.overflowContainer}>
				{includeAll && (
					<span className={styles.option} onClick={() => onSelect("all")} data-active={!activeOption}>
						All
					</span>
				)}
				{options.map((option) => (
					<span
						key={option.key}
						className={styles.option}
						onClick={() => onSelect(option.key)}
						data-active={activeOption === option.key}
					>
						{option.value}
					</span>
				))}
			</div>
		</div>
	);
}
