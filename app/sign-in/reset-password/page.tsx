"use client";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import Page from "@/app/components/Page";
import styles from "./page.module.scss";
import { Input } from "@/app/components/Input";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useState } from "react";
import { Field } from "@/app/components/sign-in-or-register/types";
import { ZodError } from "@/app/components/sign-in-or-register/form";
import { resetPassword } from "@/lib/users";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

const confirmPasswordError = "The passwords do not match";

type ResetPasswordErrors = {
  [Field.PASSWORD]?: ZodError;
  [Field.CONFIRM_PASSWORD]?: ZodError;
  [Field.FORM]?: ZodError;
};

export default function ResetPassword() {
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  console.log({user})

  const oobCode = searchParams.get("oobCode") ?? "";

  const deleteError = (field: keyof ResetPasswordErrors) => {
		const errorsCopy = errors;
		delete errorsCopy[field];
		setErrors(errorsCopy);
	};

	const addError = (field: keyof ResetPasswordErrors, message:string) => {
		const updatedErrors = errors;
		updatedErrors[field] = { _errors: [message] };
		setErrors(updatedErrors);
	};

  const handleChangePassword = (value: string) => {
    if (errors[Field.PASSWORD]) {
      deleteError(Field.PASSWORD);
    }

    if (value === confirmPassword && !!errors.confirmPassword) {
      deleteError(Field.CONFIRM_PASSWORD);
    } else if (value !== confirmPassword && confirmPassword && !errors.confirmPassword) {
      addError(Field.CONFIRM_PASSWORD, confirmPasswordError);
    }

    if (errors.form) {
			deleteError(Field.FORM);
		}

    setPassword(value);
  };

  const handleChangeConfirmPassword = (value: string) => {
    if (errors[Field.CONFIRM_PASSWORD]) {
      deleteError(Field.CONFIRM_PASSWORD);
    }

    if (value === password && !!errors.confirmPassword) {
      deleteError(Field.CONFIRM_PASSWORD);
    } else if (value !== password && !errors.confirmPassword) {
      addError(Field.CONFIRM_PASSWORD, confirmPasswordError);
    }

    if (errors.form) {
			deleteError(Field.FORM);
		}

    setConfirmPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
		e.preventDefault();

		const response = await fetch("/sign-in/reset-password/api", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ password, confirmPassword }),
		});

		const data = await response.json();

		if (data.error) {
			setErrors(data.error.errors);
			setLoading(false);
			return;
		}

    // TODO: extract oobCode from search params
		const userError = await resetPassword(oobCode, password);

		console.log({userError});

		if (userError?.hasError) {
      setErrors({ [userError.path]: { _errors: [userError.message] } });
			setLoading(false);
			return;
		} else {
      setLoading(false);
      setSuccessMessage("Your password was successfully reset!");
      return;
    }
  };
  
  const hasPasswordErrors = !!errors[Field.PASSWORD];
  const hasConfirmPasswordErrors = !!errors[Field.CONFIRM_PASSWORD];
  const hasFormErrors = !!errors[Field.FORM];
  const submitDisabled = loading || (hasFormErrors && !!password && !!confirmPassword);

  // TODO: Refactor form to be reset password form
  return (
    <Page className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Reset your password</h2>
          <p>Make sure to use a password you can remember this time 😉</p>
        </div>

      <form onSubmit={onSubmit}>
        {!!successMessage && (
          <>
            <p className={styles.successMessage}>{successMessage}</p>
            <Link href="/sign-in" className={styles.returnLink}><p><BiArrowBack /> Back to login</p></Link>
          </>
        )}

        {!successMessage && (
          <>
            <Input
              label="New Password"
              type="password"
              field={Field.PASSWORD}
              value={password}
              hasError={hasPasswordErrors}
              errorMessages={errors[Field.PASSWORD]?._errors ?? []}
              onChange={(e) => handleChangePassword(e.currentTarget.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              field={Field.CONFIRM_PASSWORD}
              value={confirmPassword}
              hasError={hasConfirmPasswordErrors}
              errorMessages={errors[Field.CONFIRM_PASSWORD]?._errors ?? []}
              onChange={(e) => handleChangeConfirmPassword(e.currentTarget.value)}
            />

            {hasFormErrors && (
              <span className={styles.formElement}>
                <span className={styles.errorMessage}>
                  {errors.form?._errors?.map((error) => <span key={error} style={{ textAlign: "center" }}>{error}</span>) ?? ""}
                </span>
              </span>
            )}

            <button disabled={submitDisabled}>
              {loading ? <LoadingSpinner /> : "Send Code"}
            </button>

            <Link href="/sign-in" className={styles.returnLink}><p><BiArrowBack /> Back to login</p></Link>
          </>
        )}
      </form>
      </div>
    </Page>
  );
}