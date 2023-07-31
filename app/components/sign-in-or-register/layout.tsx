"use client";
import { FcGoogle } from "react-icons/fc";
import Page from "../Page";
import { Form } from "./form";
import styles from "./layout.module.scss";
import { googleLogIn } from "@/lib/users";
import { useAuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { FormType } from "./types";

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

	if (user) {
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
