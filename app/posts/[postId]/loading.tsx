import Skeleton from "@/app/components/Skeleton";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <Skeleton>
			<span className={styles.skeleton_coverImage} />

			<span className={styles.skeleton_articleHeader}>
				<h2 />

				<p />

				<span className={styles.skeleton_shareIcons}>
					{Array.from(Array(3)).map((_, index) => (
						<span key={index} />
					))}
				</span>
			</span>

			<article className={styles.skeleton_blog}>
				<p />
				<p />
				<p />
				<h3 />
				<p />
				<p />
				<p />
				<span />
				<p />
				<p />
				<p />
				<h3 />
				<p />
				<p />
				<p />
				<span />
				<p />
				<p />
				<p />
				<h3 />
				<p />
				<p />
				<p />
				<span />
				<p />
				<p />
				<p />
				<h3 />
				<p />
				<p />
				<p />
			</article>
			
			<div className={styles.skeleton_articleFooter}>
				<span className={styles.skeleton_shareIcons}>
					{Array.from(Array(3)).map((_, index) => (
						<span key={index} />
					))}
				</span>
			</div>
    </Skeleton>
  );
}