"use client";
import { useState } from "react";
import { isUserError, updateUser } from "@ahoi-world/lib/users";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useFeatureFlagContext } from "@ahoi-world/providers/FeatureFlag";
import { Field } from "@ahoi-world/organisms/sign-in-or-register/types";
import { ZodError } from "@ahoi-world/organisms/sign-in-or-register/form";
import { Page } from "@ahoi-world/templates";
import { LoadingSpinner, UserFormInput } from "@ahoi-world/atoms";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";
import { usernameRegex } from "./utils/zod-schema";
import styles from "./page.module.scss";

type CreateUsernameErrors = {
	[Field.USERNAME]?: ZodError;
	[Field.FORM]?: ZodError;
};

export default function CreateUsername() {
	const [errors, setErrors] = useState<CreateUsernameErrors>({});
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const { auth } = useFeatureFlagContext();
	const { user } = useAuthContext();

	if (!auth || !auth.enabled || !user || !!user.username) {
		redirect("/");
	}

	const handleValueChange = (value: string): void => {
		if (!!Object.keys(errors)?.length) {
			setErrors({});
		}

		const valid = value.match(usernameRegex)?.[0] === value;

		if (valid || !value) {
			setUsername(value);
			return;
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (!user) {
			return;
		}

		setLoading(true);
		e.preventDefault();

		const response = await fetch("/api/sign-in/create-username", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user, username }),
		});

		const data = await response.json();

		if (data.error) {
			setErrors(data.error.errors);
			setLoading(false);
			return;
		}

		const userError = await updateUser(user, { username });

		if (isUserError(userError) && userError.hasError) {
			setErrors({ [userError.path]: { _errors: [userError.message] } });
			setLoading(false);
			return;
		}
	};

	const submitDisabled = !!Object.keys(errors)?.length;
	const hasFormErrors = !!errors[Field.FORM];

	return (
		<Page className={styles.container}>
			<div className={styles.formContainer}>
				<div className={styles.header}>
					<h2>What&apos;s your username going to be?</h2>
					<p>Do your best to be unique 😉</p>
				</div>

				<form onSubmit={onSubmit} className={styles.form}>
					<UserFormInput
						label="Enter a username"
						type="text"
						field={Field.USERNAME}
						value={username}
						hasError={!!errors[Field.USERNAME]}
						errorMessages={errors[Field.USERNAME]?._errors ?? []}
						onChange={(e) => handleValueChange(e.currentTarget.value)}
					/>
					<span className={styles.atTag}>@</span>

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

					<button disabled={loading || submitDisabled}>
						{loading ? <LoadingSpinner /> : "Set username"}
					</button>

					{/* <Link href="/" className={styles.skipLink}>
						<p>Skip</p>
					</Link> */}
				</form>
			</div>
		</Page>
	);
}
