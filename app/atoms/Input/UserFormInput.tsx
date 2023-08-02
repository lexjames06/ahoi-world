"use client";
import { SetStateAction, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import styles from "./UserFormInput.module.scss";
import { Field } from "@ahoi-world/pages/sign-in-or-register/types";

type Props = {
  label: string;
  type: "text" | "password";
  field: Field;
  value: string;
  hasError: boolean;
  errorMessages: string[];
  onChange: (...args: any) => void;
}

export function UserFormInput({ label, type, field, value, hasError, errorMessages, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <span className={styles.container}>
      <input
        type={isPassword && !showPassword ? "password" : "text"}
        name={field}
        value={value}
        data-dirty={!!value}
        data-errored={hasError}
        onChange={onChange}
      />

      {isPassword && (
        <span className={styles.icon} onClick={() => setShowPassword((old) => !old)}>
          {showPassword ? <BiHide /> : <BiShow />}
        </span>
      )}

      <label htmlFor={field}>{label}</label>

      {hasError && (
        <span className={styles.errorMessage}>
          {errorMessages.map((error) => <span key={error}>{error}</span>) ?? ""}
        </span>
      )}
    </span>
  );
}