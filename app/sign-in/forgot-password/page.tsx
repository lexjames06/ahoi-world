"use client";

import styles from "./page.module.scss";

import { useState } from "react";


import { sendResetPasswordEmail } from "@ahoi-world/lib/users";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { redirect } from "next/navigation";
import { useFeatureFlagContext } from "@ahoi-world/providers/FeatureFlag";
import { Field } from "@ahoi-world/organisms/sign-in-or-register/types";
import { ZodError } from "@ahoi-world/organisms/sign-in-or-register/form";
import { Page } from "@ahoi-world/templates";
import { LoadingSpinner, UserFormInput } from "@ahoi-world/atoms";

type ForgotPasswordErrors = {
	[Field.EMAIL]?: ZodError;
	[Field.FORM]?: ZodError;
};

export default function ForgotPassword() {
	const [errors, setErrors] = useState<ForgotPasswordErrors>({});
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const { auth } = useFeatureFlagContext();

	if (!auth || !auth.enabled) {
		redirect("/");
	}

	const handleValueChange = (value: string): void => {
		if (!!Object.keys(errors)?.length) {
			setErrors({});
		}

		setEmail(value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();

		const response = await fetch("/api/sign-in/forgot-password", {
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
					{!!successMessage && <p className={styles.successMessage}>{successMessage}</p>}

					{!successMessage && (
						<>
							<UserFormInput
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
										{errors.form?._errors?.map((error) => (
											<span key={error} style={{ textAlign: "center" }}>
												{error}
											</span>
										)) ?? ""}
									</span>
								</span>
							)}

							<button disabled={loading || submitDisabled}>{loading ? <LoadingSpinner /> : "Send Code"}</button>
						</>
					)}

					<Link href="/sign-in" className={styles.returnLink}>
						<p>
							<BiArrowBack /> Back to login
						</p>
					</Link>
				</form>
			</div>
		</Page>
	);
}
