"use client";
import { SetStateAction, useState } from "react";
import styles from "./Input.module.scss";
import { Field } from "./sign-in-or-register/types";
import { BiHide, BiShow } from "react-icons/bi";

type Props = {
  label: string;
  type: "text" | "password";
  field: Field;
  value: string;
  hasError: boolean;
  errorMessages: string[];
  onChange: (...args: any) => void;
}

export function Input({ label, type, field, value, hasError, errorMessages, onChange }: Props) {
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