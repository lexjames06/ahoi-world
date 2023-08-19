import React from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import { Page } from "@ahoi-world/templates/Page";
import { getSortedProjectsData } from "@ahoi-world/lib/projects";

export function generateMetadata() {
	return {
		title: "About AJ",
	};
}

export default function About() {
	const { projects, bio, name, job, image } = getSortedProjectsData();

	return (
		<Page>
			<span className={styles.image}>
				<Image src={`data:image/png;base64,${image}`} fill={true} alt={name ?? ""} />
			</span>
			<div className={styles.body}>
				<h1 className={styles.name}>{name}</h1>
				<span className={styles.job}>{job}</span>
				<h2 className={styles.subheader}>Bio:</h2>
				<p className={styles.bio}>{bio}</p>
				<h2 className={styles.subheader}>Latest Projects:</h2>

				{projects.map((project) => (
					<div key={project.id} className={styles.project}>
						<h3>{project.role}</h3>
						<p>{project.name}</p>
						<span className={styles.company}>{project.company}</span>
						<div className={styles.technologies}>
							{project.technologies.map((technology) => (
								<span key={technology}>{technology}</span>
							))}
						</div>
					</div>
				))}
			</div>
		</Page>
	);
}
