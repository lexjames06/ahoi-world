import { Page } from "./Page";
import styles from "./SkeletonPage.module.scss";

interface SkeletonPageProps {
  children: React.ReactNode;
}

export function SkeletonPage({ children }: SkeletonPageProps) {
  return (
    <Page className={styles.skeleton}>
      {children}
    </Page>
  );
}

export function SkeletonModule({ children }: SkeletonPageProps) {
  return (
    <div className={styles.skeleton}>
      {children}
    </div>
  );
}