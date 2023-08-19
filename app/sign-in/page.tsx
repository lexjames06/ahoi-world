import UserAccessForm from "../organisms/sign-in-or-register/form-layout";
import { FormType } from "../organisms/sign-in-or-register/types";

export function generateMetadata() {
	return { title: "Sign In" };
}

export default async function SignIn() {
	return <UserAccessForm type={FormType.SIGN_IN} header="AHOI" subHeader="Welcome back to the House" />;
}
