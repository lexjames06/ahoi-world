"use client";

import { useState } from "react";
import styles from "./form.module.scss";
import Link from "next/link";
import { Field, FormType } from "./types";
import { createUserWithEmailPassword, signInWithEmailPassword } from "@/lib/users";
import { LoadingSpinner } from "../LoadingSpinner";
import { BiShow, BiHide } from "react-icons/bi";
import { Input } from "../Input";

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

export function Form({ type }: Props) {
	const [errors, setErrors] = useState<Errors>({});
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const deleteError = (field: Field) => {
		const errorsCopy = errors;
		delete errorsCopy[field];
		setErrors(errorsCopy);
	};

	const addError = (field: Field, message:string) => {
		const updatedErrors = errors;
		updatedErrors[field] = { _errors: [message] };
		setErrors(updatedErrors);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		const inputs = e.currentTarget.getElementsByTagName("input");
		const body = Array.from(inputs).reduce((body, { name, value }) => ({ ...body, [name]: value }), {});

		const response = await fetch(`/${type}/api`, {
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
			setErrors(data.error.errors);
			setLoading(false);
			return;
		}

		const userResponse = type === FormType.SIGN_IN
			? await signInWithEmailPassword(email, password)
			: await createUserWithEmailPassword(email, password);

		console.log({userResponse});

		if (userResponse.hasError) {
			addError(userResponse.path, userResponse.message);
			setLoading(false);
			return;
		}
		setLoading(true);
	};

  const handleValueChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    name: Field,
    value: string
  ): void => {
    if (errors[name]) {
			deleteError(name);
    }

		if (name === Field.PASSWORD) {
			if (value === confirmPassword && !!errors.confirmPassword) {
				deleteError(Field.CONFIRM_PASSWORD);
			} else if (value !== confirmPassword && confirmPassword && !errors.confirmPassword) {
				addError(Field.CONFIRM_PASSWORD, confirmPasswordError);
			}
		}

		if (name === Field.CONFIRM_PASSWORD) {
			if (value === password && !!errors.confirmPassword) {
				deleteError(name);
			} else if (value !== password && !errors.confirmPassword) {
				addError(Field.CONFIRM_PASSWORD, confirmPasswordError);
			}
		}

		if (errors.form) {
			deleteError(Field.FORM);
		}

    setter(value);
  };

	const hasEmailErrors = !!errors.email;
	const hasPasswordErrors = !!errors.password;
	const hasConfirmPasswordErrors = !!errors.confirmPassword;
	const hasFormErrors = !!errors.form;

	const submitDisabled = loading || (type === FormType.SIGN_IN
		? !email || !password || !isEmpty(errors)
		: !email || !password || !confirmPassword || !isEmpty(errors));

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<Input
				label="Email"
				type="text"
				field={Field.EMAIL}
				value={email}
				hasError={!!errors.email}
				errorMessages={errors.email?._errors ?? []}
				onChange={(e) => handleValueChange(setEmail, Field.EMAIL, e.currentTarget.value)}
			/>
			{/* <span className={styles.formElement}>
				<input
					type="text"
					name="email"
					value={email}
					data-dirty={!!email}
          data-errored={hasEmailErrors}
					onChange={(e) => handleValueChange(setEmail, Field.EMAIL, e.currentTarget.value)}
				/>
				<label htmlFor="email">Email</label>
        {hasEmailErrors && (
          <span className={styles.errorMessage}>
            {errors.email?._errors?.map((error) => <span key={error}>{error}</span>) ?? ""}
          </span>
        )}
			</span> */}

			<Input
				label="Password"
				type="password"
				field={Field.PASSWORD}
				value={password}
				hasError={!!errors.password}
				errorMessages={errors.password?._errors ?? []}
				onChange={(e) => handleValueChange(setPassword, Field.PASSWORD, e.currentTarget.value)}
			/>
			{/* <span className={styles.formElement}>
				<input
					type={showPassword ? "text" : "password"}
					name="password"
					value={password}
					data-dirty={!!password}
          data-errored={hasPasswordErrors}
					onChange={(e) => handleValueChange(setPassword, Field.PASSWORD, e.currentTarget.value)}
				/>
				<span className={styles.inputIcon} onClick={() => setShowPassword((old) => !old)}>
					{showPassword ? <BiHide /> : <BiShow />}
				</span>
				<label htmlFor="password">Password</label>
        {hasPasswordErrors && (
          <span className={styles.errorMessage}>
            {errors.password?._errors?.map((error) => <span key={error}>{error}</span>) ?? ""}
          </span>
        )}
			</span> */}

      {type === FormType.REGISTER && (
				<Input
					label="Confirm Password"
					type="password"
					field={Field.CONFIRM_PASSWORD}
					value={confirmPassword}
					hasError={!!errors.confirmPassword}
					errorMessages={errors.confirmPassword?._errors ?? []}
					onChange={(e) => handleValueChange(setConfirmPassword, Field.CONFIRM_PASSWORD, e.currentTarget.value)}
				/>
        // <span className={styles.formElement}>
        //   <input
        //     type={showConfirmPassword ? "text" : "password"}
        //     name="confirmPassword"
        //     value={confirmPassword}
        //     data-dirty={!!confirmPassword}
        //     data-errored={hasConfirmPasswordErrors}
        //     onChange={(e) => handleValueChange(setConfirmPassword, Field.CONFIRM_PASSWORD, e.currentTarget.value)}
        //   />
				// 	<span className={styles.inputIcon} onClick={() => setShowConfirmPassword((old) => !old)}>
				// 		{showConfirmPassword ? <BiHide /> : <BiShow />}
				// 	</span>
        //   <label htmlFor="confirmPassword">Confirm Password</label>
        //   {hasConfirmPasswordErrors && (
        //     <span className={styles.errorMessage}>
        //       {errors.confirmPassword?._errors?.map((error) => <span key={error}>{error}</span>) ?? ""}
        //     </span>
        //   )}
        // </span>
      )}

      {type === FormType.SIGN_IN && (
        <Link href="/sign-in/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
      )}

			{hasFormErrors && (
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
