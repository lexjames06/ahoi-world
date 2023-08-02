import styles from "./LoadingSpinner.module.scss";

export function LoadingSpinner() {
  return (
    <span className={styles.container}>
      <span className={styles.dot} data-order={1} />
      <span className={styles.dot} data-order={2} />
      <span className={styles.dot} data-order={3} />
      <span className={styles.dot} data-order={4} />
    </span>
  );
}