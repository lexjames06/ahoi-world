import styles from "./UserNavIcon.module.scss";

export default function UserNavIcon({ user, onClick }: { user: User, onClick: () => void }) {
  const { photoURL, displayName, email } = user;
  console.log({photoURL});
  console.log({displayName});

  return (
    <button className={styles.container} onClick={onClick}>
      {!!photoURL && (
        <img src={photoURL} alt={displayName ?? "user"} />
      )}

      {!photoURL && displayName && displayName.slice(0, 1)}

      {!photoURL && email && email.slice(0, 1)}
    </button>
  );
}