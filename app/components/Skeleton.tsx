import Page from "./Page";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  children: React.ReactNode;
}

export default function Skeleton({ children }: SkeletonProps) {
  return (
    <Page className={styles.skeleton}>
      {children}
    </Page>
  );
}