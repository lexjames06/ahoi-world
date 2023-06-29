import Skeleton from "../components/Skeleton";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <Skeleton>
			<span className={styles.skeleton_image} />
			<div className={styles.skeleton_body}>
				<h1 className={styles.skeleton_name} />
				<span className={styles.skeleton_job} />
				<h2 className={styles.skeleton_subheader} />
				<p className={styles.skeleton_bio} />
				<p className={styles.skeleton_bio} />
				<h2 className={styles.skeleton_subheader} />

				{Array.from(Array(5)).map((_, index) => (
					<div key={index} className={styles.skeleton_project}>
						<h3 />
						<p />
						<span className={styles.skeleton_company} />
						<div className={styles.skeleton_technologies}>
							{Array.from(Array(5)).map((_, index) => (
								<span key={index} />
							))}
						</div>
					</div>
				))}
			</div>
		</Skeleton>
  );
}