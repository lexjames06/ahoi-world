import styles from "./Toggle.module.scss";

type Props = {
  toggled: boolean;
  preventClose?: boolean;
  onClick: () => void;
}

export function Toggle({ toggled, preventClose = false, onClick }: Props) {
  return (
    <button
      className={styles.toggle}
      onClick={onClick}
      data-toggled={toggled}
      data-preventclose={preventClose}
    >
      <div className={styles.toggleThumb} data-preventclose={preventClose} />
    </button>
  );
}