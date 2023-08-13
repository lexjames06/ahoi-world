"use client";
import { FcGoogle } from "react-icons/fc";
import { Form } from "./form";
import { googleLogIn } from "@ahoi-world/lib/users";
import { useAuthContext } from "@ahoi-world/providers/AuthContext";
import { redirect } from "next/navigation";
import { FormType } from "./types";
import { useFeatureFlagContext } from "@ahoi-world/providers/FeatureFlag";
import styles from "./form-layout.module.scss";
import { Page } from "@ahoi-world/templates/Page";

type SocialLogins = {
	google?: boolean;
};

const defaultSocialLogins = {
	google: true,
};

type Props = {
	type: FormType;
	header: string;
	subHeader: string;
	thirdPartyLogins?: SocialLogins;
};

export default function UserAccessForm({ type, header, subHeader, thirdPartyLogins = defaultSocialLogins }: Props) {
	const { user } = useAuthContext();
	const { auth } = useFeatureFlagContext();

	if (auth && auth.enabled && user && !user.username) {
		redirect("/sign-in/create-username");
	}

	if (user || !auth || !auth.enabled) {
		redirect("/");
	}

	return (
		<Page className={styles.container}>
			<div className={styles.formContainer}>
				<div className={styles.header}>
					<h2>{header}</h2>
					<p>{subHeader}</p>
				</div>
				{thirdPartyLogins.google && (
					<button className={styles.socialLogin} onClick={googleLogIn}>
						<FcGoogle />
						Log in with Google
					</button>
				)}
				<div className={styles.divider}>
					<span data-left />
					or
					<span data-right />
				</div>
				<Form type={type} />
			</div>
		</Page>
	);
}
