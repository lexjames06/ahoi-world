"use client";
import Page from "@/app/components/Page";
import styles from "./page.module.scss";
import { Input } from "@/app/components/Input";
import { Field } from "@/app/components/sign-in-or-register/types";
import { useState } from "react";
import { ZodError } from "@/app/components/sign-in-or-register/form";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { sendResetPasswordEmail } from "@/lib/users";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

type ForgotPasswordErrors = {
  [Field.EMAIL]?: ZodError;
  [Field.FORM]?: ZodError;
};

export default function ForgotPassword() {
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleValueChange = (
    value: string
  ): void => {
    if (!!Object.keys(errors)?.length) {
      setErrors({});
    }

    setEmail(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
		e.preventDefault();

		const response = await fetch("/sign-in/forgot-password/api", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (data.error) {
			setErrors(data.error.errors);
			setLoading(false);
			return;
		}

		const userError = await sendResetPasswordEmail(email);

		console.log({userError});

		if (userError?.hasError) {
      setErrors({ [userError.path]: { _errors: [userError.message] } });
			setLoading(false);
			return;
		} else {
      setLoading(false);
      setSuccessMessage("We've sent a reset link to your email.");
      return;
    }
  };

  const submitDisabled = !!Object.keys(errors)?.length;
  const hasFormErrors = !!errors[Field.FORM];

  return (
    <Page className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Forgot Password?</h2>
          <p>No worries, we&apos;ll send you a one time password reset link</p>
        </div>

      <form onSubmit={onSubmit}>
        {!!successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        {!successMessage && (
          <>
            <Input
              label="Enter your email"
              type="text"
              field={Field.EMAIL}
              value={email}
              hasError={!!errors[Field.EMAIL]}
              errorMessages={errors[Field.EMAIL]?._errors ?? []}
              onChange={(e) => handleValueChange(e.currentTarget.value)}
            />

            {hasFormErrors && (
              <span className={styles.formElement}>
                <span className={styles.errorMessage}>
                  {errors.form?._errors?.map((error) => <span key={error} style={{ textAlign: "center" }}>{error}</span>) ?? ""}
                </span>
              </span>
            )}

            <button disabled={loading || submitDisabled}>
              {loading ? <LoadingSpinner /> : "Send Code"}
            </button>

          </>
        )}

        <Link href="/sign-in" className={styles.returnLink}><p><BiArrowBack /> Back to login</p></Link>
      </form>
      </div>
    </Page>
  );
}