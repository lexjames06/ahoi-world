import styles from "./LoadingSpinner.module.scss";

type Props = {
  scale?: number;
}

export function LoadingSpinner({ scale = 1 }: Props) {
  return (
    <span className={styles.container} style={{ transform: `scale(${scale})` }}>
      <span className={styles.dot} data-order={1} />
      <span className={styles.dot} data-order={2} />
      <span className={styles.dot} data-order={3} />
      <span className={styles.dot} data-order={4} />
    </span>
  );
}