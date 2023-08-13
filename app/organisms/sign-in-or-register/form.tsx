"use client";
import { useState } from "react";
import Link from "next/link";
import { Field, FormType, UserFormField } from "./types";
import { createUserWithEmailPassword, signInWithEmailPassword } from "@ahoi-world/lib/users";
import { LoadingSpinner, UserFormInput } from "@ahoi-world/atoms";
import styles from "./form.module.scss";

const isEmpty = (object: Object): boolean => {
	return !Object.keys(object).length;
};

const confirmPasswordError = "The passwords do not match";

export type ZodError = {
	_errors?: string[];
};

type Errors = {
	[Field.EMAIL]?: ZodError;
	[Field.PASSWORD]?: ZodError;
	[Field.CONFIRM_PASSWORD]?: ZodError;
	[Field.FORM]?: ZodError;
};

type Props = {
  type: FormType;
}

const fieldKeys = Object.values(Field) as unknown as string[];

export function Form({ type }: Props) {
	const [errors, setErrors] = useState<Errors>({});
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const deleteError = (field: UserFormField) => {
		const errorsCopy = errors;
		delete errorsCopy[field];
		setErrors(errorsCopy);
	};

	const addError = (field: UserFormField, message:string) => {
		const updatedErrors = errors;
		updatedErrors[field] = { _errors: [message] };
		setErrors(updatedErrors);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		const inputs = e.currentTarget.getElementsByTagName("input");
		const body = Array.from(inputs).reduce((body, { name, value }) => ({ ...body, [name]: value }), {});

		const response = await fetch(`/api/${type}`, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (data.error) {
			const filteredErrors = Object.entries(data.error.errors).reduce((filtered: Errors, [key, value]) => {
				if (fieldKeys.includes(key)) {
					return {
						...filtered,
						[key]: value,
					};
				}

				return filtered;
			}, {});

			setErrors(filteredErrors);
			setLoading(false);
			return;
		}

		const userResponse = type === FormType.SIGN_IN
			? await signInWithEmailPassword(email, password)
			: await createUserWithEmailPassword(email, password);

		if (userResponse.hasError) {
			addError(userResponse.path as UserFormField, userResponse.message);
			setLoading(false);
			return;
		}

		setLoading(true);
	};

  const handleValueChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    name: UserFormField,
    value: string
  ): void => {
    if (errors[name]) {
			deleteError(name);
    }

		if (name === UserFormField.PASSWORD) {
			if (value === confirmPassword && !!errors.confirmPassword) {
				deleteError(UserFormField.CONFIRM_PASSWORD);
			} else if (value !== confirmPassword && confirmPassword && !errors.confirmPassword) {
				addError(UserFormField.CONFIRM_PASSWORD, confirmPasswordError);
			}
		}

		if (name === UserFormField.CONFIRM_PASSWORD) {
			if (value === password && !!errors.confirmPassword) {
				deleteError(name);
			} else if (value !== password && !errors.confirmPassword) {
				addError(UserFormField.CONFIRM_PASSWORD, confirmPasswordError);
			}
		}

		if (errors.form) {
			deleteError(UserFormField.FORM);
		}

    setter(value);
  };

	const submitDisabled = loading || (type === FormType.SIGN_IN
		? !email || !password || !isEmpty(errors)
		: !email || !password || !confirmPassword || !isEmpty(errors));

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<UserFormInput
				label="Email"
				type="text"
				field={Field.EMAIL}
				value={email}
				hasError={!!errors.email}
				errorMessages={errors.email?._errors ?? []}
				onChange={(e) => handleValueChange(setEmail, UserFormField.EMAIL, e.currentTarget.value)}
			/>

			<UserFormInput
				label="Password"
				type="password"
				field={Field.PASSWORD}
				value={password}
				hasError={!!errors.password}
				errorMessages={errors.password?._errors ?? []}
				onChange={(e) => handleValueChange(setPassword, UserFormField.PASSWORD, e.currentTarget.value)}
			/>

      {type === FormType.REGISTER && (
				<UserFormInput
					label="Confirm Password"
					type="password"
					field={Field.CONFIRM_PASSWORD}
					value={confirmPassword}
					hasError={!!errors.confirmPassword}
					errorMessages={errors.confirmPassword?._errors ?? []}
					onChange={(e) => handleValueChange(setConfirmPassword, UserFormField.CONFIRM_PASSWORD, e.currentTarget.value)}
				/>
      )}

      {type === FormType.SIGN_IN && (
        <Link href="/sign-in/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
      )}

			{!!errors.form && (
				<span className={styles.formElement}>
					<span className={styles.errorMessage}>
						{errors.form?._errors?.map((error) => <span key={error} style={{ textAlign: "center" }}>{error}</span>) ?? ""}
					</span>
				</span>
			)}

			<button className={styles.submit} type={submitDisabled ? "button" : "submit"} disabled={submitDisabled}>
				{loading ? <LoadingSpinner /> : type === FormType.REGISTER ? "Register" : "Log In"}
			</button>

      {type === FormType.REGISTER && (
        <span className={styles.footerCta}>Already have an account? <Link href="/sign-in">Sign In</Link></span>
      )}

      {type === FormType.SIGN_IN && (
        <span className={styles.footerCta}>Don&apos;t have an account yet? <Link href="/register">Register</Link></span>
      )}
		</form>
	);
}
